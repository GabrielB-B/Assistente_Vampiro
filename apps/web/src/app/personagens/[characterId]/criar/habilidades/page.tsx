import type { Metadata } from "next";
import { GuidedSkills } from "./guided-skills";

export const metadata: Metadata = {
  description: "Distribua Habilidades e registre Especializações na mesma ficha.",
  title: "Habilidades · Criação guiada",
};
export default async function GuidedSkillsPage({
  params,
}: {
  readonly params: Promise<{ readonly characterId: string }>;
}) {
  const { characterId } = await params;
  return <GuidedSkills characterId={characterId} />;
}
