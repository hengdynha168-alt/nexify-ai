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

    let transcriptText = "";

    try {
      const transcript =
        await YoutubeTranscript.fetchTranscript(url);

      transcriptText = transcript
        .map((item) => item.text)
        .join(" ");

      console.log(
        "Transcript Length:",
        transcriptText.length
      );
    } catch (error) {
      return Response.json({
        success: false,
        error:
          "This video does not have a public transcript. Try another YouTube video.",
      });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const prompt = `
You are an expert viral content editor.

Analyze this transcript and find the 10 most viral clips.

For each clip return:

- title
- start
- end
- score (1-100)
- reason
- emotion
- hook

Return ONLY valid JSON.

[
  {
    "title": "How Fire Changed Humanity",
    "start": "00:47",
    "end": "02:07",
    "score": 96,
    "reason": "Strong curiosity gap and storytelling",
    "emotion": "Surprise",
    "hook": "What if humans never discovered fire?"
  }
]

Transcript:
${transcriptText}
`;

    const result =
      await model.generateContent(prompt);

    const text = result.response.text();

    return Response.json({
      success: true,
      result: text,
    });
  } catch (error: any) {
    console.error(error);

    return Response.json({
      success: false,
      error:
        error?.message || "Something went wrong",
    });
  }
}