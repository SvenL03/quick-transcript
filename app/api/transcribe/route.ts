import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import { AssemblyAI } from "assemblyai";

const POLL_INTERVAL_MS = 3000;
const POLL_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes

export async function POST(request: NextRequest) {
  // Verify auth
  const cookieStore = await cookies();
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setAll: (toSet: Array<{ name: string; value: string; options?: any }>) =>
          toSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          ),
      },
    }
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Parse form data
  const formData = await request.formData();
  const audioFile = formData.get("audio") as File | null;
  const paragraphs = formData.get("paragraphs") === "true";
  const timestamps = formData.get("timestamps") === "true";

  if (!audioFile) {
    return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
  }

  const client = new AssemblyAI({ apiKey: process.env.ASSEMBLYAI_API_KEY! });

  // Upload audio to AssemblyAI
  const audioBuffer = await audioFile.arrayBuffer();
  const uploadUrl = await client.files.upload(Buffer.from(audioBuffer));

  // Request transcription
  const transcript = await client.transcripts.create({
    audio_url: uploadUrl,
    punctuate: true,
    format_text: true,
  });

  // Poll until done
  const deadline = Date.now() + POLL_TIMEOUT_MS;
  let current = transcript;

  while (current.status !== "completed" && current.status !== "error") {
    if (Date.now() > deadline) {
      return NextResponse.json(
        { error: "Transcription timed out. Please try again with a shorter file." },
        { status: 408 }
      );
    }
    await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    current = await client.transcripts.get(transcript.id);
  }

  if (current.status === "error") {
    return NextResponse.json(
      { error: current.error ?? "Transcription failed. Please try again." },
      { status: 500 }
    );
  }

  // Log usage to Supabase (fire-and-forget, never block the response)
  supabase.from("transcription_logs").insert({
    user_id: user.id,
    audio_duration_seconds: current.audio_duration ?? null,
  }).then(() => {});

  // If paragraphs requested, fetch structured paragraphs
  if (paragraphs) {
    const paragraphsResponse = await client.transcripts.paragraphs(transcript.id);
    const formatted = formatWithParagraphs(
      paragraphsResponse.paragraphs ?? [],
      timestamps
    );
    return NextResponse.json({ text: formatted });
  }

  // Plain text
  return NextResponse.json({ text: current.text ?? "" });
}

function msToTimestamp(ms: number): string {
  const totalSeconds = Math.floor(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `[${minutes}:${String(seconds).padStart(2, "0")}]`;
}

function formatWithParagraphs(
  paragraphs: Array<{ text: string; start: number }>,
  timestamps: boolean
): string {
  return paragraphs
    .map((p) => {
      const prefix = timestamps ? `${msToTimestamp(p.start)} ` : "";
      return `${prefix}${p.text}`;
    })
    .join("\n\n");
}
