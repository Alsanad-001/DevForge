import { NextResponse } from "next/server";

// 1. This GET handler allows you to test the URL directly in your browser address bar!
export async function GET() {
  return NextResponse.json({ 
    status: "online", 
    message: "JDoodle execution proxy route is working perfectly. Use a POST request to run code." 
  });
}

// 2. This POST handler runs your code when you click the "Run Code" button
export async function POST(req: Request) {
  try {
    const { script, language } = await req.json();

    const languageMap: Record<string, { lang: string; version: string }> = {
      javascript: { lang: "nodejs", version: "4" },
      python: { lang: "python3", version: "4" },
      java: { lang: "java", version: "4" },
      c: { lang: "c", version: "5" },
      cpp: { lang: "cpp", version: "5" },
      go: { lang: "go", version: "4" },
    };

    const mapped = languageMap[language] || { lang: "nodejs", version: "4" };

    const response = await fetch("https://api.jdoodle.com/v1/execute", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        clientId: process.env.JDOODLE_CLIENT_ID,
        clientSecret: process.env.JDOODLE_CLIENT_SECRET,
        script,
        language: mapped.lang,
        versionIndex: mapped.version,
      }),
    });

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}