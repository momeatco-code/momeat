"use server";

import { createSupabaseServerClient } from "@/lib/supabase/server";
import { logError, logInfo } from "@/shared/observability/logger";

export type SendOtpResult = { ok: true } | { ok: false; message: string };

/**
 * Envía un código OTP de 6 dígitos al email indicado, y a la vez habilita
 * el link de confirmación del correo para que apunte a /auth/confirm
 * (redirectTo) en vez de a la home — sin eso, quien haga clic en el link
 * en vez de escribir el código llega a un callejón sin salida.
 */
export async function sendEmailOtp(
  email: string,
  redirectTo?: string,
): Promise<SendOtpResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail || !normalizedEmail.includes("@")) {
    return { ok: false, message: "Ingresa un email válido." };
  }

  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.signInWithOtp({
    email: normalizedEmail,
    options: {
      shouldCreateUser: true,
      ...(redirectTo ? { emailRedirectTo: redirectTo } : {}),
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

export type ExchangeCodeResult =
  | { ok: true }
  | { ok: false; message: string };

/**
 * Canjea el `code` que Supabase agrega a la URL de redirección cuando
 * alguien hace clic en el link de confirmación del correo (flujo PKCE),
 * y establece la sesión real — sin esto, ese link no lleva a ningún lado.
 */
export async function exchangeAuthCode(
  code: string,
): Promise<ExchangeCodeResult> {
  const supabase = await createSupabaseServerClient();

  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    logError("auth.exchange_code_failed", error, {});
    return {
      ok: false,
      message: "El link expiró o ya fue usado. Pide un código nuevo.",
    };
  }

  logInfo("auth.code_exchanged", {});
  return { ok: true };
}

export type IntakeAnswerInput = {
  questionSlug:
    | "who_are_we_caring_for"
    | "tastes_and_restrictions"
    | "days_and_logistics";
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
 * tanto desde el flujo de código como desde el flujo de link (/auth/confirm).
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
