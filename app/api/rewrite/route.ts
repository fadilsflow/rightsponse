import { GoogleGenAI } from "@google/genai";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

const languageMap = {
  en: "English",
  id: "Indonesian",
};

// System instructions for different types of content
const systemInstructions = {
  message:
    "You are a writing assistant. Provide ONE direct rewrite of the text. Do not provide multiple options or explanations. Just rewrite the text once in the requested style.",
  email:
    "You are an email expert. Provide ONE direct email format. Do not provide multiple options or explanations. Format the email once with subject, greeting, and closing.",
  comment:
    "You are a response expert. Provide ONE direct response. Do not provide multiple options or explanations. Just write one clear response.",
};

// Maximum output length constraints
const MAX_OUTPUT_TOKENS = 250; // batas maksimal jumlah token yang akan dihasilkan model.
const TEMPERATURE = 0.3; // mengontrol kreativitas output AI

export async function POST(req: Request) { // Handler untuk menangani permintaan POST dari klien
  try {
    const { text, tone, language, type, comment } = await req.json();

    if (!text?.trim()) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    // Menentukan target bahasa
    const targetLanguage =
      languageMap[language as keyof typeof languageMap] || "English";

    // Build prompt based on content type
    const prompt = buildPrompt(type, targetLanguage, tone, text, comment);

    const response = await ai.models.generateContent({ // Memanggil model AI Gemini
      model: "gemini-2.0-flash",
      contents: prompt,
      config: {
        temperature: TEMPERATURE,
        maxOutputTokens: MAX_OUTPUT_TOKENS,
        systemInstruction:
          systemInstructions[type as keyof typeof systemInstructions],
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

function buildPrompt(
  type: string,
  language: string,
  tone: string,
  text: string,
  comment?: string
): string {
  const prompts = {
    email: `
          Rewrite this content as ONE professional email in ${language} with a ${tone} tone.
          IMPORTANT: 
          - Provide only ONE version
          - Do not explain or give options
          - Include subject, greeting, and closing
          - Keep it concise and culturally appropriate for ${language}

          Content to rewrite:
          ${text}`,   

    comment: `
          Write ONE ${tone} response in ${language}.
          IMPORTANT:
          - Provide only ONE direct response
          - Do not explain or give options
          - Maximum 2-3 sentences
          - Keep it contextual and appropriate

          Original Comment: ${comment}
          Your message: ${text}`,

    message: `
          Rewrite this message ONCE in ${language} with a ${tone} tone.
          IMPORTANT:
          - Provide only ONE rewritten version
          - Do not explain or give options
          - Keep the core message intact
          - Be concise and clear

          Message to rewrite:
${text}`,
  };

  return prompts[type as keyof typeof prompts] || prompts.message;
}
