export type ErrorPath = readonly (string | number)[];

type RuleEngineErrorReasonByCode = {
  UnsupportedRuleSetProfile: "PROFILE_REVISION_UNSUPPORTED";
  InvalidPoolComposition:
    | "COMPONENTS_REQUIRED"
    | "COMPONENT_ID_REQUIRED"
    | "COMPONENT_KIND_UNSUPPORTED"
    | "COMPONENT_REASON_REQUIRED";
  InvalidPoolComponentValue: "NOT_INTEGER" | "BELOW_MINIMUM";
  InvalidHungerAllocation:
    | "BASE_POOL_OUT_OF_RANGE"
    | "HUNGER_OUT_OF_RANGE"
    | "EXCLUSION_REASON_REQUIRED"
    | "EXCLUSION_REASON_UNSUPPORTED";
  InvalidDifficulty: "REQUIRED" | "NOT_INTEGER" | "BELOW_MINIMUM";
  InvalidDiceFace: "NOT_INTEGER" | "OUT_OF_RANGE";
  DiceCountMismatch:
    "NORMAL_COUNT_MISMATCH" | "HUNGER_COUNT_MISMATCH" | "TOTAL_COUNT_MISMATCH";
  InvalidCriticalSummary: "PAIR_COUNT_MISMATCH" | "BONUS_MISMATCH";
  InvalidSpecialResultInput:
    "CRITICAL_VICTORY_WITHOUT_PAIR" | "TOTAL_FAILURE_WITH_VICTORY";
  RuleRevisionUnavailable: "REQUIRED_REVISION_NOT_LOADED";
};

export type RuleEngineErrorCode = keyof RuleEngineErrorReasonByCode;

export type RuleEngineError = {
  [Code in RuleEngineErrorCode]: {
    readonly code: Code;
    readonly reason: RuleEngineErrorReasonByCode[Code];
    readonly path: ErrorPath;
  };
}[RuleEngineErrorCode];

export type RuleEngineFailure = {
  readonly ok: false;
  readonly error: RuleEngineError;
};

export type RuleEngineSuccess<T> = {
  readonly ok: true;
  readonly value: T;
};

export type RuleEngineResult<T> = RuleEngineSuccess<T> | RuleEngineFailure;

export function fail(error: RuleEngineError): RuleEngineFailure {
  return { ok: false, error };
}

export function succeed<T>(value: T): RuleEngineSuccess<T> {
  return { ok: true, value };
}
