export default function ConstitutionPage() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[48rem]">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
          The Constitution
        </p>
        <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-stone-900 md:text-5xl">
          Our.one — Constitution v1.0
        </h1>
        <p className="mt-6 font-serif text-lg leading-relaxed text-stone-600 md:text-xl">
          The full Constitution lives at{" "}
          <a
            href="https://our.one/constitution"
            className="underline decoration-stone-400 underline-offset-4 hover:decoration-stone-900"
          >
            our.one/constitution
          </a>
          . Once Hall&rsquo;s amendment overlay ships, you&rsquo;ll see pending
          amendments in line with each provision and be able to vote on them
          here.
        </p>

        <div className="mt-12 rounded-md border border-stone-200 bg-white p-6">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
            Pending amendments
          </p>
          <p className="mt-3 font-serif text-base text-stone-600">
            None right now. The constitution is at v1.0 and stable since
            April 2026.
          </p>
        </div>
      </div>
    </div>
  );
}
