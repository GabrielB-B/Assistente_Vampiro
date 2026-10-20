import type { Migration, MigrationProvider } from "kysely/migration";

import * as initialDomain from "../../migrations/001_initial_domain.js";
import * as sessionHistory from "../../migrations/002_session_history.js";

const migrations: Readonly<Record<string, Migration>> = {
  "001_initial_domain": initialDomain,
  "002_session_history": sessionHistory,
};

export class ApplicationMigrationProvider implements MigrationProvider {
  getMigrations(): Promise<Record<string, Migration>> {
    return Promise.resolve({ ...migrations });
  }
}
