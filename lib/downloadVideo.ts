import { exec } from "child_process";

export function downloadVideo(url: string) {
return new Promise<string>((resolve, reject) => {
const cmd =
`yt-dlp -f "bv*+ba/b" --merge-output-format mp4 "${url}" -o "video.%(ext)s"`;


console.log(cmd);

exec(cmd, (error) => {
  if (error) {
    reject(error);
    return;
  }

  resolve("video.mp4");
});


});
}
