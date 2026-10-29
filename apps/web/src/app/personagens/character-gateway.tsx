"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import {
  CharacterGatewayClientError,
  listCharacters,
  selectCharacter,
  type GatewayFailure,
} from "./character-gateway.client";
import styles from "./character-gateway.module.css";
import type {
  CharacterGatewayItem,
  CharacterGatewayList,
} from "./character-gateway.types";
import { AnkhMark } from "./ankh-mark";

interface CharacterGatewayProperties {
  readonly preview?: CharacterGatewayList;
}

type LoadState = "empty" | "loading" | "ready" | GatewayFailure;

function initials(name: string): string {
  return name
    .split(/\s+/u)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toLocaleUpperCase("pt-BR");
}

function activityLabel(value: string | null): string {
  if (value === null) {
    return "Ainda sem sessões";
  }
  const activity = new Date(value);
  const difference = Date.now() - activity.getTime();
  const days = Math.max(0, Math.floor(difference / 86_400_000));
  if (days === 0) {
    return "Última sessão hoje";
  }
  return `Última sessão há ${days} ${days === 1 ? "dia" : "dias"}`;
}

function failureState(error: unknown): GatewayFailure {
  return error instanceof CharacterGatewayClientError ? error.failure : "error";
}

export function CharacterGateway({ preview }: CharacterGatewayProperties) {
  const [characters, setCharacters] = useState<readonly CharacterGatewayItem[]>(
    preview?.characters ?? [],
  );
  const [loadState, setLoadState] = useState<LoadState>(() => {
    if (preview === undefined) {
      return "loading";
    }
    return preview.characters.length === 0 ? "empty" : "ready";
  });
  const [selectedId, setSelectedId] = useState<string | null>(
    preview?.characters[0]?.characterId ?? null,
  );
  const [retry, setRetry] = useState(0);
  const [isEntering, setIsEntering] = useState(false);
  const [notice, setNotice] = useState("");
  const characterButtons = useRef(new Map<string, HTMLButtonElement>());

  useEffect(() => {
    if (preview !== undefined) {
      return;
    }

    const controller = new AbortController();
    void listCharacters(controller.signal)
      .then((response) => {
        setCharacters(response.characters);
        setSelectedId(response.characters[0]?.characterId ?? null);
        setLoadState(response.characters.length === 0 ? "empty" : "ready");
      })
      .catch((error: unknown) => {
        if (!(error instanceof DOMException && error.name === "AbortError")) {
          setLoadState(failureState(error));
        }
      });

    return () => controller.abort();
  }, [preview, retry]);

  const selectedCharacter = characters.find(
    (character) => character.characterId === selectedId,
  );

  function retryLoading(): void {
    setLoadState("loading");
    setRetry((value) => value + 1);
  }

  function chooseCharacter(character: CharacterGatewayItem): void {
    setSelectedId(character.characterId);
    setNotice(`${character.name} selecionada.`);
  }

  function handleCharacterKeyDown(
    event: KeyboardEvent<HTMLButtonElement>,
    index: number,
  ): void {
    if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) {
      return;
    }
    event.preventDefault();
    const nextIndex =
      event.key === "Home"
        ? 0
        : event.key === "End"
          ? characters.length - 1
          : (index + (event.key === "ArrowRight" ? 1 : -1) + characters.length) %
            characters.length;
    const next = characters[nextIndex];
    if (next !== undefined) {
      chooseCharacter(next);
      characterButtons.current.get(next.characterId)?.focus();
    }
  }

  async function enterNight(): Promise<void> {
    if (selectedCharacter === undefined || isEntering) {
      return;
    }
    if (preview !== undefined) {
      setNotice(
        `${selectedCharacter.name} está pronta. A tela “Boa noite” pertence ao próximo incremento.`,
      );
      return;
    }

    setIsEntering(true);
    setNotice("");
    try {
      const selection = await selectCharacter(
        selectedCharacter.characterId,
        selectedCharacter.chronicleId,
      );
      window.location.assign(selection.nextPath);
    } catch (error) {
      setNotice(
        failureState(error) === "denied"
          ? "Este personagem não está disponível para sua identidade."
          : "Não foi possível entrar agora. Tente novamente.",
      );
      setIsEntering(false);
    }
  }

  return (
    <main className={styles.gateway}>
      <div aria-hidden="true" className={styles.atmosphere} />
      <header className={styles.header}>
        <Link aria-label="Nocturna — início" className={styles.brand} href="/">
          <AnkhMark />
          <span>Nocturna</span>
        </Link>

        <nav aria-label="Navegação principal" className={styles.navigation}>
          <a aria-current="page" href="#character-list">
            Personagens
          </a>
          <span aria-hidden="true" className={styles.separator} />
          <span aria-disabled="true">Mestre</span>
          <span aria-hidden="true" className={styles.separator} />
          <span aria-disabled="true">Configurações</span>
          <span aria-hidden="true" className={styles.separator} />
          <span aria-disabled="true">Sair</span>
        </nav>
      </header>

      <section aria-labelledby="gateway-title" className={styles.content}>
        <div className={styles.introduction}>
          <AnkhMark />
          <h1 id="gateway-title">Seus personagens</h1>
          <p>Escolha com quem você vai continuar.</p>
        </div>

        {loadState === "loading" ? <LoadingState /> : null}
        {loadState === "empty" ? <EmptyState /> : null}
        {loadState === "denied" ? (
          <FeedbackState
            description="Sua identidade não possui personagens disponíveis neste contexto."
            title="A noite permanece fechada"
          />
        ) : null}
        {loadState === "unavailable" ? (
          <FeedbackState
            action={retryLoading}
            description="O serviço de personagens não respondeu. Nenhuma seleção foi alterada."
            title="A noite está indisponível"
          />
        ) : null}
        {loadState === "error" ? (
          <FeedbackState
            action={retryLoading}
            description="Ocorreu uma falha ao buscar seus personagens."
            title="Não foi possível abrir a passagem"
          />
        ) : null}

        {loadState === "ready" ? (
          <>
            <div className={styles.characterList} id="character-list">
              <div
                aria-label="Escolha um personagem"
                className={styles.characters}
                role="group"
              >
                {characters.map((character, index) => {
                  const selected = character.characterId === selectedId;
                  return (
                    <button
                      aria-label={`Selecionar ${character.name}, ${character.clan ?? "clã não informado"}`}
                      aria-pressed={selected}
                      className={`${styles.character} ${selected ? styles.selected : ""}`}
                      key={`${character.characterId}:${character.chronicleId}`}
                      onClick={() => chooseCharacter(character)}
                      onKeyDown={(event) => handleCharacterKeyDown(event, index)}
                      ref={(node) => {
                        if (node === null) {
                          characterButtons.current.delete(character.characterId);
                        } else {
                          characterButtons.current.set(character.characterId, node);
                        }
                      }}
                      type="button"
                    >
                      <span className={styles.portrait}>
                        {character.portraitUrl === null ? (
                          <span aria-hidden="true" className={styles.monogram}>
                            {initials(character.name)}
                          </span>
                        ) : (
                          // Portrait URLs come from the authorized projection, not user input.
                          // eslint-disable-next-line @next/next/no-img-element
                          <img alt="" src={character.portraitUrl} />
                        )}
                      </span>
                      <span className={styles.characterName}>{character.name}</span>
                      <span className={styles.characterClan}>
                        {character.clan ?? "Clã não informado"}
                      </span>
                    </button>
                  );
                })}

                <button
                  aria-describedby="creation-status"
                  className={styles.createCharacter}
                  onClick={() =>
                    setNotice(
                      "A criação de personagem será liberada em uma etapa futura.",
                    )
                  }
                  type="button"
                >
                  <span aria-hidden="true" className={styles.createCircle}>
                    <span />
                  </span>
                  <span className={styles.characterName}>Novo</span>
                  <span className={styles.characterClan}>Criar personagem</span>
                </button>
              </div>
            </div>

            {selectedCharacter === undefined ? null : (
              <div className={styles.context}>
                <dl>
                  <div>
                    <dt>Crônica</dt>
                    <dd>{selectedCharacter.chronicleTitle}</dd>
                  </div>
                  <div>
                    <dt>Status</dt>
                    <dd>{activityLabel(selectedCharacter.lastActivityAt)}</dd>
                  </div>
                </dl>
                <button
                  className={styles.enterButton}
                  disabled={isEntering}
                  onClick={() => void enterNight()}
                  type="button"
                >
                  <span>{isEntering ? "Entrando" : "Entrar"}</span>
                  <span aria-hidden="true">→</span>
                </button>
              </div>
            )}
          </>
        ) : null}

        <p
          aria-live="polite"
          className={styles.liveRegion}
          id="creation-status"
          role="status"
        >
          {notice}
        </p>
      </section>
    </main>
  );
}

function LoadingState() {
  return (
    <div aria-label="Carregando personagens" className={styles.loading} role="status">
      <span />
      <span />
      <span />
      <p>Preparando a passagem…</p>
    </div>
  );
}

function EmptyState() {
  return (
    <FeedbackState
      description="Você ainda não possui personagens disponíveis. A criação será liberada em uma etapa futura."
      title="Nenhuma identidade aguarda"
    />
  );
}

function FeedbackState({
  action,
  description,
  title,
}: {
  readonly action?: () => void;
  readonly description: string;
  readonly title: string;
}) {
  return (
    <div className={styles.feedback} role="status">
      <span aria-hidden="true" />
      <h2>{title}</h2>
      <p>{description}</p>
      {action === undefined ? null : (
        <button onClick={action} type="button">
          Tentar novamente
        </button>
      )}
    </div>
  );
}
