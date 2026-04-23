"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen items-center justify-center px-6">
      <div className="max-w-md text-center">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
          Something broke
        </p>
        <h1 className="mt-4 font-serif text-3xl font-bold text-stone-900">
          Hall hit an error.
        </h1>
        <p className="mt-4 font-serif text-stone-600">
          We&rsquo;ll log this and ship a fix. If you&rsquo;re an operator,
          check <code className="font-mono text-sm">/api/health</code> for
          env + DB diagnostics.
        </p>
        {error.digest && (
          <p className="mt-3 font-mono text-xs text-stone-400">
            Digest: {error.digest}
          </p>
        )}
        <button
          onClick={reset}
          className="mt-8 inline-flex items-center justify-center border-2 border-stone-900 bg-stone-900 px-5 py-3 font-sans text-sm font-medium text-[#FDFBF7] hover:bg-stone-700"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
