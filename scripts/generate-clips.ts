import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { analyzeTranscript } from "../lib/gemini";
import { cutVideo } from "../lib/cutVideo";

async function main() {
try {
const transcript = fs.readFileSync(
"Me at the zoo [jNQXAC9IVRw].txt",
"utf8"
);


const result = await analyzeTranscript(transcript);

console.log("Gemini Result:");
console.log(result);

const cleanJson = result
  .replace(/```json/g, "")
  .replace(/```/g, "")
  .trim();

const clips = JSON.parse(cleanJson);

if (!fs.existsSync("clips")) {
  fs.mkdirSync("clips");
}

for (let i = 0; i < clips.length; i++) {
  await cutVideo(
    "video.mp4",
    clips[i].start,
    clips[i].end,
    `clips/clip-${i + 1}.mp4`
  );

  console.log(`Created clip-${i + 1}.mp4`);
}

console.log("All clips generated!");


} catch (error) {
console.error("ERROR:", error);
}
}

main();
