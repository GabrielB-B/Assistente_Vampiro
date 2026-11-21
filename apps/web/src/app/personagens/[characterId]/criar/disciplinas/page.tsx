import type { Metadata } from "next";
import { GuidedDisciplines } from "./guided-disciplines";

export const metadata: Metadata = {
  description: "Distribua Disciplinas e escolha os Poderes iniciais da personagem.",
  title: "Disciplinas · Criação guiada",
};

export default async function GuidedDisciplinesPage({
  params,
}: {
  readonly params: Promise<{ readonly characterId: string }>;
}) {
  const { characterId } = await params;
  return <GuidedDisciplines characterId={characterId} />;
}
