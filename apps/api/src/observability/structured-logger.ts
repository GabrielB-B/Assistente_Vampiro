import { Inject, Injectable, type LoggerService } from "@nestjs/common";

import { CorrelationContext } from "./correlation-context.js";

type ApplicationLogLevel = "debug" | "error" | "fatal" | "info" | "verbose" | "warn";

interface LogRecord {
  readonly [key: string]: unknown;
  readonly event: string;
  readonly level: ApplicationLogLevel;
  readonly service: "assistente-vampiro-api";
  readonly timestamp: string;
}

function describeSafely(value: unknown): string {
  try {
    return value instanceof Error ? value.message : String(value);
  } catch {
    return "[valor não serializável]";
  }
}

export function serializeLogRecord(record: LogRecord): string {
  try {
    return JSON.stringify(record);
  } catch {
    return JSON.stringify({
      event: "logging.serialization_failed",
      level: "error",
      message: "Um registro não pôde ser serializado.",
      service: "assistente-vampiro-api",
      timestamp: record.timestamp,
    });
  }
}

@Injectable()
export class StructuredLogger implements LoggerService {
  constructor(
    @Inject(CorrelationContext) private readonly correlationContext: CorrelationContext,
  ) {}

  debug(message: unknown, ...optionalParams: unknown[]): void {
    this.writeApplicationLog("debug", message, optionalParams);
  }

  error(message: unknown, ...optionalParams: unknown[]): void {
    this.writeApplicationLog("error", message, optionalParams);
  }

  fatal(message: unknown, ...optionalParams: unknown[]): void {
    this.writeApplicationLog("fatal", message, optionalParams);
  }

  log(message: unknown, ...optionalParams: unknown[]): void {
    this.writeApplicationLog("info", message, optionalParams);
  }

  logEvent(event: string, attributes: Readonly<Record<string, unknown>> = {}): void {
    this.write("info", event, attributes);
  }

  verbose(message: unknown, ...optionalParams: unknown[]): void {
    this.writeApplicationLog("verbose", message, optionalParams);
  }

  warn(message: unknown, ...optionalParams: unknown[]): void {
    this.writeApplicationLog("warn", message, optionalParams);
  }

  warnEvent(event: string, attributes: Readonly<Record<string, unknown>> = {}): void {
    this.write("warn", event, attributes);
  }

  private writeApplicationLog(
    level: ApplicationLogLevel,
    message: unknown,
    optionalParams: readonly unknown[],
  ): void {
    const details = [...optionalParams];
    const possibleContext = details.at(-1);
    const context = typeof possibleContext === "string" ? details.pop() : undefined;
    const attributes: Record<string, unknown> = {
      message: message instanceof Error ? message.message : message,
    };

    if (context !== undefined) {
      attributes.context = context;
    }
    if (details.length > 0) {
      attributes.details = details;
    }
    if (message instanceof Error && message.stack !== undefined) {
      attributes.stack = message.stack;
    }

    this.write(level, "application.log", attributes);
  }

  private write(
    level: ApplicationLogLevel,
    event: string,
    attributes: Readonly<Record<string, unknown>>,
  ): void {
    const correlationId = this.correlationContext.getCorrelationId();
    const record: LogRecord = {
      ...attributes,
      event,
      level,
      service: "assistente-vampiro-api",
      timestamp: new Date().toISOString(),
      ...(correlationId === undefined ? {} : { correlationId }),
    };
    const line = `${serializeLogRecord(record)}\n`;
    const stream = ["error", "fatal", "warn"].includes(level)
      ? process.stderr
      : process.stdout;

    try {
      stream.write(line);
    } catch (error) {
      const fallback = {
        event: "logging.write_failed",
        level: "error",
        message: describeSafely(error),
        service: "assistente-vampiro-api",
        timestamp: new Date().toISOString(),
      } satisfies LogRecord;

      process.stderr.write(`${JSON.stringify(fallback)}\n`);
    }
  }
}
