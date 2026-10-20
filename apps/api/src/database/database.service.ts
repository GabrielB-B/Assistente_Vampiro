import {
  checkDatabaseConnection,
  createDatabase,
  readDatabaseConfig,
  type Database,
} from "@assistente-vampiro/database";
import { Injectable, type OnApplicationShutdown } from "@nestjs/common";

@Injectable()
export class DatabaseService implements OnApplicationShutdown {
  readonly client: Database;

  constructor() {
    this.client = createDatabase(readDatabaseConfig());
  }

  checkConnection(): Promise<void> {
    return checkDatabaseConnection(this.client);
  }

  async onApplicationShutdown(): Promise<void> {
    await this.client.destroy();
  }
}
