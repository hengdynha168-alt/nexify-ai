import { exec } from "child_process";

export function cutVideo(
input: string,
start: string,
end: string,
output: string
) {
return new Promise<string>(
(resolve, reject) => {
const cmd = `ffmpeg -y \
-i "${input}" \
-ss ${start} \
-to ${end} \
-vf "scale=1080:1920:force_original_aspect_ratio=increase,crop=1080:1920" \
-c:v libx264 \
-preset fast \
-crf 23 \
-c:a aac \
-b:a 128k \
"${output}"`;


  exec(
    cmd.replace(/\n/g, " "),
    (error) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(output);
    }
  );
}


);
}
