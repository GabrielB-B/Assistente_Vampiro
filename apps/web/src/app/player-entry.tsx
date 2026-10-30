"use client";

import {
  ALPHA_IDENTITY_OPTIONS,
  type AlphaIdentityAlias,
  type CharacterEntrySummaryView,
  type CharacterSheetView,
  type PlayerEntryView,
} from "@assistente-vampiro/contracts";
import { useEffect, useState } from "react";

import { CharacterApiError, loadCharacterSheet, loadPlayerEntry } from "./character-api";
import { CharacterSheetPrototype } from "./character-sheet-prototype";

type EntryState =
  | { readonly status: "loading" }
  | {
      readonly displayName: string;
      readonly status: "empty";
    }
  | {
      readonly correlationId: string | null;
      readonly message: string;
      readonly status: "error";
    }
  | {
      readonly entry: PlayerEntryView;
      readonly selectedCharacter: CharacterEntrySummaryView;
      readonly sheet: CharacterSheetView;
      readonly status: "ready";
    };

function IdentitySelector({
  identityAlias,
  onIdentityChange,
}: {
  readonly identityAlias: AlphaIdentityAlias;
  readonly onIdentityChange: (alias: AlphaIdentityAlias) => void;
}) {
  return (
    <label className="entry-identity-select">
      <span>Identidade fictícia do alpha</span>
      <select
        onChange={(event) => onIdentityChange(event.target.value as AlphaIdentityAlias)}
        value={identityAlias}
      >
        {ALPHA_IDENTITY_OPTIONS.map((identity) => (
          <option key={identity.alias} value={identity.alias}>
            {identity.label} · {identity.roleHint}
          </option>
        ))}
      </select>
    </label>
  );
}

function EntryStateScreen({
  identityAlias,
  onIdentityChange,
  onRetry,
  state,
}: {
  readonly identityAlias: AlphaIdentityAlias;
  readonly onIdentityChange: (alias: AlphaIdentityAlias) => void;
  readonly onRetry: () => void;
  readonly state: Exclude<EntryState, { readonly status: "ready" }>;
}) {
  return (
    <main className="entry-state-shell">
      <header>
        <div className="wordmark entry-wordmark">
          <span aria-hidden="true">AV</span>
          <strong>Assistente Vampiro</strong>
        </div>
        <IdentitySelector
          identityAlias={identityAlias}
          onIdentityChange={onIdentityChange}
        />
      </header>
      <section aria-live="polite" className={`entry-state entry-state--${state.status}`}>
        <p>Entrada do jogador · V5</p>
        {state.status === "loading" ? (
          <>
            <span aria-hidden="true" className="entry-loading-mark" />
            <h1>A noite está abrindo os arquivos.</h1>
            <small>Autenticando a identidade e preparando a projeção permitida.</small>
          </>
        ) : null}
        {state.status === "empty" ? (
          <>
            <span aria-hidden="true" className="entry-empty-mark">
              00
            </span>
            <h1>Nenhuma personagem disponível.</h1>
            <small>
              {state.displayName} possui uma identidade válida, mas não controla nem narra
              uma personagem vinculada nesta Crônica.
            </small>
          </>
        ) : null}
        {state.status === "error" ? (
          <>
            <span aria-hidden="true" className="entry-error-mark">
              !
            </span>
            <h1>O arquivo não respondeu.</h1>
            <small>{state.message}</small>
            {state.correlationId ? <code>Referência {state.correlationId}</code> : null}
            <button onClick={onRetry} type="button">
              Tentar novamente
            </button>
          </>
        ) : null}
      </section>
    </main>
  );
}

export function PlayerEntry({
  initialCharacterId,
  initialIdentityAlias = "player-one",
}: {
  readonly initialCharacterId?: string;
  readonly initialIdentityAlias?: AlphaIdentityAlias;
}) {
  const [identityAlias, setIdentityAlias] =
    useState<AlphaIdentityAlias>(initialIdentityAlias);
  const [reloadVersion, setReloadVersion] = useState(0);
  const [state, setState] = useState<EntryState>({ status: "loading" });

  useEffect(() => {
    const abortController = new AbortController();

    const load = async () => {
      try {
        const entry = await loadPlayerEntry(identityAlias, abortController.signal);
        const selectedCharacter = initialCharacterId
          ? entry.characters.find(
              (character) => character.characterId === initialCharacterId,
            )
          : entry.characters[0];
        if (selectedCharacter === undefined) {
          setState({ displayName: entry.actor.displayName, status: "empty" });
          return;
        }

        const sheet = await loadCharacterSheet(
          identityAlias,
          selectedCharacter,
          abortController.signal,
        );
        setState({ entry, selectedCharacter, sheet, status: "ready" });
      } catch (error) {
        if (abortController.signal.aborted) return;
        setState({
          correlationId: error instanceof CharacterApiError ? error.correlationId : null,
          message:
            error instanceof Error
              ? error.message
              : "Não foi possível acessar a API local.",
          status: "error",
        });
      }
    };

    void load();
    return () => abortController.abort();
  }, [identityAlias, initialCharacterId, reloadVersion]);

  const changeIdentity = (alias: AlphaIdentityAlias) => {
    setState({ status: "loading" });
    setIdentityAlias(alias);
  };

  if (state.status !== "ready") {
    return (
      <EntryStateScreen
        identityAlias={identityAlias}
        onIdentityChange={changeIdentity}
        onRetry={() => {
          setState({ status: "loading" });
          setReloadVersion((version) => version + 1);
        }}
        state={state}
      />
    );
  }

  return <CharacterSheetPrototype sheet={state.sheet} />;
}
