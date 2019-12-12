import _fs from "fs";
import libxmljs from "libxmljs";
import { getControllingFaction } from "./game";
import { Faction } from "./types";

const fs = _fs.promises;

// render map to svg
export const renderSvg = (factions: Faction[]) =>
  fs
    .readFile("./static/map.svg")
    .then(data => libxmljs.parseXml(data.toString()))
    .then(data => {
      data
        .root()!
        .childNodes()
        // filter path element
        .filter(
          x =>
            x.type() === "element" && (x as libxmljs.Element).name() === "path"
        )
        .map((x, i) => {
          const style = (x as libxmljs.Element).attr("style")!.value();

          // Replace fill style
          (x as libxmljs.Element)
            .attr("style")!
            .value(
              style.replace(
                /fill:\#\w{6};/,
                `fill: ${getControllingFaction(factions, i + 1)!.color};`
              )
            );
        });
      return data;
    });
