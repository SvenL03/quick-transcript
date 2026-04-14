"use client";

export const dynamic = "force-dynamic";

import { useState } from "react";
import AudioDropzone from "@/components/AudioDropzone";
import TranscriptSettings from "@/components/TranscriptSettings";
import TranscriptView from "@/components/TranscriptView";
import ProgressRing from "@/components/ProgressRing";

type State = "upload" | "loading" | "result" | "error";

interface Settings {
  paragraphs: boolean;
  timestamps: boolean;
}

export default function TranscribePage() {
  const [file, setFile] = useState<File | null>(null);
  const [settings, setSettings] = useState<Settings>({ paragraphs: true, timestamps: true });
  const [state, setState] = useState<State>("upload");
  const [transcript, setTranscript] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  async function handleTranscribe() {
    if (!file) return;
    setState("loading");
    setErrorMsg("");

    try {
      const formData = new FormData();
      formData.append("audio", file);
      formData.append("paragraphs", String(settings.paragraphs));
      formData.append("timestamps", String(settings.timestamps));

      const res = await fetch("/api/transcribe", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? "Something went wrong. Try again.");
        setState("error");
        return;
      }

      setTranscript(data.text);
      setState("result");
    } catch {
      setErrorMsg("Something went wrong. Try again.");
      setState("error");
    }
  }

  function reset() {
    setFile(null);
    setTranscript("");
    setErrorMsg("");
    setState("upload");
  }

  return (
    <div className="min-h-screen flex items-start justify-center px-4 py-16">
      <div className="w-full max-w-xl">
        <h1 className="text-lg font-semibold tracking-tight mb-8">
          quick-transcript
        </h1>

        {state === "result" ? (
          <TranscriptView text={transcript} onReset={reset} />
        ) : (
          <div className="space-y-5">
            <AudioDropzone
              file={file}
              onFile={setFile}
              onClear={() => setFile(null)}
            />

            {state !== "loading" && (
              <TranscriptSettings settings={settings} onChange={setSettings} />
            )}

            {state === "loading" ? (
              <div className="flex items-center justify-center py-4">
                <ProgressRing isLoading={true} isComplete={false} />
              </div>
            ) : (
              <button
                onClick={handleTranscribe}
                disabled={!file}
                className="w-full bg-[#2563EB] text-white rounded-lg px-4 py-3 text-sm font-medium hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Transcribe
              </button>
            )}

            {state === "error" && (
              <div className="border border-[#DC2626] rounded-lg px-4 py-3 flex items-center justify-between">
                <p className="text-sm text-[#DC2626]">{errorMsg}</p>
                <button
                  onClick={() => setState("upload")}
                  className="text-xs text-[#DC2626] underline ml-4 flex-shrink-0"
                >
                  Retry
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
