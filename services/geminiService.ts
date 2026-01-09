
import { GoogleGenAI, Type } from "@google/genai";
import { UserInput, SolarResult, AIAdvice } from "../types";

// Fix: Implemented the service with standard Gemini API configuration and proper JSON schema enforcement
export const getSolarAdvice = async (input: UserInput, results: SolarResult): Promise<AIAdvice> => {
  // Always initialize with apiKey in a named parameter
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const prompt = `
    Based on the following solar system calculation for a home in ${input.location || 'Kenya'}:
    - Monthly Bill: KES ${input.monthlyBill}
    - Calculated System Size: ${results.systemSizeKw} kW
    - Recommended Panels: ${results.panelCount}
    - Estimated Payback: ${results.paybackYears} years
    - Annual Production: ${results.annualProductionKwh} kWh
    
    Provide expert advice on:
    1. A concise summary of the feasibility in the Kenyan context.
    2. Recommended panel types (e.g., Monocrystalline vs Polycrystalline) for this specific scenario.
    3. 3-4 specific maintenance tips relevant to local conditions (dust, rain, etc.).
    4. Financial insights including typical local incentives in Kenya or ROI strategies (e.g., VAT exemptions, Net Metering if applicable).
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            summary: { type: Type.STRING },
            panelTypeRecommendation: { type: Type.STRING },
            maintenanceTips: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            financialInsights: { type: Type.STRING }
          },
          propertyOrdering: ["summary", "panelTypeRecommendation", "maintenanceTips", "financialInsights"]
        }
      }
    });

    // Fix: Access response.text as a property, not a method call
    const text = response.text;
    if (!text) {
      throw new Error("The AI model returned an empty response.");
    }
    
    return JSON.parse(text.trim()) as AIAdvice;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
