import type { Metadata } from "next";

import { GuidedClan } from "./guided-clan";

export const metadata: Metadata = {
  description: "Escolha a linhagem de Sangue na mesma ficha de personagem.",
  title: "Clã · Criação guiada",
};

export default async function GuidedClanPage({
  params,
}: {
  readonly params: Promise<{ readonly characterId: string }>;
}) {
  const { characterId } = await params;
  return <GuidedClan characterId={characterId} />;
}
