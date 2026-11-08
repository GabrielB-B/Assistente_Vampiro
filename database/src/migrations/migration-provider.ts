import type { Migration, MigrationProvider } from "kysely/migration";

import * as initialDomain from "../../migrations/001_initial_domain.js";
import * as sessionHistory from "../../migrations/002_session_history.js";
import * as characterTraits from "../../migrations/003_character_traits.js";
import * as characterDraftKind from "../../migrations/004_character_draft_kind.js";
import * as characterDraftRequest from "../../migrations/005_character_draft_request.js";
import * as characterConcept from "../../migrations/006_character_concept.js";
import * as characterClan from "../../migrations/007_character_clan.js";
import * as characterSkills from "../../migrations/008_character_skills.js";
import * as characterDisciplines from "../../migrations/009_character_disciplines.js";

const migrations: Readonly<Record<string, Migration>> = {
  "001_initial_domain": initialDomain,
  "002_session_history": sessionHistory,
  "003_character_traits": characterTraits,
  "004_character_draft_kind": characterDraftKind,
  "005_character_draft_request": characterDraftRequest,
  "006_character_concept": characterConcept,
  "007_character_clan": characterClan,
  "008_character_skills": characterSkills,
  "009_character_disciplines": characterDisciplines,
};

export class ApplicationMigrationProvider implements MigrationProvider {
  getMigrations(): Promise<Record<string, Migration>> {
    return Promise.resolve({ ...migrations });
  }
}
