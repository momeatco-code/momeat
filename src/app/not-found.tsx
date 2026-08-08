import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">Esta página no existe.</h1>
      <Link className="mt-5 font-medium underline" href="/">
        Volver a MomEat
      </Link>
    </main>
  );
}
