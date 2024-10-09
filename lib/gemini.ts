import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios';
import * as fs from 'fs';

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

    // this one should be good for one-off content generation tasks where each prompt is independent of previous interactions
    async generateQuickConversation(prompt_in: string, model_in: string = "gemini-1.5-pro") {
        try{
            const get_model = this.client.getGenerativeModel({model: model_in});
            const response = await get_model.generateContent(prompt_in);
            return response.response.text();
        } catch (error) {
            console.error("Error generating content from Gemini_Client:", error);
            return null;
        }
    }

    // this one is more customizable, you can tweak the generationConfig to your liking
    // you can tweak it to make a multi-turn chat, just ask in a session
    // this can be used when you want the response to have a built pattern before, like a story, or a poem, or a song, etc.
    // in this example, if you change the prompt to "Generate for me a new English word in the {subject}, with the subject, the meaning, and a funny example sentence, all in JSON format"
    // you can still make it generate a new word with the same Json format
    async generateInteractiveConversation(prompt_in: string, model_in: string = "gemini-1.5-pro") {
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
                    {
                      role: "user",
                      parts: [
                        {text: "Generate for me a new English word in the cooking field, with the subject, the meaning, and a funny example sentence, all in JSON format"},
                      ],
                    },
                    {
                      role: "model",
                      parts: [
                        {text: "```json\n{\n  \"word\": \"Glazescapade\",\n  \"subject\": \"Cooking\",\n  \"meaning\": \"A disastrous or comical mishap that occurs while glazing food, often resulting in an uneven, sticky, or otherwise undesirable outcome.\",\n  \"example\": \"My attempt to make a picture-perfect glazed ham turned into a complete glazescapade when I accidentally knocked over the honey jar and ended up with a sticky, bee-attracting mess.\"\n}\n```"},
                      ],
                    },
                  ],
            });
            const response = await chat_session.sendMessage(prompt_in);
            return response.response.text();
        } catch (error) {
            console.error("Error generating content from Gemini_Client:", error);
            return null;
        }
    }

    // New method for multimodal content generation
    async generateContentWithImage(prompt: string, imagePart: { inlineData: { data: string; mimeType: string } }, model_in: string = "gemini-1.5-flash") {
        try {
            const get_model = this.client.getGenerativeModel({model: model_in});
            const response = await get_model.generateContent([prompt, imagePart]);
            return response.response.text();
        } catch (error) {
            console.error("Error generating content with image:", error);
            return null;
        }
    }
}
