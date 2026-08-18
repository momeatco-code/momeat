"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logError, logInfo } from "@/shared/observability/logger";

export type InterpretIntakeResult =
  | { ok: true; requestedDays: number }
  | { ok: false; message: string };

type ParsedIntake = {
  likes: string[];
  dislikes: string[];
  hard_restrictions: string[];
  typical_budget_amount: number | null;
  requested_days: number;
};

/**
 * Lee las 3 respuestas de onboarding_intakes del usuario autenticado,
 * las interpreta con la API de ChatGPT, y escribe:
 *  - dietary_profiles (gustos, restricciones, presupuesto si lo menciona)
 *  - weekly_plans (un borrador con los días solicitados)
 *
 * NO genera weekly_plan_items: el catálogo (menu_items) sigue vacío —
 * no hay platos reales que proponer hasta que exista al menos un punto
 * aliado con menú cargado. Ver docs/data-model-v1.md.
 */
export async function interpretOnboardingIntake(): Promise<InterpretIntakeResult> {
  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { ok: false, message: "No hay sesión activa." };
  }

  const { data: intakes, error: intakesError } = await supabase
    .from("onboarding_intakes")
    .select("question_slug, raw_text")
    .eq("user_id", user.id);

  if (intakesError || !intakes || intakes.length === 0) {
    logError(
      "discovery.no_intake_found",
      intakesError ?? new Error("empty intake"),
      { userId: user.id },
    );
    return {
      ok: false,
      message: "No encontramos tus respuestas del onboarding.",
    };
  }

  const bySlug = Object.fromEntries(
    intakes.map((i) => [i.question_slug, i.raw_text]),
  ) as Record<string, string>;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    logError(
      "discovery.missing_openai_key",
      new Error("OPENAI_API_KEY not set"),
      {},
    );
    return { ok: false, message: "Falta configurar la API de IA." };
  }

  const prompt = `
Eres el motor de interpretación de MomEat, una plataforma de alimentación por reservas programadas. A partir de 3 respuestas libres de un usuario, extrae información estructurada.

Pregunta 1 (para quién es la comida): "${bySlug.who_are_we_caring_for ?? ""}"
Pregunta 2 (qué le gusta y qué evitar): "${bySlug.tastes_and_restrictions ?? ""}"
Pregunta 3 (para cuántos días): "${bySlug.days_and_logistics ?? ""}"

Responde SOLO con un JSON con esta forma exacta, sin texto adicional ni explicación:
{
  "likes": string[],
  "dislikes": string[],
  "hard_restrictions": string[],
  "typical_budget_amount": number | null,
  "requested_days": number
}

Reglas:
- likes/dislikes/hard_restrictions: listas cortas en español, cada elemento de 1 a 4 palabras.
- hard_restrictions es solo para alergias o dietas no negociables (ej. "sin lácteos", "vegetariano"), no gustos normales.
- typical_budget_amount: solo si el usuario menciona un monto explícito en la respuesta; si no, null.
- requested_days: número de días que el usuario pidió resolver. Si dice un número, úsalo. Si dice "toda la semana" usa 7. Si es ambiguo, usa 5.
`.trim();

  let parsed: ParsedIntake;

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        response_format: { type: "json_object" },
        temperature: 0.3,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`OpenAI respondió ${response.status}: ${errorText}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    if (!content) {
      throw new Error("OpenAI devolvió una respuesta vacía");
    }

    parsed = JSON.parse(content) as ParsedIntake;
  } catch (err) {
    logError("discovery.openai_call_failed", err, { userId: user.id });
    return { ok: false, message: "No pudimos interpretar tus respuestas." };
  }

  const requestedDays = Math.min(
    Math.max(Number(parsed.requested_days) || 5, 1),
    31,
  );

  const { error: profileError } = await supabase
    .from("dietary_profiles")
    .upsert({
      user_id: user.id,
      likes: parsed.likes ?? [],
      dislikes: parsed.dislikes ?? [],
      hard_restrictions: parsed.hard_restrictions ?? [],
      typical_budget_amount: parsed.typical_budget_amount ?? null,
      updated_at: new Date().toISOString(),
    });

  if (profileError) {
    logError("discovery.dietary_profile_write_failed", profileError, {
      userId: user.id,
    });
    return { ok: false, message: "No pudimos guardar tu perfil." };
  }

  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const startsOn = tomorrow.toISOString().slice(0, 10);

  const { error: planError } = await supabase.from("weekly_plans").insert({
    user_id: user.id,
    requested_days: requestedDays,
    starts_on: startsOn,
    status: "draft",
  });

  if (planError) {
    logError("discovery.weekly_plan_write_failed", planError, {
      userId: user.id,
    });
    return { ok: false, message: "No pudimos crear tu plan." };
  }

  logInfo("discovery.intake_interpreted", {
    userId: user.id,
    requestedDays,
  });

  return { ok: true, requestedDays };
}
