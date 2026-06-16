import { NextResponse } from "next/server";

const MODELS = [
  "gemini-2.5-flash",
  "gemini-2.0-flash-lite",
  "gemini-2.0-flash-001",
  "gemini-2.5-flash-lite",
  "gemini-flash-latest",
];

async function callGemini(model: string, prompt: string) {
  const response = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${process.env.GEMINI_API_KEY}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );
  const data = await response.json();
  if (data.error?.code === 429 || data.error?.code === 404) {
    throw new Error(data.error.message);
  }
  return data.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
}

export async function POST(req: Request) {
  try {
    const { code, language, action } = await req.json();

    const prompts: Record<string, string> = {
      explain: `Explain this ${language} code clearly and concisely:\n\n${code}`,
      debug: `Find and fix bugs in this ${language} code. Show the fixed code and explain what was wrong:\n\n${code}`,
      optimize: `Optimize this ${language} code for better performance and readability. Show the optimized code and explain changes:\n\n${code}`,
    };

    let result = "";
    for (const model of MODELS) {
      try {
        result = await callGemini(model, prompts[action]);
        break;
      } catch {
        console.log(`Model ${model} failed, trying next...`);
        continue;
      }
    }

    if (!result) {
      return NextResponse.json({ error: "All models quota exceeded. Try again later." }, { status: 429 });
    }

    return NextResponse.json({ result });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}