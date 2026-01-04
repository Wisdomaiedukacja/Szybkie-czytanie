
import { GoogleGenAI, Type } from "@google/genai";
import { ReadingTestContent } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateReadingTest = async (age: number = 25, topic?: string): Promise<ReadingTestContent> => {
  const prompt = `Wygeneruj fascynujący tekst do szybkiego czytania w języku polskim. 
  Dostosuj słownictwo i stopień skomplikowania do osoby w wieku ${age} lat.
  Długość tekstu: około 500 słów.
  Temat: ${topic || 'nauka, technologia lub historia'}.
  Dodaj 10 pytań testowych sprawdzających zrozumienie tekstu (każde z 4 opcjami wyboru).`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          text: { type: Type.STRING, description: "Tekst do czytania (ok 500 słów)" },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                question: { type: Type.STRING },
                options: { 
                  type: Type.ARRAY, 
                  items: { type: Type.STRING },
                  minItems: 4,
                  maxItems: 4
                },
                correctAnswer: { type: Type.INTEGER, description: "Index poprawnej odpowiedzi (0-3)" }
              },
              required: ["question", "options", "correctAnswer"]
            }
          }
        },
        required: ["text", "questions"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateExerciseText = async (age: number, length: 'krótki' | 'średni' | 'długi'): Promise<string> => {
  const wordCounts = {
    'krótki': 150,
    'średni': 350,
    'długi': 600
  };
  
  const prompt = `Wygeneruj ciekawy tekst do ćwiczeń szybkiego czytania w języku polskim dla osoby w wieku ${age} lat. 
  Długość: około ${wordCounts[length]} słów. 
  Temat: samorozwój, ciekawostki ze świata lub nauka. Zwróć tylko czysty tekst.`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt
  });

  return response.text;
};
