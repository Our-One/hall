export default function MembersPage() {
  return (
    <div className="px-6 py-16 md:py-24">
      <div className="mx-auto max-w-[48rem]">
        <p className="font-sans text-[11px] font-medium uppercase tracking-[0.25em] text-stone-500">
          Member directory
        </p>
        <h1 className="mt-6 font-serif text-4xl font-bold leading-tight tracking-tight text-stone-900 md:text-5xl">
          Who&rsquo;s here.
        </h1>
        <p className="mt-6 font-serif text-lg leading-relaxed text-stone-600 md:text-xl">
          Founding Patrons and Members appear in this directory if they
          opt-in at checkout. Names are public by default for opted-in
          members; you can opt out any time.
        </p>

        <div className="mt-12 rounded-md border border-stone-200 bg-white p-6">
          <p className="font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-stone-400">
            Members visible
          </p>
          <p className="mt-3 font-serif text-base text-stone-600">
            No opted-in members yet. The directory populates when Stripe
            checkout opens and Patrons / Members complete signup with the
            opt-in toggled on.
          </p>
        </div>
      </div>
    </div>
  );
}
