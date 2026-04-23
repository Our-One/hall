export const metadata = {
  title: "Check your email",
};

export default function VerifyPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#FDFBF7] px-6">
      <div className="w-full max-w-sm space-y-4 text-center">
        <h1 className="font-serif text-2xl font-bold text-stone-900">
          Check your email.
        </h1>
        <p className="font-serif text-base text-stone-600">
          We sent you a sign-in link. Click it to continue into Hall.
        </p>
      </div>
    </main>
  );
}
