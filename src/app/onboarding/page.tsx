"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveIntakeAnswer,
  type QuestionSlug,
} from "@/modules/identity/onboarding-storage";

type Question = {
  slug: QuestionSlug;
  title: string;
  placeholder: string;
};

const QUESTIONS: Question[] = [
  {
    slug: "who_are_we_caring_for",
    title: "¿Para quién estás resolviendo la comida?",
    placeholder: "Yo solo, mi pareja, toda la familia...",
  },
  {
    slug: "tastes_and_restrictions",
    title: "Cuéntanos qué le gusta y qué no",
    placeholder: "Alergias, lo que no puede faltar, lo que prefieres evitar...",
  },
  {
    slug: "days_and_logistics",
    title: "¿Qué días necesitas resolver?",
    placeholder: "Ej: de lunes a viernes, solo almuerzos, desde la próxima semana...",
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
        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-amber-700">
          MomEat
        </p>

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
              Puedes cambiar cualquier cosa más adelante — esto solo nos
              ayuda a armar un primer borrador para ti.
            </p>

            <form onSubmit={handleNext} className="mt-8 flex flex-col gap-4">
              <textarea
                required
                autoFocus
                rows={4}
                placeholder={currentQuestion.placeholder}
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
