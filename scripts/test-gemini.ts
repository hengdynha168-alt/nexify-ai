import dotenv from "dotenv";
dotenv.config();

import fs from "fs";
import { analyzeTranscript } from "../lib/gemini";

async function main() {
  const transcript = fs.readFileSync(
    "Me at the zoo [jNQXAC9IVRw].txt",
    "utf8"
  );

  const result = await analyzeTranscript(transcript);

  console.log(result);
}

main();