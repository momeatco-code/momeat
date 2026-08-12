"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logError, logInfo } from "@/shared/observability/logger";

export type SendOtpResult = { ok: true } | { ok: false; message: string };

/**
 * Envía un código OTP de 6 dígitos al email indicado.
 * Supabase crea el usuario en auth.users automáticamente si no existe
 * (shouldCreateUser: true), lo que dispara el trigger on_auth_user_created
 * y crea profile + rol customer por defecto.
 */
export async function sendEmailOtp(email: string): Promise<SendOtpResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { ok: false, message: "Ingresa un email válido." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
    },
  });

  if (error) {
    logError("auth.send_otp_failed", error, { email: normalizedEmail });
    return {
      ok: false,
      message: "No pudimos enviar el código. Intenta de nuevo.",
    };
  }

  logInfo("auth.otp_sent", { email: normalizedEmail });
  return { ok: true };
}

export type VerifyOtpResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Verifica el código OTP de 6 dígitos ingresado por el usuario.
 * Al validar, Supabase establece la sesión (cookies) automáticamente
 * a través del adaptador server con @supabase/ssr.
 */
export async function verifyEmailOtp(
  email: string,
  token: string,
): Promise<VerifyOtpResult> {
  const normalizedEmail = email.trim().toLowerCase();
  const normalizedToken = token.trim();

  if (normalizedToken.length !== 6) {
    return { ok: false, message: "El código debe tener 6 dígitos." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.verifyOtp({
    email: normalizedEmail,
    token: normalizedToken,
    type: "email",
  });

  if (error) {
    logError("auth.verify_otp_failed", error, { email: normalizedEmail });
    return { ok: false, message: "Código incorrecto o expirado." };
  }

  logInfo("auth.otp_verified", { email: normalizedEmail });
  return { ok: true };
}

export type IntakeAnswerInput = {
  questionSlug: "who_are_we_caring_for" | "tastes_and_restrictions" | "days_and_logistics";
  inputMode: "text";
  rawText: string;
};

export type PersistIntakeResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Sube a Supabase las respuestas de las 3 preguntas que el usuario respondió
 * ANTES de tener cuenta (guardadas en localStorage por onboarding-storage.ts).
 * Se llama después de un login/registro exitoso, con sesión ya activa —
 * si no hay sesión, falla explícitamente en vez de escribir con user_id nulo.
 */
export async function persistOnboardingIntake(
  answers: IntakeAnswerInput[],
): Promise<PersistIntakeResult> {
  if (answers.length === 0) {
    return { ok: true };
  }

  const supabase = await createSupabaseServerClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    logError(
      "onboarding.persist_intake_no_session",
      new Error("No active session"),
      {},
    );
    return { ok: false, message: "No hay sesión activa." };
  }

  const rows = answers.map((answer) => ({
    user_id: user.id,
    question_slug: answer.questionSlug,
    input_mode: answer.inputMode,
    raw_text: answer.rawText,
  }));

  const { error } = await supabase.from("onboarding_intakes").insert(rows);

  if (error) {
    logError("onboarding.persist_intake_failed", error, { userId: user.id });
    return { ok: false, message: "No pudimos guardar tus respuestas." };
  }

  logInfo("onboarding.intake_persisted", {
    userId: user.id,
    count: rows.length,
  });
  return { ok: true };
}
