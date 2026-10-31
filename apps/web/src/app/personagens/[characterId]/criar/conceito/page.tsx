import type { Metadata } from "next";

import { GuidedConcept } from "./guided-concept";

export const metadata: Metadata = {
  description: "Defina quem é o personagem na mesma ficha.",
  title: "Conceito · Criação guiada",
};

export default async function GuidedConceptPage({
  params,
}: {
  readonly params: Promise<{ readonly characterId: string }>;
}) {
  const { characterId } = await params;
  return <GuidedConcept characterId={characterId} />;
}
