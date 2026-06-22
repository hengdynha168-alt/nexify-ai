import { cutVideo } from "../lib/cutVideo";

async function main() {
  await cutVideo(
    "video.mp4",
    "00:00:04",
    "00:00:14",
    "clip1.mp4"
  );

  console.log("Clip created!");
}

main();