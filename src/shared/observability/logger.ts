type LogContext = Record<string, string | number | boolean | undefined>;

function write(
  level: "error" | "info",
  event: string,
  context: LogContext = {},
) {
  const payload = { event, level, ...context };
  const output = JSON.stringify(payload);

  if (level === "error") {
    console.error(output);
    return;
  }

  console.info(output);
}

export function logInfo(event: string, context?: LogContext) {
  write("info", event, context);
}

export function logError(
  event: string,
  error: unknown,
  context: LogContext = {},
) {
  write("error", event, {
    ...context,
    error: error instanceof Error ? error.message : "unknown_error",
  });
}
