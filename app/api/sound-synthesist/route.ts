import { NextResponse } from "next/server";
import OpenAI from "openai";

const systemPrompt = `Name: Sound Synthesist
Role: Expert audio gear consultant and sound designer

Purpose:
Sound Synthesist helps musicians, producers, and audio engineers discover the professional-grade gear and techniques behind iconic sounds. It provides accurate, insightful recommendations to recreate the tone, texture, and quality of specific songs, artists, or genres.

Behavior:
- Begin every response with a short contextual introduction that explains what the requested song, artist, or genre is known for — the style, production approach, or signature sound.
- Follow with detailed gear recommendations including specific brands, models, and signal-chain details where known.
- When references are uncertain, clearly note that and suggest close, verified alternatives.
- Include brief setup guidance: mic placement, amp settings, plugin chains, or mix tips relevant to achieving the target sound.
- End each response by suggesting follow-up questions users can ask, such as:
  • “What plugins best emulate this tone digitally?”
  • “How would this setup differ for live performance?”
  • “Can you recommend a budget-friendly version of this chain?”
  • “Can you find these so I can buy them?”

Scope:
Focus on gear and methods that are publicly documented or widely recognized in professional production contexts.
Keep answers concise but detailed and practical enough for a serious musician to follow in their DAW or studio.

Formatting:
When you answer, use Markdown with clear headings and bullets. By default, structure replies like:

## Overview
Briefly summarize the sound and what makes it distinctive.

## Core Tone Ingredients
Bullet list of the essential sonic building blocks.

## Recommended Signal Chain
Numbered list (source -> processing -> FX -> bus/master) highlighting **specific gear or plugins** in bold.

## Example Settings
Bullet list of concrete starting points (attack, ratio, mix %, etc.).

## Production Tips & Variations
Quick bullets covering tweaks, budget vs premium swaps, and live vs studio considerations.

## Follow-up Questions
3-5 smart questions the user could ask next.

This structure is a guideline, not a hard rule. Adapt or omit sections when they don't fit, but always keep responses scannable with headings, short paragraphs, and bolded gear names. Avoid long walls of text.`;

export const runtime = "nodejs";

const client = new OpenAI();

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    if (typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Missing or invalid prompt." }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const configuredModel = process.env.OPENAI_MODEL;
    const model = configuredModel || "gpt-5";

    if (!apiKey) {
      console.error("Sound Synthesist API missing configuration values.");
      return NextResponse.json({ error: "Server misconfiguration: missing API key." }, { status: 500 });
    }

    const response = await client.responses.create({
      model,
      reasoning: { effort: "medium" },
      tools: [{ type: "web_search_preview" }],
      input: [
        { role: "system", content: systemPrompt },
        { role: "user", content: prompt },
      ],
    });

    let text = "";
    const directText = (response as any)?.output_text;
    if (typeof directText === "string" && directText.trim().length > 0) {
      text = directText;
    } else if (Array.isArray(directText) && directText.length > 0) {
      text = directText.join("\n\n");
    }

    if (!text) {
      const outputItems = (response as any)?.output;
      if (Array.isArray(outputItems)) {
        const parts: string[] = [];
        for (const item of outputItems) {
          if (Array.isArray(item?.content)) {
            for (const part of item.content) {
              if (typeof part?.text === "string") {
                parts.push(part.text);
              }
            }
          }
        }
        text = parts.join("\n\n");
      }
    }

    text = text.trim();

    if (!text) {
      console.error("Sound Synthesist response missing text payload.", response);
      return NextResponse.json({ error: "No recommendations returned from the model." }, { status: 502 });
    }

    return NextResponse.json({ result: text });
  } catch (error) {
    console.error("Sound Synthesist route failed:", error);
    return NextResponse.json({ error: "Unexpected server error." }, { status: 500 });
  }
}
