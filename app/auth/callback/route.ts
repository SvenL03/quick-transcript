import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const errorParam = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") ?? "/transcribe";

  const forwardedHost = request.headers.get("x-forwarded-host");
  const base =
    process.env.NODE_ENV === "development"
      ? origin
      : forwardedHost
      ? `https://${forwardedHost}`
      : origin;

  console.log("[auth/callback]", {
    code: code ? `${code.slice(0, 8)}…` : null,
    errorParam,
    base,
    cookieNames: request.cookies.getAll().map((c) => c.name),
  });

  if (errorParam) {
    console.error("[auth/callback] Provider error:", errorParam, errorDescription);
    return NextResponse.redirect(
      `${base}/login?error=${encodeURIComponent(errorParam)}`
    );
  }

  if (code) {
    const cookieStore = await cookies();

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          // Write directly to cookieStore — Next.js queues these as Set-Cookie
          // headers independently of which Response object we return.
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
            cookiesToSet.forEach(({ name, value, options }) => {
              cookieStore.set(name, value, options ?? {});
            });
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("[auth/callback] exchange result:", {
      success: !error,
      hasSession: !!data?.session,
      userId: data?.user?.id ?? null,
      error: error?.message ?? null,
    });

    if (!error && data.session) {
      return NextResponse.redirect(`${base}${next}`);
    }

    const msg = error?.message ?? "no_session_returned";
    return NextResponse.redirect(
      `${base}/login?error=${encodeURIComponent(msg)}`
    );
  }

  return NextResponse.redirect(`${base}/login?error=no_code`);
}
