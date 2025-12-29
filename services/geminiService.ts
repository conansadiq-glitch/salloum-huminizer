
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult } from "../types";

// Initialize the API with the provided key from environment
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

// استخدام النسخة الأحدث والمستقرة من Flash لضمان عدم حدوث خطأ 404
const MODEL_NAME = 'gemini-flash-latest';

const ANALYSIS_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    humanScore: { type: Type.NUMBER, description: "Likelihood of text being human-written (0-100)" },
    aiScore: { type: Type.NUMBER, description: "Likelihood of text being AI-written (0-100)" },
    readability: { type: Type.STRING, description: "Detailed readability level" },
    reasons: { type: Type.ARRAY, items: { type: Type.STRING }, description: "Evidence of AI or Human patterns" }
  },
  required: ["humanScore", "aiScore", "readability", "reasons"]
};

/**
 * وظيفة فحص النصوص: تقوم بتحليل النص لبيان مدى كونه مولد بواسطة الذكاء الاصطناعي
 */
export const analyzeText = async (text: string): Promise<AnalysisResult> => {
  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: `You are a forensic linguistic analyst specializing in AI detection. 
    Evaluate the following text for structural predictability, lack of burstiness, and typical LLM training patterns.
    Text to analyze: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: ANALYSIS_SCHEMA,
    }
  });

  return JSON.parse(response.text || '{}') as AnalysisResult;
};

/**
 * وظيفة الأنسنة (Humanizing): تستخدم برومبت Salloum الاحترافي لتحويل النص
 */
export const humanizeText = async (
  text: string, 
  options: { audience?: string; tone?: string }
): Promise<string> => {
  const systemInstruction = `
## Writing Humanizer Framework (Salloum.Huminizer)

Your task is to transform and humanize any piece of writing, ensuring it is clear, direct, and engaging. The goal is to refine your source text by removing unnecessary words, avoiding marketing clichés, and adopting a natural, conversational tone.

### Guidelines
1. Focus on Clarity: Make your message easy to understand.
2. Be Direct and Concise: Get straight to the point.
3. Use Simple Language: Write plainly with short sentences.
4. Avoid Fluff: Stay away from unnecessary adjectives and adverbs.
5. Avoid Marketing Hype: Don’t over-promise or use promotional buzzwords.
6. Keep It Real: Be honest; avoid forced friendliness or exaggeration.
7. Maintain a Natural/Conversational Tone: It’s okay to start sentences with “And” or “But.”
8. Simplify Grammar: Don’t stress about perfection; it’s okay to be a bit informal.
9. Avoid AI-Giveaway Phrases: Drop clichés like “dive into,” “unleash your potential,” etc.
10. Vary Sentence Structures: Combine short, medium, and long sentences.
11. Address Readers Directly: Use “you” and “your.”
12. Use Active Voice.
13. Avoid Filler Phrases.
14. Remove Clichés, Jargon, Hashtags, Semicolons, Emojis, and Asterisks.
15. Minimize Conditional Language: When sure, don’t hedge with “could,” “might,” or “may.”
16. Eliminate Redundancy & Repetition.
17. Avoid Forced Keyword Placement.

### Contextual Inputs
- Audience Profile: ${options.audience || "General Public"}
- Tone/Style: ${options.tone || "Natural and Conversational"}

Final Objective: Produce text that is Clear, Concise, Natural, and Credible. Return ONLY the refined text.
  `;

  const response = await ai.models.generateContent({
    model: MODEL_NAME,
    contents: text,
    config: {
      systemInstruction,
      temperature: 0.9,
    }
  });

  return response.text || text;
};
