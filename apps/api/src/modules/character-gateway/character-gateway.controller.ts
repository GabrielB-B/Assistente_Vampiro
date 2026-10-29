import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Headers,
  Inject,
  NotFoundException,
  Param,
  Post,
  Res,
  UnauthorizedException,
} from "@nestjs/common";

import { AuthenticationError } from "../identity-access/application/authentication-error.js";
import {
  IDENTITY_PROVIDER,
  type IdentityProvider,
} from "../identity-access/application/identity-provider.js";
import { ActiveCharacterCookie } from "./adapters/active-character-cookie.js";
import type { CharacterSelection } from "./application/character-gateway.service.js";
import { CharacterGatewayService } from "./application/character-gateway.service.js";
import { CharacterNotAvailableError } from "./application/character-not-available-error.js";

interface SelectionBody {
  readonly chronicleId?: unknown;
}

interface CookieResponse {
  cookie(
    name: string,
    value: string,
    options: {
      readonly httpOnly: boolean;
      readonly maxAge: number;
      readonly path: string;
      readonly sameSite: "strict";
      readonly secure: boolean;
    },
  ): void;
}

const uuidPattern =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/iu;

@Controller("player/characters")
export class CharacterGatewayController {
  constructor(
    private readonly gateway: CharacterGatewayService,
    @Inject(IDENTITY_PROVIDER) private readonly identities: IdentityProvider,
    private readonly activeCharacterCookie: ActiveCharacterCookie,
  ) {}

  @Get()
  async list(@Headers("x-alpha-identity") alias: string | undefined) {
    const actor = await this.resolveActor(alias);
    return this.gateway.list(actor);
  }

  @Post(":characterId/selection")
  async select(
    @Param("characterId") characterId: string,
    @Body() body: SelectionBody,
    @Headers("x-alpha-identity") alias: string | undefined,
    @Res({ passthrough: true }) response: CookieResponse,
  ): Promise<CharacterSelection> {
    if (
      !uuidPattern.test(characterId) ||
      typeof body.chronicleId !== "string" ||
      !uuidPattern.test(body.chronicleId)
    ) {
      throw new BadRequestException({ code: "INVALID_SELECTION" });
    }

    const actor = await this.resolveActor(alias);
    try {
      const selection = await this.gateway.select(actor, characterId, body.chronicleId);
      response.cookie(
        "av_active_character",
        this.activeCharacterCookie.encode(actor, selection.activeCharacter),
        {
          httpOnly: true,
          maxAge: 8 * 60 * 60 * 1000,
          path: "/",
          sameSite: "strict",
          secure: process.env.NODE_ENV === "production",
        },
      );
      return selection;
    } catch (error) {
      if (error instanceof CharacterNotAvailableError) {
        throw new NotFoundException({ code: error.code });
      }
      throw error;
    }
  }

  private async resolveActor(alias: string | undefined) {
    try {
      return await this.identities.resolve(alias);
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new UnauthorizedException({ code: error.code });
      }
      throw error;
    }
  }
}
