import { analyzeTranscript } from "@/lib/gemini";
import { downloadVideo } from "@/lib/downloadVideo";
import { transcribe } from "@/lib/transcribe";
import { cutVideo } from "@/lib/cutVideo";
import fs from "fs";

export async function POST(req: Request) {
try {
const { url } = await req.json();


if (!url) {
  return Response.json({
    success: false,
    error: "Please enter a YouTube URL",
  });
}

console.log("1. Downloading video...");
const videoFile = await downloadVideo(url);

console.log("2. Transcribing...");
const transcript = await transcribe(videoFile);

console.log("3. Gemini analyzing...");
const result = await analyzeTranscript(transcript);

console.log("Gemini Result:");
console.log(result);

const clips = JSON.parse(
  result
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim()
);

console.log("Parsed Clips:");
console.log(clips);

if (!fs.existsSync("public/clips")) {
  fs.mkdirSync("public/clips", { recursive: true });
}

console.log("4. Cutting clips...");

for (let i = 0; i < clips.length; i++) {
  console.log(`Cutting clip ${i + 1}`);

  await cutVideo(
    videoFile,
    clips[i].start,
    clips[i].end,
    `public/clips/clip-${i + 1}.mp4`
  );

  clips[i].video =
    `/clips/clip-${i + 1}.mp4`;

  console.log(`Created clip ${i + 1}`);
}

console.log("Done!");

return Response.json({
  success: true,
  result: clips,
});


} catch (error: any) {
console.error(error);


return Response.json({
  success: false,
  error:
    error?.message ||
    "Something went wrong",
});


}
}
