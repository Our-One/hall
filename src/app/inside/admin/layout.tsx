import { redirect } from "next/navigation";
import Link from "next/link";
import { getOperatorSession } from "@/lib/operator";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getOperatorSession();
  if (!session) {
    redirect("/inside");
  }

  return (
    <div className="border-t border-stone-200 bg-[#F5F2EB]">
      <div className="mx-auto max-w-[64rem] px-6 py-6">
        <div className="flex items-center gap-5 font-sans text-xs">
          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-stone-500">
            Operator
          </span>
          <Link href="/inside/admin/posts" className="text-stone-700 hover:text-stone-900">
            Posts
          </Link>
          <Link href="/inside/admin/posts/new" className="text-stone-700 hover:text-stone-900">
            New post
          </Link>
        </div>
      </div>
      {children}
    </div>
  );
}
