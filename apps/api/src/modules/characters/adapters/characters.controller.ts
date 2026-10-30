import type {
  CharacterSheetView,
  PlayerEntryView,
  PublicApiErrorCode,
  PublicApiErrorResponse,
} from "@assistente-vampiro/contracts";
import {
  BadRequestException,
  Controller,
  Get,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Query,
  ServiceUnavailableException,
  UnauthorizedException,
} from "@nestjs/common";

import { CorrelationContext } from "../../../observability/correlation-context.js";
import { AuthenticationError } from "../../identity-access/application/authentication-error.js";
import {
  IDENTITY_PROVIDER,
  type IdentityProvider,
} from "../../identity-access/application/identity-provider.js";
import {
  GET_CHARACTER_SHEET,
  type GetCharacterSheet,
} from "../application/get-character-sheet.js";
import {
  LIST_PLAYER_ENTRY,
  type ListPlayerEntry,
} from "../application/list-player-entry.js";

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

function readSingleHeader(value: unknown): string | undefined {
  return typeof value === "string" ? value : undefined;
}

@Controller()
export class CharactersController {
  constructor(
    @Inject(IDENTITY_PROVIDER) private readonly identityProvider: IdentityProvider,
    @Inject(LIST_PLAYER_ENTRY) private readonly listPlayerEntry: ListPlayerEntry,
    @Inject(GET_CHARACTER_SHEET)
    private readonly getCharacterSheet: GetCharacterSheet,
    @Inject(CorrelationContext) private readonly correlationContext: CorrelationContext,
  ) {}

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
  ): Promise<CharacterSheetView> {
    const actor = await this.resolveActor(identityHeader);

    if (
      !uuidPattern.test(characterId) ||
      !chronicleId ||
      !uuidPattern.test(chronicleId)
    ) {
      throw new BadRequestException(
        this.error("INVALID_REQUEST", "Os identificadores informados são inválidos."),
      );
    }

    const view = await this.getCharacterSheet.execute(actor, {
      characterId,
      chronicleId,
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
