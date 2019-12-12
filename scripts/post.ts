import _fs from "fs";
import dotenv from "dotenv";

import { postFbPhoto } from "../src/postFbPhoto";

dotenv.config();

const fs = _fs.promises;

console.log("page id: " + process.env.PAGE_ID);
console.log("page token: " + process.env.PAGE_TOKEN);
console.log("publish start: " + process.env.PUBLISH_START);

if (
  !process.env.PAGE_ID ||
  !process.env.PAGE_TOKEN ||
  !process.env.PUBLISH_START
) {
  console.log("PAGE_ID, PAGE_TOKEN, PUBLISH_START missing in your .env file");
  process.exit(1);
}

const post = postFbPhoto(process.env.PAGE_ID!, process.env.PAGE_TOKEN!);
const date = new Date(process.env.PUBLISH_START!);
date.setHours(15);

console.clear();
console.log("posting...");

fs.readdir("./render").then(dirs => {
  dirs
    .sort((a, b) => parseInt(a, 10) - parseInt(b, 10))
    .reduce(
      (acc, dir, i) =>
        acc
          .then(async () => {
            const path = "./render/" + dir + "/";
            const text = (await fs.readFile(path + "text.txt")).toString();
            date.setHours(date.getHours() + 1);
            console.log(
              "schedule post for: ",
              date.toString(),
              `(${i}/${dirs.length})`
            );
            await post(
              text,
              path + "map.png",
              (date.getTime() / 1000).toFixed(0)
            );
          })
          .catch(e => {
            process.exit(1);
          }),
      new Promise(resolve => resolve())
    );
});
