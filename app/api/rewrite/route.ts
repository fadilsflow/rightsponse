import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const languageMap = {
  en: "English",
  id: "Indonesian",
  ms: "Malay",
  zh: "Chinese",
  ja: "Japanese",
  ko: "Korean",
  es: "Spanish",
  fr: "French",
  de: "German",
  it: "Italian",
  pt: "Portuguese",
  ru: "Russian",
  ar: "Arabic",
  hi: "Hindi",
  th: "Thai",
  vi: "Vietnamese",
};

export async function POST(req: Request) {
  try {
    const { text, tone, language, type, comment } = await req.json();

    const targetLanguage =
      languageMap[language as keyof typeof languageMap] || "English";
    let prompt = "";

    switch (type) {
      case "email":
        prompt = `Write a professional email in ${targetLanguage} with ${tone} tone. Include a clear subject line.

Important: The ENTIRE email (including subject, greetings, and closing) MUST be in ${targetLanguage}. Keep it natural and culturally appropriate.

Content to convert:
${text}`;
        break;

      case "comment":
        prompt = `Write a brief ${tone} response in ${targetLanguage}. Be concise and maintain context:

Comment: ${comment}
Your message: ${text}`;
        break;

      default:
        prompt = `Improve this message in ${targetLanguage} with a ${tone} tone. Be concise and clear:

${text}`;
    }

    const response = await ai.models.generateContent({
      model: "gemini-1.5-flash",
      contents: prompt,
      config: {
        temperature: 0.7,
        maxOutputTokens: 250,
      },
    });

    const rewrittenText = response.text;

    return NextResponse.json({ result: rewrittenText });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      { error: "Failed to process the request" },
      { status: 500 }
    );
  }
}
