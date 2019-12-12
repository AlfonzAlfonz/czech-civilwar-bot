import { Faction } from "./types";
import { getControllingFaction, factionPower } from "./game";

// utility functions for web

export const button = (id: string) => (onClick: (e: MouseEvent) => unknown) =>
  document.getElementById(id)!.addEventListener("click", onClick);

export const updateUI = (factions: Faction[]) => {
  Array.from(document.querySelectorAll("#map svg path")).map((p, i) => {
    if (i === 0) {
      return;
    }
    const style = (p as any).style as CSSStyleDeclaration;
    style.fill = getControllingFaction(factions, i)!.color;
  });

  document.getElementById("faction-list")!.innerHTML = factions
    .sort((a, b) => factionPower(b) - factionPower(a))
    .map((f, i) => `<li> ${f.name} (${factionPower(f).toFixed(3)})</li>`)
    .join("\n");
};
