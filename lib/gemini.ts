import { GoogleGenerativeAI } from "@google/generative-ai";

export async function analyzeTranscript(
  transcript: string
) {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("GEMINI_API_KEY missing");
  }

  const genAI = new GoogleGenerativeAI(apiKey);

  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash",
  });

  const prompt = `
You are an expert viral content editor.

Analyze this transcript and find the 5 most viral clips.

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
${transcript.slice(0, 1000)}
`;

  for (let attempt = 1; attempt <= 5; attempt++) {
    try {
      const result = await model.generateContent(prompt);

      return result.response.text();
    } catch (error: any) {
      console.log(`Attempt ${attempt}/5 failed`);

      if (attempt === 5) {
        throw error;
      }

      await new Promise((resolve) =>
        setTimeout(resolve, 3000)
      );
    }
  }

  throw new Error("Failed after 5 retries");
}