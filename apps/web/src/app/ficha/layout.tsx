import { IBM_Plex_Sans, Newsreader } from "next/font/google";
import type { ReactNode } from "react";

import "./character-sheet.css";

const interfaceFont = IBM_Plex_Sans({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-interface",
  weight: ["400", "500", "600", "700"],
});

const editorialFont = Newsreader({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-editorial",
});

export default function CharacterSheetLayout({
  children,
}: {
  readonly children: ReactNode;
}) {
  return (
    <div className={`${interfaceFont.variable} ${editorialFont.variable}`}>
      {children}
    </div>
  );
}
