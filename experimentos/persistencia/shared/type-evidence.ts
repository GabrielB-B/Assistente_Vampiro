import type { RollResultKind, Visibility } from "./contract.js";

const validVisibility: Visibility = "STORYTELLER";
const validResult: RollResultKind = "BESTIAL_FAILURE";

// @ts-expect-error A visibilidade não pode aceitar um valor aberto.
const invalidVisibility: Visibility = "EVERYONE";
// @ts-expect-error O resultado precisa pertencer ao vocabulário do domínio.
const invalidResult: RollResultKind = "PARTIAL_SUCCESS";

void [validVisibility, validResult, invalidVisibility, invalidResult];
