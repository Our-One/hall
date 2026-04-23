import Link from "next/link";
import { LogoHorizontal } from "@/components/logo";

export function HallFooter() {
  return (
    <footer className="mt-24 border-t border-stone-200 bg-[#F5F0EA]">
      <div className="mx-auto max-w-[72rem] px-6 py-12">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
          <div className="col-span-2 sm:col-span-1">
            <Link href="/" aria-label="Our.one / Hall home">
              <LogoHorizontal className="h-3 text-stone-500" />
            </Link>
            <p className="mt-4 text-xs text-stone-500">Our.one / Hall</p>
            <p className="mt-2 text-xs text-stone-400">Prague, 2026</p>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
              On Hall
            </div>
            <div className="flex flex-col gap-2.5">
              <Link href="/" className="text-xs text-stone-500 transition-colors hover:text-stone-800">
                Ship feed
              </Link>
              <Link href="/inside" className="text-xs text-stone-500 transition-colors hover:text-stone-800">
                Inside
              </Link>
              <Link href="/inside/constitution" className="text-xs text-stone-500 transition-colors hover:text-stone-800">
                Constitution
              </Link>
              <Link href="/inside/members" className="text-xs text-stone-500 transition-colors hover:text-stone-800">
                Members
              </Link>
            </div>
          </div>

          <div>
            <div className="mb-4 text-[11px] font-medium uppercase tracking-[0.2em] text-stone-400">
              Our.one
            </div>
            <div className="flex flex-col gap-2.5">
              <a
                href="https://our.one"
                className="text-xs text-stone-500 transition-colors hover:text-stone-800"
              >
                our.one
              </a>
              <a
                href="https://our.one/manifesto"
                className="text-xs text-stone-500 transition-colors hover:text-stone-800"
              >
                Manifesto
              </a>
              <a
                href="https://our.one/join"
                className="text-xs text-stone-500 transition-colors hover:text-stone-800"
              >
                Become a Founding Patron
              </a>
              <a
                href="https://github.com/Our-One/hall"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-stone-500 transition-colors hover:text-stone-800"
              >
                Source ↗
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
