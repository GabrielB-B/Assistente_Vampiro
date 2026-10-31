import type { Metadata } from "next";

import { GuidedAttributes } from "./guided-attributes";

export const metadata: Metadata = {
  description: "Distribua os Atributos na mesma ficha de personagem.",
  title: "Atributos · Criação guiada",
};

export default async function GuidedAttributesPage({
  params,
}: {
  readonly params: Promise<{ readonly characterId: string }>;
}) {
  const { characterId } = await params;
  return <GuidedAttributes characterId={characterId} />;
}
