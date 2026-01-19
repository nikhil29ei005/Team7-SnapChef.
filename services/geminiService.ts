
import { GoogleGenAI, Type } from "@google/genai";
import { SnapChefResult } from "../types";

export const analyzeFoodImage = async (base64Image: string): Promise<SnapChefResult> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || "" });
  
  // Use gemini-3-flash-preview for high speed and good vision capabilities
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: [
      {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg",
              data: base64Image.split(',')[1] || base64Image
            }
          },
          {
            text: "Identify these ingredients, estimate the calories/protein, and suggest a creative recipe to cook with them. Return the result in a structured JSON format."
          }
        ]
      }
    ],
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          identifiedIngredients: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "List of ingredients identified in the image"
          },
          nutritionalEstimate: {
            type: Type.STRING,
            description: "A summary of estimated calories and protein"
          },
          suggestedRecipe: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              ingredients: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              instructions: {
                type: Type.ARRAY,
                items: { type: Type.STRING }
              },
              macros: {
                type: Type.OBJECT,
                properties: {
                  calories: { type: Type.STRING },
                  protein: { type: Type.STRING },
                  fat: { type: Type.STRING },
                  carbs: { type: Type.STRING }
                }
              }
            },
            required: ["title", "description", "ingredients", "instructions", "macros"]
          }
        },
        required: ["identifiedIngredients", "nutritionalEstimate", "suggestedRecipe"]
      }
    }
  });

  const text = response.text;
  if (!text) throw new Error("No response from AI");
  
  return JSON.parse(text) as SnapChefResult;
};
