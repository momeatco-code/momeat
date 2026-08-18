"use client";

import { useEffect, useRef } from "react";
import { persistOnboardingIntake } from "@/modules/identity/actions";
import { interpretOnboardingIntake } from "@/modules/discovery/interpret-intake";
import {
  getStoredIntake,
  clearStoredIntake,
} from "@/modules/identity/onboarding-storage";

/**
 * No renderiza nada. Al montarse, si hay respuestas del onboarding
 * pendientes en localStorage, las sube a Supabase (onboarding_intakes)
 * y luego dispara la interpretación con IA, que escribe dietary_profiles
 * y crea el weekly_plan en borrador.
 * Es idempotente: si el login ya subió el intake antes de redirigir aquí,
 * localStorage ya está vacío y este componente no hace nada.
 */
export function IntakeSync() {
  const hasRun = useRef(false);

  useEffect(() => {
    if (hasRun.current) return;
    hasRun.current = true;

    const { answers } = getStoredIntake();
    if (answers.length === 0) return;

    persistOnboardingIntake(
      answers.map((a) => ({
        questionSlug: a.questionSlug,
        inputMode: a.inputMode,
        rawText: a.rawText,
      })),
    ).then((result) => {
      if (!result.ok) return;

      clearStoredIntake();

      // Dispara la interpretación con IA en segundo plano — no bloquea
      // la navegación del usuario si tarda o falla.
      interpretOnboardingIntake();
    });
  }, []);

  return null;
}
