import { Module } from "@nestjs/common";

import { DatabaseService } from "../../database/database.service.js";
import { IdentityAccessModule } from "../identity-access/identity-access.module.js";
import { ACCESS_CONTEXT_READER } from "../identity-access/application/access-context-reader.js";
import { NodeUuidV7Generator } from "../identity-access/adapters/node-uuid-v7-generator.js";
import { KyselyCharacterEntryReader } from "./adapters/kysely-character-entry-reader.js";
import { KyselyCharacterSheetWriter } from "./adapters/kysely-character-sheet-writer.js";
import { CharactersController } from "./adapters/characters.controller.js";
import { CHARACTER_ENTRY_READER } from "./application/character-entry-reader.js";
import { CHARACTER_SHEET_WRITER } from "./application/character-sheet-writer.js";
import {
  GET_CREATION_CONCEPT,
  GetCreationConcept,
} from "./application/get-creation-concept.js";
import {
  GET_CREATION_ATTRIBUTES,
  GetCreationAttributes,
} from "./application/get-creation-attributes.js";
import { GET_CREATION_CLAN, GetCreationClan } from "./application/get-creation-clan.js";
import {
  GET_CREATION_SKILLS,
  GetCreationSkills,
} from "./application/get-creation-skills.js";
import {
  GET_CREATION_DISCIPLINES,
  GetCreationDisciplines,
} from "./application/get-creation-disciplines.js";
import {
  GET_CHARACTER_SHEET,
  GetCharacterSheet,
} from "./application/get-character-sheet.js";
import { LIST_PLAYER_ENTRY, ListPlayerEntry } from "./application/list-player-entry.js";
import {
  START_CHARACTER_DRAFT,
  StartCharacterDraft,
} from "./application/start-character-draft.js";
import {
  UPDATE_CREATION_CONCEPT,
  UpdateCreationConcept,
} from "./application/update-creation-concept.js";
import {
  UPDATE_CREATION_ATTRIBUTES,
  UpdateCreationAttributes,
} from "./application/update-creation-attributes.js";
import {
  UPDATE_CREATION_CLAN,
  UpdateCreationClan,
} from "./application/update-creation-clan.js";
import {
  UPDATE_CREATION_SKILLS,
  UpdateCreationSkills,
} from "./application/update-creation-skills.js";
import {
  UPDATE_CREATION_DISCIPLINES,
  UpdateCreationDisciplines,
} from "./application/update-creation-disciplines.js";
import {
  UPDATE_CHARACTER_SHEET,
  UpdateCharacterSheet,
} from "./application/update-character-sheet.js";

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
      inject: [DatabaseService],
      provide: CHARACTER_SHEET_WRITER,
      useFactory: (database: DatabaseService) =>
        new KyselyCharacterSheetWriter(database.client),
    },
    {
      inject: [CHARACTER_ENTRY_READER],
      provide: LIST_PLAYER_ENTRY,
      useFactory: (reader: KyselyCharacterEntryReader) => new ListPlayerEntry(reader),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: GET_CREATION_CONCEPT,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof GetCreationConcept>[0],
        writer: KyselyCharacterSheetWriter,
      ) => new GetCreationConcept(accessContextReader, writer),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: GET_CREATION_ATTRIBUTES,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof GetCreationAttributes>[0],
        writer: KyselyCharacterSheetWriter,
      ) => new GetCreationAttributes(accessContextReader, writer),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: GET_CREATION_CLAN,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof GetCreationClan>[0],
        writer: KyselyCharacterSheetWriter,
      ) => new GetCreationClan(accessContextReader, writer),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: GET_CREATION_SKILLS,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof GetCreationSkills>[0],
        writer: KyselyCharacterSheetWriter,
      ) => new GetCreationSkills(accessContextReader, writer),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: GET_CREATION_DISCIPLINES,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof GetCreationDisciplines>[0],
        writer: KyselyCharacterSheetWriter,
      ) => new GetCreationDisciplines(accessContextReader, writer),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_ENTRY_READER],
      provide: GET_CHARACTER_SHEET,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof GetCharacterSheet>[0],
        entryReader: KyselyCharacterEntryReader,
      ) => new GetCharacterSheet(accessContextReader, entryReader),
    },
    {
      inject: [CHARACTER_SHEET_WRITER],
      provide: START_CHARACTER_DRAFT,
      useFactory: (writer: KyselyCharacterSheetWriter) =>
        new StartCharacterDraft(writer, new NodeUuidV7Generator()),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: UPDATE_CREATION_CONCEPT,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof UpdateCreationConcept>[0],
        writer: KyselyCharacterSheetWriter,
      ) =>
        new UpdateCreationConcept(accessContextReader, writer, new NodeUuidV7Generator()),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: UPDATE_CREATION_ATTRIBUTES,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof UpdateCreationAttributes>[0],
        writer: KyselyCharacterSheetWriter,
      ) =>
        new UpdateCreationAttributes(
          accessContextReader,
          writer,
          new NodeUuidV7Generator(),
        ),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER, GET_CREATION_CLAN],
      provide: UPDATE_CREATION_CLAN,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof UpdateCreationClan>[0],
        writer: KyselyCharacterSheetWriter,
        getCreationClan: GetCreationClan,
      ) =>
        new UpdateCreationClan(
          accessContextReader,
          writer,
          new NodeUuidV7Generator(),
          getCreationClan,
        ),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: UPDATE_CREATION_SKILLS,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof UpdateCreationSkills>[0],
        writer: KyselyCharacterSheetWriter,
      ) =>
        new UpdateCreationSkills(accessContextReader, writer, new NodeUuidV7Generator()),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: UPDATE_CREATION_DISCIPLINES,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof UpdateCreationDisciplines>[0],
        writer: KyselyCharacterSheetWriter,
      ) =>
        new UpdateCreationDisciplines(
          accessContextReader,
          writer,
          new NodeUuidV7Generator(),
        ),
    },
    {
      inject: [ACCESS_CONTEXT_READER, CHARACTER_SHEET_WRITER],
      provide: UPDATE_CHARACTER_SHEET,
      useFactory: (
        accessContextReader: ConstructorParameters<typeof UpdateCharacterSheet>[0],
        writer: KyselyCharacterSheetWriter,
      ) =>
        new UpdateCharacterSheet(accessContextReader, writer, new NodeUuidV7Generator()),
    },
  ],
})
export class CharactersModule {}
