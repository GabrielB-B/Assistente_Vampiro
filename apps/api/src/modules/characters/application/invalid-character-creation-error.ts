import type {
  CreationAttributeViolation,
  CreationConceptEvaluation,
  CreationClanViolation,
  CreationSkillsViolation,
  CreationDisciplinesViolation,
} from "@assistente-vampiro/rules-engine";

type CreationViolation =
  | CreationAttributeViolation
  | CreationClanViolation
  | CreationSkillsViolation
  | CreationDisciplinesViolation
  | CreationConceptEvaluation["violations"][number];

export class InvalidCharacterCreationError extends Error {
  constructor(readonly violations: readonly CreationViolation[]) {
    super("A escolha não respeita a regra de criação ativa.");
    this.name = "InvalidCharacterCreationError";
  }
}
