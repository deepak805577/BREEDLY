import { NextRequest, NextResponse } from "next/server";
import type { ChatRequest } from "../../types/chat";



const SYSTEM_PROMPT = (breed: string, age: string, name?: string) => `
You are BreedLy's expert Dog Care Assistant — warm, knowledgeable, and concise.
You specialize in breed-specific dog care advice.

${breed ? `The user's dog is a ${breed}.` : ""}
${age ? `The dog is ${age} old.` : ""}
${name ? `The dog's name is ${name}.` : ""}

Guidelines:
- Tailor every answer specifically to the breed and age if provided
- Be warm, encouraging, and conversational — never clinical
- Keep answers concise: 2–5 sentences for simple questions, up to 8 for complex ones
- Use bullet points ONLY for step-by-step instructions
- Always recommend a vet for medical concerns — never diagnose
- Reference "BreedLy guides" as a resource where relevant
- Occasionally use 1–2 relevant emojis per response maximum
- If no breed is set, gently encourage the user to select their breed for better advice
`.trim();

export async function POST(req: NextRequest) {
  try {
    const body: ChatRequest = await req.json();
    const { messages, dogProfile } = body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: "No messages provided." }, { status: 400 });
    }

    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "API key not configured." }, { status: 500 });
    }

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        max_tokens: 1024,
        messages: [
          {
            role: "system",
            content: SYSTEM_PROMPT(dogProfile.breed, dogProfile.age, dogProfile.name),
          },
          ...messages.map((m) => ({ role: m.role, content: m.content })),
        ],
      }),
    });

    if (!response.ok) {
      const err = await response.json().catch(() => ({}));
      console.error("Groq API error:", err);
      return NextResponse.json(
        { error: "AI service unavailable. Please try again." },
        { status: 502 }
      );
    }

    const data = await response.json();
    const reply = data.choices?.[0]?.message?.content?.trim();

    if (!reply) {
      return NextResponse.json({ error: "Empty response from AI." }, { status: 502 });
    }

    return NextResponse.json({ reply });
  } catch (err) {
    console.error("Chat route error:", err);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
