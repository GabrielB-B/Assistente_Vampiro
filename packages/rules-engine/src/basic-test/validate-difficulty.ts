import { fail, succeed, type RuleEngineResult } from "../errors/rule-engine-error.js";
import type { DifficultyBand, ValidatedDifficulty } from "./types.js";

function difficultyBand(difficulty: number): DifficultyBand {
  switch (difficulty) {
    case 1:
      return "EASY";
    case 2:
      return "ROUTINE";
    case 3:
      return "MODERATE";
    case 4:
      return "CHALLENGING";
    case 5:
      return "HARD";
    case 6:
      return "VERY_HARD";
    default:
      return "NEARLY_IMPOSSIBLE";
  }
}

export function validateDifficulty(
  difficulty: number,
): RuleEngineResult<ValidatedDifficulty> {
  if (difficulty === undefined || difficulty === null) {
    return fail({
      code: "InvalidDifficulty",
      reason: "REQUIRED",
      path: ["difficulty"],
    });
  }

  if (!Number.isInteger(difficulty)) {
    return fail({
      code: "InvalidDifficulty",
      reason: "NOT_INTEGER",
      path: ["difficulty"],
    });
  }

  if (difficulty < 1) {
    return fail({
      code: "InvalidDifficulty",
      reason: "BELOW_MINIMUM",
      path: ["difficulty"],
    });
  }

  return succeed({ value: difficulty, band: difficultyBand(difficulty) });
}
