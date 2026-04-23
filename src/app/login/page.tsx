import { auth, signIn } from "@/auth";
import { redirect } from "next/navigation";
import { LogoHorizontal } from "@/components/logo";

export const metadata = {
  title: "Sign in",
};

const isDev = process.env.NODE_ENV === "development";

// In production, this is the URL Hall returns the user to after OAuth
// completes on our.one. In dev, the cross-domain proxy doesn't apply
// (different localhost ports can't share cookies anyway), so OAuth
// buttons are hidden in dev mode.
const PROD_HALL_BASE = "https://hall.our.one";
const PROD_OUR_ONE_BASE = "https://our.one";

function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844a9.59 9.59 0 0 1 2.504.337c1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.02 10.02 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
    </svg>
  );
}

function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1Z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23Z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.97 10.97 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84Z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53Z" fill="#EA4335" />
    </svg>
  );
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.114-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
    </svg>
  );
}

function getSafeRedirect(callbackUrl?: string): string {
  if (!callbackUrl) return "/inside";
  if (callbackUrl.startsWith("/") && !callbackUrl.startsWith("//")) return callbackUrl;
  return "/inside";
}

function crossSigninUrl(provider: string, hallPath: string): string {
  // OAuth runs on our.one; user comes back to Hall at hallPath.
  const callback = `${PROD_HALL_BASE}${hallPath}`;
  return `${PROD_OUR_ONE_BASE}/cross-signin?provider=${encodeURIComponent(provider)}&callbackUrl=${encodeURIComponent(callback)}`;
}

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const { callbackUrl } = await searchParams;
  const redirectTo = getSafeRedirect(callbackUrl);

  if (session?.user) {
    redirect(redirectTo);
  }

  const inputClass =
    "w-full rounded-md border border-stone-300 bg-white px-4 py-3 font-sans text-sm text-stone-900 placeholder:text-stone-400 focus:border-stone-900 focus:outline-none";
  const primaryButton =
    "w-full rounded-md bg-stone-900 px-4 py-3 font-sans text-sm font-medium text-[#FDFBF7] hover:bg-stone-700";
  const secondaryButton =
    "flex w-full items-center justify-center gap-2 rounded-md border border-stone-300 bg-white px-4 py-3 font-sans text-sm font-medium text-stone-900 hover:bg-stone-50";

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-6">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-start gap-4">
          <a href="/" aria-label="Our.one / Hall home" className="flex items-center gap-3">
            <LogoHorizontal className="h-5 text-stone-800" />
            <span className="font-sans text-xs uppercase tracking-[0.2em] text-stone-500">
              / Hall
            </span>
          </a>
          <p className="font-serif text-xl leading-snug text-stone-700">
            Sign in to vote, comment, and see the full ship feed.
          </p>
        </div>

        {isDev && (
          <form
            action={async (formData) => {
              "use server";
              await signIn("dev-login", {
                email: formData.get("email") as string,
                redirectTo,
              });
            }}
            className="space-y-3"
          >
            <input
              type="email"
              name="email"
              placeholder="dev@our.one"
              defaultValue="dev@our.one"
              required
              className={inputClass}
            />
            <button type="submit" className={primaryButton}>
              Dev sign in
            </button>
            <p className="text-center font-sans text-xs text-stone-500">
              Development mode — no email verification
            </p>
          </form>
        )}

        {!isDev && (
          <form
            action={async (formData) => {
              "use server";
              await signIn("resend", {
                email: formData.get("email") as string,
                redirectTo,
              });
            }}
            className="space-y-3"
          >
            <input
              type="email"
              name="email"
              placeholder="you@example.com"
              required
              className={inputClass}
            />
            <button type="submit" className={primaryButton}>
              Continue with email
            </button>
          </form>
        )}

        {!isDev && (
          <>
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-stone-200" />
              <span className="font-sans text-xs text-stone-500">or</span>
              <div className="h-px flex-1 bg-stone-200" />
            </div>

            <a
              href={crossSigninUrl("github", redirectTo)}
              className={secondaryButton}
            >
              <GitHubIcon className="h-4 w-4" />
              Continue with GitHub
            </a>

            <a
              href={crossSigninUrl("google", redirectTo)}
              className={secondaryButton}
            >
              <GoogleIcon className="h-4 w-4" />
              Continue with Google
            </a>

            <a
              href={crossSigninUrl("linkedin", redirectTo)}
              className={secondaryButton}
            >
              <LinkedInIcon className="h-4 w-4" />
              Continue with LinkedIn
            </a>

            <p className="font-sans text-[11px] text-stone-500 text-center">
              OAuth runs on our.one; you&rsquo;ll come back to Hall signed in.
            </p>
          </>
        )}

        <p className="text-center font-sans text-xs text-stone-500">
          By signing in you agree to our{" "}
          <a
            href="https://our.one/terms"
            className="underline underline-offset-2 hover:text-stone-900"
          >
            Terms
          </a>{" "}
          and{" "}
          <a
            href="https://our.one/privacy"
            className="underline underline-offset-2 hover:text-stone-900"
          >
            Privacy Policy
          </a>
          .
        </p>
      </div>
    </main>
  );
}
