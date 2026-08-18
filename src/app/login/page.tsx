"use client";

import { useState } from "react";
import { sendEmailOtp } from "@/modules/identity/actions";
import { Logo } from "@/components/logo";

type Step = "email" | "sent";

export default function LoginPage() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSendLink(e: React.FormEvent) {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    const redirectTo =
      typeof window !== "undefined"
        ? `${window.location.origin}/auth/confirm`
        : undefined;

    const result = await sendEmailOtp(email, redirectTo);

    setIsSubmitting(false);

    if (!result.ok) {
      setErrorMessage(result.message);
      return;
    }

    setStep("sent");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-cream px-6 py-8">
      <div className="w-full max-w-md">
        <Logo height={32} animate />

        <div className="mt-8 rounded-[2rem] border border-charcoal/10 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(43,33,24,0.15)]">
          {step === "email" ? (
            <>
              <h1 className="font-heading text-2xl font-semibold leading-tight text-charcoal">
                Resuélvelo una vez,
                <br />
                vívelo todos los días
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                Ingresa tu email y te enviamos un link para entrar. Sin
                contraseñas que recordar.
              </p>

              <form
                onSubmit={handleSendLink}
                className="mt-8 flex flex-col gap-4"
              >
                <input
                  type="email"
                  required
                  autoFocus
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="rounded-xl border border-charcoal/15 bg-cream/40 px-4 py-3 text-base text-charcoal outline-none transition-colors focus:border-salvia focus:bg-white"
                />

                {errorMessage && (
                  <p className="text-sm text-red-700">{errorMessage}</p>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`rounded-full px-6 py-3 text-sm font-semibold text-white transition-all duration-150 active:scale-[0.98] disabled:active:scale-100 ${
                    isSubmitting
                      ? "animate-pulse bg-salvia"
                      : "bg-terracota hover:bg-terracota/90 active:bg-salvia"
                  }`}
                >
                  {isSubmitting ? "Enviando..." : "Enviar link"}
                </button>
              </form>
            </>
          ) : (
            <>
              <h1 className="font-heading text-2xl font-semibold text-charcoal">
                Revisa tu email
              </h1>
              <p className="mt-3 text-sm leading-relaxed text-charcoal/70">
                Te enviamos un link a{" "}
                <span className="font-medium text-charcoal">{email}</span>.
                Ábrelo desde este mismo dispositivo para entrar.
              </p>

              <button
                type="button"
                onClick={() => {
                  setStep("email");
                  setErrorMessage(null);
                }}
                className="mt-8 text-sm text-charcoal/60 underline underline-offset-2 transition-colors hover:text-charcoal"
              >
                Usar otro email
              </button>
            </>
          )}
        </div>
      </div>
    </main>
  );
}
