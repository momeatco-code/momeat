"use client";

import { useRouter } from "next/navigation";

export default function EntryPortal() {
  const router = useRouter();

  return (
    <main className="min-h-screen bg-[#fbf7f1] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          MomEat
        </p>

        <h1 className="mt-4 text-3xl font-semibold leading-tight">
          Resuélvelo una vez,
          <br />
          vívelo todos los días.
        </h1>

        <p className="mt-3 text-sm text-zinc-600">
          ¿Ya tienes una cuenta con nosotros, o es tu primera vez?
        </p>

        <div className="mt-8 flex flex-col gap-3">
          <button
            type="button"
            onClick={() => router.push("/login")}
            className="rounded-full bg-[#C7642B] px-6 py-4 text-sm font-semibold text-white transition hover:opacity-90"
          >
            Ya soy usuario
          </button>

          <button
            type="button"
            onClick={() => router.push("/onboarding")}
            className="rounded-full border border-zinc-300 bg-white px-6 py-4 text-sm font-semibold text-zinc-950 transition hover:border-zinc-950"
          >
            Es mi primera vez
          </button>
        </div>
      </div>
    </main>
  );
}
