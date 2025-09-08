import { NextRequest, NextResponse } from "next/server";
import { load } from "cheerio";

// Example: Scrape BBC News headlines as a placeholder for LPA planning applications
async function fetchPlanningApplications(siteAddress: string, radius: number) {
    const searchUrl = `https://www.bbc.com/news`;

    const res = await fetch(searchUrl, {
        method: "GET",
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    });
    const html = await res.text();

    const $ = load(html);

    // Extract headlines as "applications"
    const applications: any[] = [];
    $("a.gs-c-promo-heading").each((i, el) => {
        const description = $(el).text().trim();
        const date = ""; // Not available
        const outcome = ""; // Not available
        const officer_report = ""; // Not available
        const location = "BBC News"; // Placeholder

        applications.push({
            description,
            date,
            outcome,
            officer_report,
            location
        });
    });

    return applications;
}

// Helper: Get OpenAI embedding for a text
async function getEmbedding(text: string) {
    const res = await fetch("https://api.openai.com/v1/embeddings", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "text-embedding-3-small",
            input: text
        })
    });
    const data = await res.json();
    if (!data.data || !data.data[0]) {
        console.error("OpenAI embedding error:", data);
        return [];
    }
    return data.data[0].embedding;
}

// Helper: Cosine similarity
function cosineSimilarity(a: number[], b: number[]) {
    const dot = a.reduce((sum, ai, i) => sum + ai * b[i], 0);
    const magA = Math.sqrt(a.reduce((sum, ai) => sum + ai * ai, 0));
    const magB = Math.sqrt(b.reduce((sum, bi) => sum + bi * bi, 0));
    return dot / (magA * magB);
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { siteAddress, userGoal, radius = 200 } = body;

        // Scrape "applications" (BBC headlines as placeholder)
        const applications = await fetchPlanningApplications(siteAddress, radius);

        console.log("Applications:", applications);

        // Embed user goal
        const userEmbedding = await getEmbedding(userGoal);

        console.log("User embedding:", userEmbedding);

        // Embed each application and score by similarity
        const scoredApps = [];
        for (const app of applications) {
            const appEmbedding = await getEmbedding(app.description + " " + (app.officer_report || ""));
            const score = cosineSimilarity(userEmbedding, appEmbedding);
            scoredApps.push({ ...app, score });
        }

        // Sort and select top 3–5
        scoredApps.sort((a, b) => b.score - a.score);
        const topResults = scoredApps.slice(0, 5);

        return NextResponse.json({ results: topResults });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}