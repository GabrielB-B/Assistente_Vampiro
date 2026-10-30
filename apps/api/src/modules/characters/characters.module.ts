import { Module } from "@nestjs/common";

import { DatabaseService } from "../../database/database.service.js";
import { IdentityAccessModule } from "../identity-access/identity-access.module.js";
import { ACCESS_CONTEXT_READER } from "../identity-access/application/access-context-reader.js";
import { KyselyCharacterEntryReader } from "./adapters/kysely-character-entry-reader.js";
import { CharactersController } from "./adapters/characters.controller.js";
import { CHARACTER_ENTRY_READER } from "./application/character-entry-reader.js";
import {
  GET_CHARACTER_SHEET,
  GetCharacterSheet,
} from "./application/get-character-sheet.js";
import { LIST_PLAYER_ENTRY, ListPlayerEntry } from "./application/list-player-entry.js";

@Module({
  controllers: [CharactersController],
  imports: [IdentityAccessModule],
  providers: [
    {
      inject: [DatabaseService],
      provide: CHARACTER_ENTRY_READER,
      useFactory: (database: DatabaseService) =>
        new KyselyCharacterEntryReader(database.client),
    },
    {
      inject: [CHARACTER_ENTRY_READER],
      provide: LIST_PLAYER_ENTRY,
      useFactory: (reader: KyselyCharacterEntryReader) => new ListPlayerEntry(reader),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_ENTRY_READER],
      provide: GET_CHARACTER_SHEET,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof GetCharacterSheet>[0],
        entryReader: KyselyCharacterEntryReader,
      ) => new GetCharacterSheet(accessContextReader, entryReader),
    },
  ],
})
export class CharactersModule {}
