import type { Metadata } from "next";

import { CreationModeSelection } from "./creation-mode-selection";

export const metadata: Metadata = {
  description: "Escolha como iniciar a mesma ficha de personagem.",
  title: "Criar personagem · Assistente Vampiro",
};

export default function CharacterCreationModePage() {
  return <CreationModeSelection />;
}
