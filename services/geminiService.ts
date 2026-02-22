
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function generateTeamNames(count: number): Promise<string[]> {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Generate ${count} creative, professional, and friendly team names for corporate workshop grouping. Return only a JSON array of strings.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    });

    const json = JSON.parse(response.text.trim());
    return json;
  } catch (error) {
    console.error("Error generating team names:", error);
    // Fallback names
    return Array.from({ length: count }, (_, i) => `Team ${i + 1}`);
  }
}
