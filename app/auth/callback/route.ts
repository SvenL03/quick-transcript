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
  const base = forwardedHost ? `https://${forwardedHost}` : origin;

  // Log everything so we can diagnose from Vercel function logs
  console.log("[auth/callback]", {
    code: code ? `${code.slice(0, 8)}…` : null,
    errorParam,
    errorDescription,
    base,
    cookies: request.cookies.getAll().map((c) => c.name),
  });

  if (errorParam) {
    console.error("[auth/callback] OAuth error from provider:", errorParam, errorDescription);
    return NextResponse.redirect(`${base}/login?error=${encodeURIComponent(errorParam)}`);
  }

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
            cookiesToSet.forEach((c) => pending.push(c));
          },
        },
      }
    );

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    console.log("[auth/callback] exchangeCodeForSession:", {
      success: !error,
      error: error?.message,
      userId: data?.user?.id,
      pendingCookies: pending.map((c) => c.name),
    });

    if (!error) {
      const response = NextResponse.redirect(`${base}${next}`);
      pending.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options ?? {});
      });
      return response;
    }

    return NextResponse.redirect(`${base}/login?error=${encodeURIComponent(error.message)}`);
  }

  console.error("[auth/callback] No code and no error — unexpected state");
  return NextResponse.redirect(`${base}/login?error=no_code`);
}
