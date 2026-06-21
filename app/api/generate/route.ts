import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    const transcript = await YoutubeTranscript.fetchTranscript(
      url
    );

    const transcriptText = transcript
      .map((item) => item.text)
      .join(" ");

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Analyze this YouTube transcript.

Find the 5 most viral clips for TikTok, Reels, Shorts.

For each clip provide:

- title
- start
- end
- score (0-100)

Return ONLY valid JSON.

Example:

[
  {
    "title": "Skills Make You Rich",
    "start": "00:47",
    "end": "01:40",
    "score": 96
  }
]

Transcript:

${transcriptText}
`;

    const result = await model.generateContent(
      prompt
    );

    const text = result.response.text();

    return Response.json({
      result: text,
    });
  } catch (error: any) {
    console.error(error);

    return Response.json({
      error: error.message,
    });
  }
}