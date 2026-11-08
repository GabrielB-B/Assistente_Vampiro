import type {
  CharacterDraftMutationView,
  CreationConceptStepView,
  CreationAttributesMutationView,
  CreationAttributesStepView,
  CreationClanStepView,
  CreationSkillsStepView,
  CreationDisciplinesStepView,
  CharacterSheetDocumentView,
  CharacterSheetMutationView,
  PlayerEntryView,
  PublicApiErrorCode,
  PublicApiErrorResponse,
} from "@assistente-vampiro/contracts";
import {
  CREATION_ATTRIBUTE_IDS,
  CREATION_DISCIPLINE_IDS,
  CREATION_ORIGIN_IDS,
  CREATION_SKILL_IDS,
} from "@assistente-vampiro/contracts";
import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Delete,
  Get,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
} from "@nestjs/common";

import { CorrelationContext } from "../../../observability/correlation-context.js";
import { AuthenticationError } from "../../identity-access/application/authentication-error.js";
import {
  IDENTITY_PROVIDER,
  type IdentityProvider,
} from "../../identity-access/application/identity-provider.js";
import {
  GET_CREATION_CONCEPT,
  type GetCreationConcept,
} from "../application/get-creation-concept.js";
import {
  GET_CREATION_ATTRIBUTES,
  type GetCreationAttributes,
} from "../application/get-creation-attributes.js";
import {
  GET_CREATION_CLAN,
  type GetCreationClan,
} from "../application/get-creation-clan.js";
import {
  GET_CREATION_SKILLS,
  type GetCreationSkills,
} from "../application/get-creation-skills.js";
import {
  GET_CREATION_DISCIPLINES,
  type GetCreationDisciplines,
} from "../application/get-creation-disciplines.js";
import {
  GET_CHARACTER_SHEET,
  type GetCharacterSheet,
} from "../application/get-character-sheet.js";
import {
  LIST_PLAYER_ENTRY,
  type ListPlayerEntry,
} from "../application/list-player-entry.js";
import { CharacterNotAvailableError } from "../application/character-not-available-error.js";
import { CharacterVersionConflictError } from "../application/character-version-conflict-error.js";
import { InvalidCharacterCreationError } from "../application/invalid-character-creation-error.js";
import {
  START_CHARACTER_DRAFT,
  type StartCharacterDraft,
} from "../application/start-character-draft.js";
import {
  UPDATE_CREATION_CONCEPT,
  type UpdateCreationConcept,
  type UpdateCreationConceptCommand,
} from "../application/update-creation-concept.js";
import {
  UPDATE_CREATION_ATTRIBUTES,
  type UpdateCreationAttributes,
  type UpdateCreationAttributesCommand,
} from "../application/update-creation-attributes.js";
import {
  UPDATE_CREATION_CLAN,
  type UpdateCreationClan,
  type UpdateCreationClanCommand,
} from "../application/update-creation-clan.js";
import {
  UPDATE_CREATION_SKILLS,
  type CreateCreationSpecialtyCommand,
  type DeleteCreationSpecialtyCommand,
  type UpdateCreationSkills,
  type UpdateCreationSkillsCommand,
  type UpdateCreationSpecialtyCommand,
} from "../application/update-creation-skills.js";
import {
  UPDATE_CREATION_DISCIPLINES,
  type UpdateCreationDisciplines,
  type UpdateCreationDisciplinesCommand,
} from "../application/update-creation-disciplines.js";
import {
  UPDATE_CHARACTER_SHEET,
  type UpdateCharacterSheet,
  type UpdateCharacterSheetCommand,
} from "../application/update-character-sheet.js";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function readSingleHeader(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readUpdateCommand(
  characterId: string,
  correlationId: string,
  body: unknown,
): UpdateCharacterSheetCommand | undefined {
  if (!isRecord(body) || !isRecord(body.identity)) {
    return undefined;
  }
  const identity = body.identity;
  const bodyKeys = Object.keys(body);
  const identityKeys = Object.keys(identity);
  if (
    bodyKeys.some((key) => !["expectedVersion", "identity"].includes(key)) ||
    identityKeys.length === 0 ||
    identityKeys.some(
      (key) => !["ambition", "concept", "desire", "name", "sire"].includes(key),
    ) ||
    !Number.isInteger(body.expectedVersion) ||
    Number(body.expectedVersion) < 0 ||
    ("name" in identity && typeof identity.name !== "string") ||
    ("concept" in identity &&
      identity.concept !== null &&
      typeof identity.concept !== "string") ||
    (["ambition", "desire", "sire"] as const).some(
      (key) =>
        key in identity && identity[key] !== null && typeof identity[key] !== "string",
    )
  ) {
    return undefined;
  }

  return {
    characterId,
    correlationId,
    expectedVersion: Number(body.expectedVersion),
    identity: {
      ...("ambition" in identity ? { ambition: identity.ambition as string | null } : {}),
      ...("concept" in identity ? { concept: identity.concept as string | null } : {}),
      ...("name" in identity ? { name: identity.name as string } : {}),
      ...("desire" in identity ? { desire: identity.desire as string | null } : {}),
      ...("sire" in identity ? { sire: identity.sire as string | null } : {}),
    },
  };
}

function readConceptCommand(
  characterId: string,
  correlationId: string,
  body: unknown,
): UpdateCreationConceptCommand | undefined {
  if (
    !isRecord(body) ||
    !isRecord(body.identity) ||
    !Array.isArray(body.convictionPairs) ||
    Object.keys(body).some(
      (key) => !["convictionPairs", "expectedVersion", "identity"].includes(key),
    ) ||
    !Number.isInteger(body.expectedVersion) ||
    Number(body.expectedVersion) < 0
  ) {
    return undefined;
  }
  const identity = body.identity;
  const convictionPairs = body.convictionPairs;
  const identityKeys = ["ambition", "concept", "desire", "name", "sire"] as const;
  if (
    Object.keys(identity).length !== identityKeys.length ||
    !identityKeys.every((key) => key in identity) ||
    typeof identity.name !== "string" ||
    identity.name.length > 120 ||
    identityKeys
      .filter((key) => key !== "name")
      .some((key) => {
        const value = identity[key];
        return value !== null && (typeof value !== "string" || value.length > 500);
      }) ||
    convictionPairs.length > 10 ||
    convictionPairs.some(
      (pair) =>
        !isRecord(pair) ||
        Object.keys(pair).some((key) => !["conviction", "touchstone"].includes(key)) ||
        !("conviction" in pair) ||
        !("touchstone" in pair) ||
        [pair.conviction, pair.touchstone].some(
          (value) => value !== null && (typeof value !== "string" || value.length > 500),
        ),
    )
  ) {
    return undefined;
  }

  return {
    characterId,
    convictionPairs: convictionPairs as UpdateCreationConceptCommand["convictionPairs"],
    correlationId,
    expectedVersion: Number(body.expectedVersion),
    identity: identity as unknown as UpdateCreationConceptCommand["identity"],
  };
}

function readDraftIdempotencyKey(body: unknown): string | undefined {
  if (!isRecord(body) || Object.keys(body).length !== 1) return undefined;
  const value = body.idempotencyKey;
  return typeof value === "string" && value.length >= 8 && value.length <= 128
    ? value
    : undefined;
}

function readAttributesCommand(
  characterId: string,
  correlationId: string,
  body: unknown,
): UpdateCreationAttributesCommand | undefined {
  if (
    !isRecord(body) ||
    !isRecord(body.attributes) ||
    Object.keys(body).some((key) => !["attributes", "expectedVersion"].includes(key)) ||
    !Number.isInteger(body.expectedVersion) ||
    Number(body.expectedVersion) < 0
  ) {
    return undefined;
  }
  const entries = Object.entries(body.attributes);
  if (
    entries.length === 0 ||
    entries.some(
      ([key, value]) =>
        !CREATION_ATTRIBUTE_IDS.includes(
          key as (typeof CREATION_ATTRIBUTE_IDS)[number],
        ) || !Number.isInteger(value),
    )
  ) {
    return undefined;
  }
  return {
    attributes: Object.fromEntries(entries),
    characterId,
    correlationId,
    expectedVersion: Number(body.expectedVersion),
  };
}

function readClanCommand(
  characterId: string,
  correlationId: string,
  body: unknown,
): UpdateCreationClanCommand | undefined {
  if (
    !isRecord(body) ||
    Object.keys(body).some((key) => !["expectedVersion", "originId"].includes(key)) ||
    Object.keys(body).length !== 2 ||
    !Number.isInteger(body.expectedVersion) ||
    Number(body.expectedVersion) < 0 ||
    typeof body.originId !== "string" ||
    !CREATION_ORIGIN_IDS.includes(body.originId as (typeof CREATION_ORIGIN_IDS)[number])
  ) {
    return undefined;
  }
  return {
    characterId,
    correlationId,
    expectedVersion: Number(body.expectedVersion),
    originId: body.originId as UpdateCreationClanCommand["originId"],
  };
}

const skillMethods = [
  "QUICK_JACK_OF_ALL_TRADES",
  "QUICK_BALANCED",
  "QUICK_SPECIALIST",
  "DETAILED_GENERALIST",
  "DETAILED_SPECIALIST",
] as const;
const specialtyOrigins = ["CREATION_AUTOMATIC", "CREATION_FREE"] as const;

function readSkillsCommand(
  characterId: string,
  correlationId: string,
  body: unknown,
): UpdateCreationSkillsCommand | undefined {
  if (
    !isRecord(body) ||
    !isRecord(body.skills) ||
    Object.keys(body).some(
      (key) => !["expectedVersion", "methodId", "skills"].includes(key),
    ) ||
    !Number.isInteger(body.expectedVersion) ||
    Number(body.expectedVersion) < 0
  )
    return undefined;
  const entries = Object.entries(body.skills);
  if (
    entries.some(
      ([key, value]) =>
        !CREATION_SKILL_IDS.includes(key as (typeof CREATION_SKILL_IDS)[number]) ||
        !Number.isInteger(value),
    ) ||
    (body.methodId !== undefined &&
      (typeof body.methodId !== "string" ||
        !skillMethods.includes(body.methodId as (typeof skillMethods)[number])))
  )
    return undefined;
  return {
    characterId,
    correlationId,
    expectedVersion: Number(body.expectedVersion),
    ...(body.methodId === undefined ? {} : { methodId: body.methodId }),
    skills: Object.fromEntries(entries),
  } as UpdateCreationSkillsCommand;
}

function readCreateSpecialtyCommand(
  characterId: string,
  correlationId: string,
  body: unknown,
): CreateCreationSpecialtyCommand | undefined {
  if (
    !isRecord(body) ||
    Object.keys(body).some(
      (key) => !["expectedVersion", "label", "origin", "skillId"].includes(key),
    ) ||
    Object.keys(body).length !== 4 ||
    !Number.isInteger(body.expectedVersion) ||
    typeof body.label !== "string" ||
    typeof body.origin !== "string" ||
    !specialtyOrigins.includes(body.origin as (typeof specialtyOrigins)[number]) ||
    typeof body.skillId !== "string" ||
    !CREATION_SKILL_IDS.includes(body.skillId as (typeof CREATION_SKILL_IDS)[number])
  )
    return undefined;
  return {
    characterId,
    correlationId,
    expectedVersion: Number(body.expectedVersion),
    label: body.label,
    origin: body.origin as CreateCreationSpecialtyCommand["origin"],
    skillId: body.skillId as CreateCreationSpecialtyCommand["skillId"],
  };
}

function readDisciplinesCommand(
  characterId: string,
  correlationId: string,
  body: unknown,
): UpdateCreationDisciplinesCommand | undefined {
  if (
    !isRecord(body) ||
    !Array.isArray(body.disciplines) ||
    !Array.isArray(body.powerIds) ||
    !Number.isInteger(body.expectedVersion) ||
    Number(body.expectedVersion) < 0 ||
    Object.keys(body).some(
      (key) =>
        ![
          "confirmPowerInvalidation",
          "disciplines",
          "expectedVersion",
          "powerIds",
          "previewOnly",
        ].includes(key),
    ) ||
    (body.confirmPowerInvalidation !== undefined &&
      typeof body.confirmPowerInvalidation !== "boolean") ||
    (body.previewOnly !== undefined && typeof body.previewOnly !== "boolean")
  )
    return undefined;
  const disciplines = body.disciplines;
  if (
    disciplines.some(
      (item) =>
        !isRecord(item) ||
        Object.keys(item).some((key) => !["disciplineId", "rating"].includes(key)) ||
        typeof item.disciplineId !== "string" ||
        !CREATION_DISCIPLINE_IDS.includes(
          item.disciplineId as (typeof CREATION_DISCIPLINE_IDS)[number],
        ) ||
        !Number.isInteger(item.rating) ||
        Number(item.rating) < 0 ||
        Number(item.rating) > 5,
    )
  )
    return undefined;
  if (
    body.powerIds.some(
      (item) => typeof item !== "string" || !/^power:[a-z][a-z0-9-]{1,95}$/u.test(item),
    )
  )
    return undefined;
  return {
    characterId,
    ...(body.confirmPowerInvalidation === undefined
      ? {}
      : { confirmPowerInvalidation: body.confirmPowerInvalidation }),
    correlationId,
    disciplines: disciplines.map((item) => ({
      disciplineId: String(
        (item as Record<string, unknown>).disciplineId,
      ) as UpdateCreationDisciplinesCommand["disciplines"][number]["disciplineId"],
      rating: Number((item as Record<string, unknown>).rating),
    })),
    expectedVersion: Number(body.expectedVersion),
    powerIds: body.powerIds as UpdateCreationDisciplinesCommand["powerIds"],
    ...(body.previewOnly === undefined ? {} : { previewOnly: body.previewOnly }),
  };
}

function readSpecialtyMutationCommand(
  characterId: string,
  specialtyId: string,
  correlationId: string,
  body: unknown,
): UpdateCreationSpecialtyCommand | DeleteCreationSpecialtyCommand | undefined {
  if (
    !uuidPattern.test(specialtyId) ||
    !isRecord(body) ||
    !Number.isInteger(body.expectedVersion) ||
    Number(body.expectedVersion) < 0
  )
    return undefined;
  if (Object.keys(body).length === 1)
    return {
      characterId,
      correlationId,
      expectedVersion: Number(body.expectedVersion),
      specialtyId,
    };
  if (Object.keys(body).length === 2 && typeof body.label === "string")
    return {
      characterId,
      correlationId,
      expectedVersion: Number(body.expectedVersion),
      label: body.label,
      specialtyId,
    };
  return undefined;
}

@Controller()
export class CharactersController {
  constructor(
    @Inject(IDENTITY_PROVIDER) private readonly identityProvider: IdentityProvider,
    @Inject(LIST_PLAYER_ENTRY) private readonly listPlayerEntry: ListPlayerEntry,
    @Inject(GET_CHARACTER_SHEET)
    private readonly getCharacterSheet: GetCharacterSheet,
    @Inject(GET_CREATION_ATTRIBUTES)
    private readonly getCreationAttributes: GetCreationAttributes,
    @Inject(GET_CREATION_CONCEPT)
    private readonly getCreationConcept: GetCreationConcept,
    @Inject(GET_CREATION_CLAN)
    private readonly getCreationClan: GetCreationClan,
    @Inject(GET_CREATION_SKILLS)
    private readonly getCreationSkills: GetCreationSkills,
    @Inject(GET_CREATION_DISCIPLINES)
    private readonly getCreationDisciplines: GetCreationDisciplines,
    @Inject(UPDATE_CHARACTER_SHEET)
    private readonly updateCharacterSheet: UpdateCharacterSheet,
    @Inject(START_CHARACTER_DRAFT)
    private readonly startCharacterDraft: StartCharacterDraft,
    @Inject(UPDATE_CREATION_ATTRIBUTES)
    private readonly updateCreationAttributes: UpdateCreationAttributes,
    @Inject(UPDATE_CREATION_CONCEPT)
    private readonly updateCreationConcept: UpdateCreationConcept,
    @Inject(UPDATE_CREATION_CLAN)
    private readonly updateCreationClan: UpdateCreationClan,
    @Inject(UPDATE_CREATION_SKILLS)
    private readonly updateCreationSkills: UpdateCreationSkills,
    @Inject(UPDATE_CREATION_DISCIPLINES)
    private readonly updateCreationDisciplines: UpdateCreationDisciplines,
    @Inject(CorrelationContext) private readonly correlationContext: CorrelationContext,
  ) {}

  @Post("characters/drafts")
  async startDraft(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Body() body: unknown,
  ): Promise<CharacterDraftMutationView> {
    const actor = await this.resolveActor(identityHeader);
    const idempotencyKey = readDraftIdempotencyKey(body);
    if (idempotencyKey === undefined) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A solicitação de rascunho é inválida."),
      );
    }
    return this.startCharacterDraft.execute(actor, {
      correlationId:
        this.correlationContext.getCorrelationId() ??
        "00000000-0000-7000-8000-000000000000",
      idempotencyKey,
    });
  }

  @Get("player-entry")
  async listEntry(
    @Headers("x-alpha-identity") identityHeader: unknown,
  ): Promise<PlayerEntryView> {
    const actor = await this.resolveActor(identityHeader);
    const view = await this.listPlayerEntry.execute(actor);

    if (view === undefined) {
      throw new ServiceUnavailableException(
        this.error("SERVICE_UNAVAILABLE", "Não foi possível carregar a entrada agora."),
      );
    }

    return view;
  }

  @Get("characters/:characterId/sheet")
  async getSheet(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Query("chronicleId") chronicleId: string | undefined,
  ): Promise<CharacterSheetDocumentView> {
    const actor = await this.resolveActor(identityHeader);

    if (
      !uuidPattern.test(characterId) ||
      (chronicleId !== undefined && !uuidPattern.test(chronicleId))
    ) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "Os identificadores informados são inválidos."),
      );
    }

    const view = await this.getCharacterSheet.execute(actor, {
      characterId,
      ...(chronicleId === undefined ? {} : { chronicleId }),
    });

    if (view === undefined) {
      throw new NotFoundException(
        this.error(
          "RESOURCE_NOT_AVAILABLE",
          "A ficha solicitada não está disponível para esta identidade.",
        ),
      );
    }

    return view;
  }

  @Get("characters/:characterId/creation/attributes")
  async getAttributes(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
  ): Promise<CreationAttributesStepView> {
    if (!uuidPattern.test(characterId)) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    }
    const actor = await this.resolveActor(identityHeader);
    const view = await this.getCreationAttributes.execute(actor, characterId);
    if (view === undefined) {
      throw new NotFoundException(
        this.error(
          "RESOURCE_NOT_AVAILABLE",
          "A etapa solicitada não está disponível para esta identidade.",
        ),
      );
    }
    return view;
  }

  @Get("characters/:characterId/creation/concept")
  async getConcept(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
  ): Promise<CreationConceptStepView> {
    if (!uuidPattern.test(characterId)) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    }
    const actor = await this.resolveActor(identityHeader);
    const view = await this.getCreationConcept.execute(actor, characterId);
    if (view === undefined) {
      throw new NotFoundException(
        this.error(
          "RESOURCE_NOT_AVAILABLE",
          "A etapa solicitada não está disponível para esta identidade.",
        ),
      );
    }
    return view;
  }

  @Get("characters/:characterId/creation/clan")
  async getClan(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
  ): Promise<CreationClanStepView> {
    if (!uuidPattern.test(characterId)) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    }
    const actor = await this.resolveActor(identityHeader);
    const view = await this.getCreationClan.execute(actor, characterId);
    if (view === undefined) {
      throw new NotFoundException(
        this.error(
          "RESOURCE_NOT_AVAILABLE",
          "A etapa solicitada não está disponível para esta identidade.",
        ),
      );
    }
    return view;
  }

  @Get("characters/:characterId/creation/skills")
  async getSkills(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
  ): Promise<CreationSkillsStepView> {
    if (!uuidPattern.test(characterId))
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    const view = await this.getCreationSkills.execute(
      await this.resolveActor(identityHeader),
      characterId,
    );
    if (view === undefined)
      throw new NotFoundException(
        this.error(
          "RESOURCE_NOT_AVAILABLE",
          "A etapa solicitada não está disponível para esta identidade.",
        ),
      );
    return view;
  }

  @Get("characters/:characterId/creation/disciplines")
  async getDisciplines(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
  ): Promise<CreationDisciplinesStepView> {
    if (!uuidPattern.test(characterId))
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    const view = await this.getCreationDisciplines.execute(
      await this.resolveActor(identityHeader),
      characterId,
    );
    if (view === undefined)
      throw new NotFoundException(
        this.error(
          "RESOURCE_NOT_AVAILABLE",
          "A etapa de Disciplinas não está disponível para esta personagem.",
        ),
      );
    return view;
  }

  @Patch("characters/:characterId/creation/disciplines")
  async patchDisciplines(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Body() body: unknown,
  ): Promise<CreationDisciplinesStepView> {
    const command = uuidPattern.test(characterId)
      ? readDisciplinesCommand(
          characterId,
          this.correlationContext.getCorrelationId() ??
            "00000000-0000-7000-8000-000000000000",
          body,
        )
      : undefined;
    if (command === undefined)
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A alteração de Disciplinas é inválida."),
      );
    try {
      return await this.updateCreationDisciplines.execute(
        await this.resolveActor(identityHeader),
        command,
      );
    } catch (error) {
      if (error instanceof CharacterNotAvailableError)
        throw new NotFoundException(
          this.error(
            "RESOURCE_NOT_AVAILABLE",
            "A etapa solicitada não está disponível para esta identidade.",
          ),
        );
      if (error instanceof CharacterVersionConflictError)
        throw new ConflictException(
          this.error(
            "VERSION_CONFLICT",
            "A ficha foi alterada em outro lugar. Recarregue antes de salvar.",
          ),
        );
      if (error instanceof InvalidCharacterCreationError)
        throw new UnprocessableEntityException(
          this.error(
            "INVALID_REQUEST",
            "Essa escolha não respeita a política de Disciplinas ou precisa de confirmação antes de remover Poderes.",
          ),
        );
      throw error;
    }
  }

  @Patch("characters/:characterId/creation/skills")
  async patchSkills(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Body() body: unknown,
  ): Promise<CreationSkillsStepView> {
    const command = uuidPattern.test(characterId)
      ? readSkillsCommand(
          characterId,
          this.correlationContext.getCorrelationId() ??
            "00000000-0000-7000-8000-000000000000",
          body,
        )
      : undefined;
    if (command === undefined)
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A alteração de Habilidades é inválida."),
      );
    return this.executeSkillsMutation(async () =>
      this.updateCreationSkills.execute(await this.resolveActor(identityHeader), command),
    );
  }

  @Post("characters/:characterId/creation/skills/specialties")
  async createSpecialty(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Body() body: unknown,
  ): Promise<CreationSkillsStepView> {
    const command = uuidPattern.test(characterId)
      ? readCreateSpecialtyCommand(
          characterId,
          this.correlationContext.getCorrelationId() ??
            "00000000-0000-7000-8000-000000000000",
          body,
        )
      : undefined;
    if (command === undefined)
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A Especialização informada é inválida."),
      );
    return this.executeSkillsMutation(async () =>
      this.updateCreationSkills.createSpecialty(
        await this.resolveActor(identityHeader),
        command,
      ),
    );
  }

  @Patch("characters/:characterId/creation/skills/specialties/:specialtyId")
  async patchSpecialty(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Param("specialtyId") specialtyId: string,
    @Body() body: unknown,
  ): Promise<CreationSkillsStepView> {
    const command = uuidPattern.test(characterId)
      ? readSpecialtyMutationCommand(
          characterId,
          specialtyId,
          this.correlationContext.getCorrelationId() ??
            "00000000-0000-7000-8000-000000000000",
          body,
        )
      : undefined;
    if (
      command === undefined ||
      !("label" in command) ||
      typeof command.label !== "string"
    )
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A alteração da Especialização é inválida."),
      );
    return this.executeSkillsMutation(async () =>
      this.updateCreationSkills.updateSpecialty(
        await this.resolveActor(identityHeader),
        command as UpdateCreationSpecialtyCommand,
      ),
    );
  }

  @Delete("characters/:characterId/creation/skills/specialties/:specialtyId")
  async deleteSpecialty(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Param("specialtyId") specialtyId: string,
    @Body() body: unknown,
  ): Promise<CreationSkillsStepView> {
    const command = uuidPattern.test(characterId)
      ? readSpecialtyMutationCommand(
          characterId,
          specialtyId,
          this.correlationContext.getCorrelationId() ??
            "00000000-0000-7000-8000-000000000000",
          body,
        )
      : undefined;
    if (command === undefined || "label" in command)
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A remoção da Especialização é inválida."),
      );
    return this.executeSkillsMutation(async () =>
      this.updateCreationSkills.deleteSpecialty(
        await this.resolveActor(identityHeader),
        command,
      ),
    );
  }

  @Patch("characters/:characterId/sheet")
  async updateSheet(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Body() body: unknown,
  ): Promise<CharacterSheetMutationView> {
    if (!uuidPattern.test(characterId)) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    }

    const actor = await this.resolveActor(identityHeader);
    const command = readUpdateCommand(
      characterId,
      this.correlationContext.getCorrelationId() ??
        "00000000-0000-7000-8000-000000000000",
      body,
    );
    if (command === undefined) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A alteração da ficha é inválida."),
      );
    }

    try {
      return await this.updateCharacterSheet.execute(actor, command);
    } catch (error) {
      if (error instanceof CharacterNotAvailableError) {
        throw new NotFoundException(
          this.error(
            "RESOURCE_NOT_AVAILABLE",
            "A ficha solicitada não está disponível para esta identidade.",
          ),
        );
      }
      if (error instanceof CharacterVersionConflictError) {
        throw new ConflictException(
          this.error(
            "VERSION_CONFLICT",
            "A ficha foi alterada em outro lugar. Recarregue antes de salvar.",
          ),
        );
      }
      throw error;
    }
  }

  @Patch("characters/:characterId/creation/attributes")
  async updateAttributes(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Body() body: unknown,
  ): Promise<CreationAttributesMutationView> {
    if (!uuidPattern.test(characterId)) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    }
    const actor = await this.resolveActor(identityHeader);
    const command = readAttributesCommand(
      characterId,
      this.correlationContext.getCorrelationId() ??
        "00000000-0000-7000-8000-000000000000",
      body,
    );
    if (command === undefined) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A alteração de Atributos é inválida."),
      );
    }
    try {
      return await this.updateCreationAttributes.execute(actor, command);
    } catch (error) {
      if (error instanceof CharacterNotAvailableError) {
        throw new NotFoundException(
          this.error(
            "RESOURCE_NOT_AVAILABLE",
            "A ficha solicitada não está disponível para esta identidade.",
          ),
        );
      }
      if (error instanceof CharacterVersionConflictError) {
        throw new ConflictException(
          this.error(
            "VERSION_CONFLICT",
            "A ficha foi alterada em outro lugar. Recarregue antes de salvar.",
          ),
        );
      }
      if (error instanceof InvalidCharacterCreationError) {
        throw new UnprocessableEntityException(
          this.error(
            "INVALID_REQUEST",
            "Essa escolha não cabe na distribuição inicial de Atributos.",
          ),
        );
      }
      throw error;
    }
  }

  @Patch("characters/:characterId/creation/concept")
  async updateConcept(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Body() body: unknown,
  ): Promise<CreationConceptStepView> {
    if (!uuidPattern.test(characterId)) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    }
    const actor = await this.resolveActor(identityHeader);
    const command = readConceptCommand(
      characterId,
      this.correlationContext.getCorrelationId() ??
        "00000000-0000-7000-8000-000000000000",
      body,
    );
    if (command === undefined) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A alteração de Conceito é inválida."),
      );
    }
    try {
      return await this.updateCreationConcept.execute(actor, command);
    } catch (error) {
      if (error instanceof CharacterNotAvailableError) {
        throw new NotFoundException(
          this.error(
            "RESOURCE_NOT_AVAILABLE",
            "A ficha solicitada não está disponível para esta identidade.",
          ),
        );
      }
      if (error instanceof CharacterVersionConflictError) {
        throw new ConflictException(
          this.error(
            "VERSION_CONFLICT",
            "A ficha foi alterada em outro lugar. Recarregue antes de salvar.",
          ),
        );
      }
      if (error instanceof InvalidCharacterCreationError) {
        throw new UnprocessableEntityException(
          this.error(
            "INVALID_REQUEST",
            "A etapa excede os limites do perfil de criação ativo.",
          ),
        );
      }
      throw error;
    }
  }

  @Patch("characters/:characterId/creation/clan")
  async updateClan(
    @Headers("x-alpha-identity") identityHeader: unknown,
    @Param("characterId") characterId: string,
    @Body() body: unknown,
  ): Promise<CreationClanStepView> {
    if (!uuidPattern.test(characterId)) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "O identificador informado é inválido."),
      );
    }
    const actor = await this.resolveActor(identityHeader);
    const command = readClanCommand(
      characterId,
      this.correlationContext.getCorrelationId() ??
        "00000000-0000-7000-8000-000000000000",
      body,
    );
    if (command === undefined) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "A escolha de origem é inválida."),
      );
    }
    try {
      return await this.updateCreationClan.execute(actor, command);
    } catch (error) {
      if (error instanceof CharacterNotAvailableError) {
        throw new NotFoundException(
          this.error(
            "RESOURCE_NOT_AVAILABLE",
            "A ficha solicitada não está disponível para esta identidade.",
          ),
        );
      }
      if (error instanceof CharacterVersionConflictError) {
        throw new ConflictException(
          this.error(
            "VERSION_CONFLICT",
            "A ficha foi alterada em outro lugar. Recarregue antes de salvar.",
          ),
        );
      }
      if (error instanceof InvalidCharacterCreationError) {
        throw new UnprocessableEntityException(
          this.error("INVALID_REQUEST", "A origem não pertence ao catálogo ativo."),
        );
      }
      throw error;
    }
  }

  private error(code: PublicApiErrorCode, message: string): PublicApiErrorResponse {
    return {
      error: {
        code,
        correlationId:
          this.correlationContext.getCorrelationId() ?? "request-context-unavailable",
        message,
      },
    };
  }

  private async executeSkillsMutation(
    operation: () => Promise<CreationSkillsStepView>,
  ): Promise<CreationSkillsStepView> {
    try {
      return await operation();
    } catch (error) {
      if (error instanceof CharacterNotAvailableError)
        throw new NotFoundException(
          this.error(
            "RESOURCE_NOT_AVAILABLE",
            "A etapa solicitada não está disponível para esta identidade.",
          ),
        );
      if (error instanceof CharacterVersionConflictError)
        throw new ConflictException(
          this.error(
            "VERSION_CONFLICT",
            "A ficha foi alterada em outro lugar. Recarregue antes de salvar.",
          ),
        );
      if (error instanceof InvalidCharacterCreationError)
        throw new UnprocessableEntityException(
          this.error(
            "INVALID_REQUEST",
            "Essa escolha não cabe na política de Habilidades e Especializações.",
          ),
        );
      throw error;
    }
  }

  private async resolveActor(identityHeader: unknown) {
    try {
      return await this.identityProvider.resolve(readSingleHeader(identityHeader));
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new UnauthorizedException(
          this.error(
            "AUTHENTICATION_REQUIRED",
            "Escolha uma identidade fictícia válida para continuar.",
          ),
        );
      }
      throw error;
    }
  }
}
