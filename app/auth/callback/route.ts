import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next") ?? "/transcribe";

  // On Vercel, use the forwarded host so the redirect goes to the correct
  // public domain rather than the internal deployment URL.
  const forwardedHost = request.headers.get("x-forwarded-host");
  const base =
    forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  if (code) {
    const cookieStore = await cookies();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const pending: Array<{ name: string; value: string; options?: any }> = [];

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            // Collect cookies so we can attach them to the redirect response
            cookiesToSet.forEach((c) => pending.push(c));
          },
        },
      }
    );

    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      const response = NextResponse.redirect(`${base}${next}`);
      // Explicitly copy session cookies onto the redirect response —
      // without this the session is lost before the next request.
      pending.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options ?? {});
      });
      return response;
    }
  }

  return NextResponse.redirect(`${base}/login?error=auth_failed`);
}
