import { GoogleGenerativeAI } from "@google/generative-ai";


// For this one, i gonna create a class that will handle interactions with the Google Generative AI API

export class Gemini_Client{
    private client: GoogleGenerativeAI;

    constructor(){
        const apiKey = process.env.GEMINI_API_KEY;
        if(apiKey){
            this.client = new GoogleGenerativeAI(apiKey);
        }
        else{
            throw new Error("API key is required");
        }
    }

    async generateContent(prompt_in: string, model_in: string = "gemini-1.5-pro") {
        try{
            const get_model = this.client.getGenerativeModel({model: model_in});
            const chat_session = get_model.startChat({
                generationConfig: {
                    temperature: 1,
                    topP: 0.95,
                    topK: 64,
                    maxOutputTokens: 8192,
                    responseMimeType: "text/plain",
                },
                history: [
                ]
            });
            const response = await chat_session.sendMessage(prompt_in);
            return response.response.text();
        } catch (error) {
            console.error("Error generating content from Gemini_Client:", error);
            return null;
        }
    }
}
