import Link from "next/link";
import { LogoHorizontal } from "@/components/logo";
import { auth } from "@/auth";

export async function HallNav() {
  const session = await auth();
  const isAuthed = !!session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200/60 bg-[#FDFBF7]/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-[72rem] items-center justify-between px-6 py-5">
        <Link href="/" aria-label="Our.one / Hall home" className="flex items-center gap-3">
          <LogoHorizontal className="h-5 text-stone-800" />
          <span className="font-sans text-xs uppercase tracking-[0.2em] text-stone-500">
            / Hall
          </span>
        </Link>

        <nav className="flex items-center gap-5 sm:gap-6">
          <Link
            href="/"
            className="font-sans text-xs text-stone-500 transition-colors hover:text-stone-800"
          >
            Ship feed
          </Link>
          <Link
            href="/inside"
            className="font-sans text-xs text-stone-500 transition-colors hover:text-stone-800"
          >
            Inside
          </Link>
          <Link
            href="/inside/constitution"
            className="hidden font-sans text-xs text-stone-500 transition-colors hover:text-stone-800 sm:inline"
          >
            Constitution
          </Link>
          <Link
            href="/inside/members"
            className="hidden font-sans text-xs text-stone-500 transition-colors hover:text-stone-800 sm:inline"
          >
            Members
          </Link>
          {isAuthed ? (
            <span className="font-sans text-xs text-stone-700">
              {session?.user?.name ?? session?.user?.email}
            </span>
          ) : (
            <Link
              href="/login"
              className="font-sans text-xs font-medium text-stone-900 underline decoration-stone-300 underline-offset-4 transition-colors hover:decoration-stone-900"
            >
              Sign in
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
