import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRaceCommentary = async (event: string, score: number): Promise<string> => {
  try {
    const model = 'gemini-2.5-flash';
    
    let prompt = `You are a hype cyberpunk race announcer for a futuristic motorcycle game "Neon Rider". 
    Keep it short, intense, and energetic (max 15 words). 
    The current event is: ${event}. 
    The current score is: ${score}.`;

    if (event === "Crash/Game Over") {
        prompt += " Roast the player slightly for crashing but encourage them to try again.";
    } else if (event === "Milestone Reached") {
        prompt += " Congratulate them on the high speed and reflexes.";
    } else if (event === "Race Start") {
        prompt += " Hype up the start of the run.";
    }

    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
    });

    return response.text || "System Malfunction...";
  } catch (error) {
    console.error("AI Error", error);
    return "Commentary Uplink Failed.";
  }
};