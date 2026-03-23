import { NextResponse } from "next/server";
import { createClient } from "@/utils/supabase/server";

function isValidRedirectPath(path: string): boolean {
  // Only allow relative paths starting with /
  if (!path.startsWith("/")) return false;
  // Prevent open redirects to external URLs
  if (path.startsWith("//")) return false;
  return true;
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");

  let next = searchParams.get("next") ?? "/";

  // Validate redirect path to prevent open redirect
  if (!isValidRedirectPath(next)) {
    next = "/";
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      // Always use origin from request URL - don't trust x-forwarded-host
      // This prevents header spoofing attacks
      return NextResponse.redirect(`${origin}${next}`);
    }
  }

  return NextResponse.redirect(`${origin}/auth/auth-code-error`);
}
