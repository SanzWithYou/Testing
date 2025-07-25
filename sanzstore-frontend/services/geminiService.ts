
import { GoogleGenAI } from "@google/genai";

// Ensure you have the API key in your environment variables
const apiKey = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (apiKey) {
    ai = new GoogleGenAI({ apiKey });
} else {
    console.warn("Gemini API key not found. AI features will be disabled.");
}

export const generateDescription = async (gameTitle: string): Promise<string> => {
    if (!ai) {
        return "AI service is unavailable. Please configure the API key.";
    }

    const prompt = `Create a compelling and brief marketplace description for a digital game account for the game "${gameTitle}". 
    Highlight key selling points that a buyer would look for. Make it sound exciting and valuable. 
    Do not mention specific ranks, items or characters unless they are iconic to the game (like 'Renegade Raider' for Fortnite).
    Keep it under 60 words.
    Example for 'Valorant': "Unlock your potential with this high-tier Valorant account! Packed with premium content and ready for competitive play. Dominate the server and climb the ranks in style. A must-have for any serious FPS enthusiast!"
    `;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.7,
                topP: 1.0,
                thinkingConfig: {
                    thinkingBudget: 0 // For faster response
                }
            },
        });
        
        return response.text.trim();

    } catch (error) {
        console.error("Error generating description with Gemini:", error);
        return "Failed to generate AI description. Please try again later.";
    }
};