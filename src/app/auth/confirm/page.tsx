"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { EmailOtpType } from "@supabase/supabase-js";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { persistOnboardingIntake } from "@/modules/identity/actions";
import {
  getStoredIntake,
  clearStoredIntake,
} from "@/modules/identity/onboarding-storage";

type Status = "waiting" | "processing" | "error";

const VALID_TYPES: EmailOtpType[] = [
  "signup",
  "magiclink",
  "recovery",
  "invite",
  "email_change",
  "email",
];

function ConfirmContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const type = VALID_TYPES.includes(typeParam as EmailOtpType)
    ? (typeParam as EmailOtpType)
    : null;

  const isValidLink = Boolean(tokenHash && type);

  const [status, setStatus] = useState<Status>(
    isValidLink ? "waiting" : "error",
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(
    isValidLink ? null : "Este link no es válido. Pide uno nuevo.",
  );

  async function handleConfirm() {
    if (!tokenHash || !type) return;

    setStatus("processing");

    // El link del correo apunta AQUÍ primero (no directo a Supabase),
    // y el canje solo ocurre dentro de este clic real. Así, si algo
    // visita el link por adelantado (un escáner de seguridad de correo),
    // solo carga esta página sin consumir nada — el token real de un
    // solo uso se gasta recién aquí, con la persona presente.
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type,
    });

    if (error) {
      setStatus("error");
      setErrorMessage("El link expiró o ya fue usado. Pide uno nuevo.");
      return;
    }

    const { answers } = getStoredIntake();
    if (answers.length > 0) {
      const persistResult = await persistOnboardingIntake(
        answers.map((a) => ({
          questionSlug: a.questionSlug,
          inputMode: a.inputMode,
          rawText: a.rawText,
        })),
      );
      if (persistResult.ok) {
        clearStoredIntake();
      }
    }

    router.push("/reservations/new");
    router.refresh();
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-8">
      <div className="w-full max-w-md text-center">
        <p className="font-heading text-sm font-semibold uppercase tracking-[0.35em] text-terracota">
          MomEat
        </p>

        <div className="mt-6 rounded-[2rem] border border-charcoal/10 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.15)]">
          {status === "waiting" && (
            <>
              <h1 className="font-heading text-2xl font-semibold text-charcoal">
                Ya casi
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                Confirma para entrar a tu cuenta.
              </p>
              <button
                type="button"
                onClick={handleConfirm}
                className="mt-6 w-full rounded-full bg-terracota px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-terracota/90 active:scale-[0.98] active:bg-salvia"
              >
                Confirmar y entrar
              </button>
            </>
          )}

          {status === "processing" && (
            <p className="text-sm text-charcoal/70">Confirmando...</p>
          )}

          {status === "error" && (
            <>
              <p className="text-sm text-red-700">{errorMessage}</p>
              <button
                type="button"
                onClick={() => router.push("/login")}
                className="mt-6 rounded-full bg-terracota px-6 py-3 text-sm font-semibold text-white transition-all duration-150 hover:bg-terracota/90 active:scale-[0.98]"
              >
                Volver a intentar
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

export default function ConfirmPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center bg-cream">
          <p className="text-sm text-charcoal/70">Cargando...</p>
        </main>
      }
    >
      <ConfirmContent />
    </Suspense>
  );
}
