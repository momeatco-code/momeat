"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  sendEmailOtp,
  verifyEmailOtp,
  persistOnboardingIntake,
} from "@/modules/identity/actions";
import {
  getStoredIntake,
  clearStoredIntake,
} from "@/modules/identity/onboarding-storage";

type Step = "email" | "code";

export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await sendEmailOtp(email);

    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setStep("code");
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const result = await verifyEmailOtp(email, code);

    if (!result.ok) {
      setIsSubmitting(false);
      setErrorMessage(result.message);
      return;
    }

    // Puente: si el usuario respondió las 3 preguntas antes de tener cuenta
    // (guardadas en el navegador), ahora que hay sesión las subimos a Supabase.
    // Simplificación actual: como el paso de Pago (Fase 4) todavía no existe,
    // este es el primer punto real donde hay sesión para volcar el intake.
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
      // Si falla la subida, no bloqueamos el login — las respuestas quedan
      // en localStorage y se reintentará en el próximo login exitoso.
    }

    setIsSubmitting(false);
    router.push("/reservations/new");
    router.refresh();
  }

  return (
    <main className="min-h-screen bg-[#fbf7f1] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-8">
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          MomEat
        </p>

        {step === "email" ? (
          <>
            <h1 className="mt-4 text-2xl font-semibold">
              Resuélvelo una vez, vívelo todos los días
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Ingresa tu email y te enviamos un código para entrar. Sin
              contraseñas que recordar.
            </p>

            <form onSubmit={handleSendCode} className="mt-8 flex flex-col gap-4">
              <input
                type="email"
                required
                autoFocus
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base outline-none focus:border-amber-700"
              />

              {errorMessage && (
                <p className="text-sm text-red-700">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#C7642B] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Enviando..." : "Enviar código"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-4 text-2xl font-semibold">Revisa tu email</h1>
            <p className="mt-2 text-sm text-zinc-600">
              Te enviamos un código de 6 dígitos a{" "}
              <span className="font-medium text-zinc-950">{email}</span>.
            </p>

            <form onSubmit={handleVerifyCode} className="mt-8 flex flex-col gap-4">
              <input
                type="text"
                inputMode="numeric"
                pattern="[0-9]{6}"
                maxLength={6}
                required
                autoFocus
                placeholder="000000"
                value={code}
                onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                className="rounded-xl border border-zinc-300 bg-white px-4 py-3 text-center text-2xl tracking-[0.5em] outline-none focus:border-amber-700"
              />

              {errorMessage && (
                <p className="text-sm text-red-700">{errorMessage}</p>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                className="rounded-full bg-[#C7642B] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {isSubmitting ? "Verificando..." : "Confirmar"}
              </button>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setCode("");
                  setErrorMessage(null);
                }}
                className="text-sm text-zinc-600 underline underline-offset-2"
              >
                Usar otro email
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
