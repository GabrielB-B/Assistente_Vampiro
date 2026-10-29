import type { Metadata } from "next";

import { CharacterGateway } from "./character-gateway";
import { characterGatewayPreview } from "./character-gateway.preview";

export const metadata: Metadata = {
  description: "Escolha a identidade com que você continuará pela noite.",
  title: "Seus personagens · Nocturna",
};

export default function CharacterGatewayPage() {
  const previewEnabled = process.env.CHARACTER_GATEWAY_PREVIEW === "true";
  return previewEnabled ? (
    <CharacterGateway preview={characterGatewayPreview} />
  ) : (
    <CharacterGateway />
  );
}
