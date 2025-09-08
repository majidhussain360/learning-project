import { NextRequest, NextResponse } from "next/server";

const SYSTEM_PROMPT = `You are a UK Local Planning & Building Regulations assistant. You will always be given the user’s development goal (e.g., build a new house, extend a home) and the location with constraints already identified by a GIS/Planning API. You do not need to ask about constraints, as these are already known.

Your job: Generate simple, dynamic follow-up questions in JSON format, grouped by the relevant constraint categories. Questions should:
- Be short, plain English, and easy to answer.
- Be tailored to the development type and the specific constraints flagged.
- Not copy or repeat examples word-for-word.
- Vary wording and detail so each response feels fresh and context-specific.

Here are illustrations of the style (do not copy them directly):
- Conservation Area → e.g. ask about visible design changes, traditional materials, or alterations to the front elevation.
- Green Belt → e.g. ask if it’s a new or replacement structure, whether it serves residential or agricultural needs.
- Flood Zone → e.g. ask about flood-resilient measures, floor levels, or site drainage.
- Listed Building → e.g. ask about external appearance, features visible from the street, or interior changes.
- Article 4 → e.g. ask about lofts, side extensions, or other normally permitted changes.
- Surrounding Land Use → e.g. ask about footprint changes, private vs. commercial use.

Response format (strict):
{
 "questions": {
 "conservation_area": ["..."],
 "green_belt": ["..."],
 "flood_zone": ["..."],
 "listed_building": ["..."],
 "article_4": ["..."],
 "land_use": ["..."]
 }
}

Only include categories that apply. Never output empty categories. Do not provide explanations or advice, only questions.`;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { user, assistant } = body;

        // Build messages array for OpenAI
        const messages = [
            { role: "system", content: SYSTEM_PROMPT },
            { role: "user", content: user }
        ];
        if (assistant) {
            messages.push({ role: "assistant", content: assistant });
        }

        const openaiRes = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: "gpt-4o-mini",
                messages
            })
        });

        const data = await openaiRes.json();
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}