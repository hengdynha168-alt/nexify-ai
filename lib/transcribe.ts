import { exec } from "child_process";
import fs from "fs";

export function transcribe(input: string) {
return new Promise<string>((resolve, reject) => {
const cmd = `python -m whisper "${input}" --model base`;


exec(cmd, (error) => {
  if (error) {
    reject(error);
    return;
  }

  const txtFile = input.replace(
    /\.(webm|mp4|mkv)$/i,
    ".txt"
  );

  if (!fs.existsSync(txtFile)) {
    reject(
      new Error(
        `Transcript file not found: ${txtFile}`
      )
    );
    return;
  }

  const transcript = fs.readFileSync(
    txtFile,
    "utf8"
  );

  resolve(transcript);
});


});
}
