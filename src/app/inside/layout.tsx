import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HallNav } from "@/components/nav";
import { HallFooter } from "@/components/footer";

export default async function InsideLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <>
      <HallNav />
      <main className="min-h-[calc(100vh-200px)]">{children}</main>
      <HallFooter />
    </>
  );
}
