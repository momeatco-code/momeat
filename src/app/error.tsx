"use client";

import { useEffect } from "react";
import { logError } from "@/shared/observability/logger";

export default function GlobalError({
  error,
  reset,
}: Readonly<{ error: Error & { digest?: string }; reset: () => void }>) {
  useEffect(() => {
    logError("app.render_error", error, { digest: error.digest });
  }, [error]);

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col justify-center px-6">
      <h1 className="text-2xl font-semibold">No pudimos cargar esta página.</h1>
      <p className="mt-3 text-stone-600">
        Inténtalo nuevamente. El incidente quedó registrado para revisión.
      </p>
      <button
        className="mt-6 w-fit rounded-full bg-stone-950 px-5 py-3 font-medium text-white"
        onClick={reset}
        type="button"
      >
        Reintentar
      </button>
    </main>
  );
}
