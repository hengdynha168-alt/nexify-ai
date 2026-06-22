import { GoogleGenerativeAI } from "@google/generative-ai";
import { YoutubeTranscript } from "youtube-transcript";

const genAI = new GoogleGenerativeAI(
  process.env.GEMINI_API_KEY!
);

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    if (!url) {
      return Response.json({
        success: false,
        error: "Please enter a YouTube URL",
      });
    }

    console.log("URL:", url);

    let transcript;

    try {
      transcript =
        await YoutubeTranscript.fetchTranscript(url);
    } catch (err) {
      console.error("Transcript Error:", err);

      return Response.json({
        success: false,
        error:
          "This video does not have a public transcript. Try another YouTube video.",
      });
    }

    const transcriptText = transcript
      .map((item) => item.text)
      .join(" ");

    console.log(
      "Transcript Length:",
      transcriptText.length
    );

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
Analyze this YouTube transcript.

Find the 5 most viral clips for:
- TikTok
- Instagram Reels
- YouTube Shorts

Return ONLY valid JSON.

[
  {
    "title": "Clip title",
    "start": "00:00",
    "end": "00:30",
    "score": 95
  }
]

Transcript:
${transcriptText}
`;

    const result =
      await model.generateContent(prompt);

    const text = result.response.text();

    console.log("Gemini Response:", text);

    return Response.json({
      success: true,
      result: text,
    });
  } catch (error: any) {
    console.error("FULL ERROR:", error);

    return Response.json({
      success: false,
      error:
        error?.message ||
        "Something went wrong",
    });
  }
}