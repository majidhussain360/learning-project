import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest){
        try {
            const {query} = await request.json();
            const apiKey = process.env.TAVILY_API_KEY;
            console.log(apiKey)
            if(!apiKey){
                return NextResponse.json({message: "Tavily API key is missing"}, {status: 500});
            }
            const tavilyres = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({ query })
        });
        const data = await tavilyres.json();
        console.log(data)
        if (!tavilyres.ok) {
            return NextResponse.json({ message: data.message || "Tavily API error" }, { status: 500 });
        }
        return NextResponse.json({ results: data.results });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}