import type { CreationOriginId } from "@assistente-vampiro/contracts";

export interface ClanVisualIdentity {
  readonly accent: string;
  readonly deep: string;
  readonly symbol: string;
}

export const CLAN_VISUALS: Readonly<
  Partial<Record<CreationOriginId, ClanVisualIdentity>>
> = {
  "clan:banu-haqim": {
    accent: "#b29d34",
    deep: "#72171a",
    symbol: "/images/clans/banu-haqim.png",
  },
  "clan:brujah": {
    accent: "#c30011",
    deep: "#a90015",
    symbol: "/images/clans/brujah.png",
  },
  "clan:gangrel": {
    accent: "#7e846b",
    deep: "#2e2f04",
    symbol: "/images/clans/gangrel.png",
  },
  "clan:hecata": {
    accent: "#886f68",
    deep: "#3d2c2e",
    symbol: "/images/clans/hecata.png",
  },
  "clan:lasombra": {
    accent: "#292b36",
    deep: "#0c080b",
    symbol: "/images/clans/lasombra.png",
  },
  "clan:malkavian": {
    accent: "#f93943",
    deep: "#445e93",
    symbol: "/images/clans/malkavian.png",
  },
  "clan:ministry": {
    accent: "#618b25",
    deep: "#1c0118",
    symbol: "/images/clans/ministry.png",
  },
  "clan:nosferatu": {
    accent: "#404e51",
    deep: "#272826",
    symbol: "/images/clans/nosferatu.png",
  },
  "clan:ravnos": {
    accent: "#c78f44",
    deep: "#5c251f",
    symbol: "/images/clans/ravnos.png",
  },
  "clan:salubri": {
    accent: "#a93f55",
    deep: "#5a5766",
    symbol: "/images/clans/salubri.png",
  },
  "clan:toreador": {
    accent: "#9c0321",
    deep: "#4a001f",
    symbol: "/images/clans/toreador.png",
  },
  "clan:tremere": {
    accent: "#501e5c",
    deep: "#201d1d",
    symbol: "/images/clans/tremere.png",
  },
  "clan:tzimisce": {
    accent: "#643173",
    deep: "#333333",
    symbol: "/images/clans/tzimisce.png",
  },
  "clan:ventrue": {
    accent: "#b09e4f",
    deep: "#0f0d4f",
    symbol: "/images/clans/ventrue.png",
  },
};
