import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase-server";
import LoginForm from "@/components/LoginForm";

export const dynamic = "force-dynamic";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string; error?: string; error_description?: string }>;
}) {
  const params = await searchParams;

  // If Supabase redirected the OAuth code here instead of /auth/callback,
  // forward it so the exchange can happen.
  if (params.code || params.error) {
    const qs = new URLSearchParams();
    if (params.code) qs.set("code", params.code);
    if (params.error) qs.set("error", params.error);
    if (params.error_description) qs.set("error_description", params.error_description);
    redirect(`/auth/callback?${qs.toString()}`);
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    redirect("/transcribe");
  }

  return <LoginForm />;
}
