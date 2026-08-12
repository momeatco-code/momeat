"use client";

/**
 * Guarda las respuestas de las 3 preguntas de onboarding en el navegador,
 * ANTES de que exista una cuenta. Se sube a Supabase (onboarding_intakes)
 * recién cuando el usuario se autentica — ver persistOnboardingIntake en
 * modules/identity/actions.ts.
 *
 * Por qué localStorage y no Supabase directo: el flujo de producto pide
 * cero fricción antes de convertir — no se pide login para responder las
 * 3 preguntas. onboarding_intakes.user_id es NOT NULL a propósito (RLS
 * exige dueño real), así que no hay fila que crear hasta que haya sesión.
 */

const STORAGE_KEY = "momeat_onboarding_intake";

export type QuestionSlug =
  | "who_are_we_caring_for"
  | "tastes_and_restrictions"
  | "days_and_logistics";

export type IntakeAnswer = {
  questionSlug: QuestionSlug;
  inputMode: "text";
  rawText: string;
  answeredAt: string;
};

type StoredIntake = {
  answers: IntakeAnswer[];
};

const REQUIRED_SLUGS: QuestionSlug[] = [
  "who_are_we_caring_for",
  "tastes_and_restrictions",
  "days_and_logistics",
];

export function getStoredIntake(): StoredIntake {
  if (typeof window === "undefined") return { answers: [] };

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) return { answers: [] };

  try {
    const parsed = JSON.parse(raw) as StoredIntake;
    return Array.isArray(parsed.answers) ? parsed : { answers: [] };
  } catch {
    return { answers: [] };
  }
}

export function saveIntakeAnswer(
  questionSlug: QuestionSlug,
  rawText: string,
): void {
  const current = getStoredIntake();
  const withoutDuplicate = current.answers.filter(
    (a) => a.questionSlug !== questionSlug,
  );

  const updated: StoredIntake = {
    answers: [
      ...withoutDuplicate,
      {
        questionSlug,
        inputMode: "text",
        rawText,
        answeredAt: new Date().toISOString(),
      },
    ],
  };

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
}

export function hasCompletedIntake(): boolean {
  const { answers } = getStoredIntake();
  return REQUIRED_SLUGS.every((slug) =>
    answers.some((a) => a.questionSlug === slug),
  );
}

export function clearStoredIntake(): void {
  window.localStorage.removeItem(STORAGE_KEY);
}
