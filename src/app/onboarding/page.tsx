"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveIntakeAnswer,
  type QuestionSlug,
} from "@/modules/identity/onboarding-storage";
import { Logo } from "@/components/logo";

type Question = {
  slug: QuestionSlug;
  title: string;
  microcopy: string;
  example: string;
};

const QUESTIONS: Question[] = [
  {
    slug: "who_are_we_caring_for",
    title: "¿Para quiénes vamos a tener la comida lista?",
    microcopy: "Cuéntanos si es solo para ti, para tu pareja o para tu equipo.",
    example:
      "Soy yo sola, trabajo desde casa y necesito almuerzos saludables.",
  },
  {
    slug: "tastes_and_restrictions",
    title: "¿Qué comida disfrutas más y qué ingredientes debemos evitar?",
    microcopy:
      "Menciona tus platos favoritos, dietas o intolerancias. Nosotros nos encargamos para que no tengas que pensarlo.",
    example:
      "Me encanta la comida casera y alta en proteína. Por favor, nada de cebolla ni lácteos.",
  },
  {
    slug: "days_and_logistics",
    title: "¿Para cuántos días quieres que dejemos esto resuelto?",
    microcopy:
      "Indícanos el tiempo. Los detalles exactos de entrega los confirmaremos en el siguiente paso.",
    example: "Para los próximos 5 días, de lunes a viernes.",
  },
];

type FlowStep = number | "done"; // 0, 1, 2 = preguntas; "done" = confirmación final

export default function OnboardingPage() {
  const router = useRouter();
  const [flowStep, setFlowStep] = useState<FlowStep>(0);
  const [currentText, setCurrentText] = useState("");

  const isQuestionStep = typeof flowStep === "number";
  const currentQuestion = isQuestionStep ? QUESTIONS[flowStep] : null;
  const progressPercent = isQuestionStep
    ? ((flowStep + 1) / QUESTIONS.length) * 100
    : 100;

  function handleNext(e: React.FormEvent) {
    e.preventDefault();
    if (!currentQuestion || currentText.trim().length === 0) return;

    saveIntakeAnswer(currentQuestion.slug, currentText.trim());

    const nextStep = (flowStep as number) + 1;
    setCurrentText("");

    if (nextStep >= QUESTIONS.length) {
      setFlowStep("done");
    } else {
      setFlowStep(nextStep);
    }
  }

  return (
    <main className="min-h-screen bg-[#fbf7f1] text-zinc-950">
      <div className="mx-auto flex min-h-screen w-full max-w-md flex-col justify-center px-6 py-8">
        <Logo height={32} animate />

        {/* Barra de progreso — efecto Zeigarnik: dejar visible cuánto falta
            aumenta la intención de completar el ciclo. */}
        <div className="mt-6">
          <div className="flex items-center justify-between text-xs text-zinc-500">
            <span>
              {isQuestionStep
                ? `Pregunta ${(flowStep as number) + 1} de ${QUESTIONS.length}`
                : "Listo"}
            </span>
            <span>{Math.round(progressPercent)}%</span>
          </div>
          <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-zinc-200">
            <div
              className="h-full rounded-full bg-[#C7642B] transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {isQuestionStep && currentQuestion ? (
          <>
            <h1 className="mt-6 text-2xl font-semibold">
              {currentQuestion.title}
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              {currentQuestion.microcopy}
            </p>

            <form onSubmit={handleNext} className="mt-8 flex flex-col gap-4">
              <textarea
                required
                autoFocus
                rows={4}
                placeholder={`Ej: "${currentQuestion.example}"`}
                value={currentText}
                onChange={(e) => setCurrentText(e.target.value)}
                className="resize-none rounded-xl border border-zinc-300 bg-white px-4 py-3 text-base outline-none focus:border-amber-700"
              />

              <div className="flex items-center gap-3">
                <button
                  type="button"
                  disabled
                  title="Nota de voz — próximamente, cuando conectemos el asistente"
                  className="flex items-center gap-2 rounded-full border border-zinc-300 px-4 py-3 text-sm text-zinc-400 cursor-not-allowed"
                >
                  🎙️ Nota de voz
                </button>
                <span className="text-xs text-zinc-400">próximamente</span>
              </div>

              <button
                type="submit"
                disabled={currentText.trim().length === 0}
                className="rounded-full bg-[#C7642B] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
              >
                {flowStep === QUESTIONS.length - 1
                  ? "Terminar"
                  : "Siguiente"}
              </button>
            </form>
          </>
        ) : (
          <>
            <h1 className="mt-6 text-2xl font-semibold">
              Ya tenemos lo que necesitamos por ahora
            </h1>
            <p className="mt-2 text-sm text-zinc-600">
              Crea tu cuenta para guardar tus respuestas y que no se
              pierdan — desde ahí seguimos armando tu plan.
            </p>

            <button
              type="button"
              onClick={() => router.push("/login")}
              className="mt-8 rounded-full bg-[#C7642B] px-6 py-3 text-sm font-semibold text-white transition hover:opacity-90"
            >
              Crear cuenta y continuar
            </button>
          </>
        )}
      </div>
    </main>
  );
}
