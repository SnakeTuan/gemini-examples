import { NextRequest, NextResponse } from "next/server";
import { Gemini_Client } from "@/lib/gemini";

export async function POST(request: NextRequest) {
    try{
        // Get the prompt from the request body
        const { prompt } = await request.json();

        // Create a new Gemini_Client instance
        const gemini = new Gemini_Client();

        // Generate a response using Gemini
        const response = await gemini.generateContent(prompt);

        return NextResponse.json({ response });
    } catch (error: any) {
        console.error(error);
        return NextResponse.json({ error: "Error generating text" }, { status: 500 });
    }
}
