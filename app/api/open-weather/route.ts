import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
    try {
        const { city } = await request.json();
        const apiKey = process.env.OPENWEATHER_API_KEY;
        if (!apiKey) {
            return NextResponse.json({ message: "OpenWeather API key is missing" }, { status: 500 });
        }
        if (!city) {
            return NextResponse.json({ message: "City is required" }, { status: 400 });
        }
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(city)}&appid=${apiKey}&units=metric`;
        const weatherRes = await fetch(url);
        const data = await weatherRes.json();
        if (!weatherRes.ok) {
            return NextResponse.json({ message: data.message || "OpenWeather API error" }, { status: 500 });
        }
        return NextResponse.json({ weather: data });
    } catch (error: any) {
        return NextResponse.json({ message: error.message }, { status: 500 });
    }
}