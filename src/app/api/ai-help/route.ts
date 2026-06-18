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
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      status: response.status,
      error: data.error?.message || "Unknown Gemini Error",
    };
  }

  return {
    success: true,
    result:
      data.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No response generated",
  };
}

export async function POST(req: Request) {
  try {
    const { code, language, action } = await req.json();

    const prompts: Record<string, string> = {
      explain: `Explain this ${language} code clearly and concisely:\n\n${code}`,

      debug: `Find and fix bugs in this ${language} code. Show the fixed code and explain what was wrong:\n\n${code}`,

      optimize: `Optimize this ${language} code for better performance and readability. Show the optimized code and explain changes:\n\n${code}`,
    };

    let lastError = "Unknown error";

    for (const model of MODELS) {
      const result = await callGemini(model, prompts[action]);

      if (result.success) {
        return NextResponse.json({
          success: true,
          result: result.result,
        });
      }

      lastError = result.error;

      console.log(
        `Model ${model} failed (${result.status}): ${result.error}`
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: lastError,
      },
      { status: 429 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: "Internal Server Error",
      },
      { status: 500 }
    );
  }
}

