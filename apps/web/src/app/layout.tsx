import type { Metadata } from "next";
import type { ReactNode } from "react";

import "./globals.css";

export const metadata: Metadata = {
  description: "Assistente contextual para Vampiro: A Máscara.",
  title: "Assistente Vampiro",
};

interface RootLayoutProperties {
  readonly children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProperties) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
