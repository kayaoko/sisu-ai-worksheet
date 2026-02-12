import { GoogleGenAI, GenerateContentResponse, Type } from "@google/genai";
import { Level, WorksheetData } from "../types";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
    throw new Error("API_KEY environment variable is not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const getLevelSchemaAndPrompt = (level: Level) => {
  const commonProperties = {
     word: { type: Type.STRING, description: 'The English word being studied.' },
     koreanMeaning: { type: Type.STRING, description: 'The Korean translation of the word.' },
     partOfSpeech: { type: Type.STRING, description: 'The part of speech (e.g., noun, verb, adjective).' },
     ipa: { type: Type.STRING, description: "The International Phonetic Alphabet (IPA) representation of the word. e.g., /əˈmeɪzɪŋ/" },
     phoneticSpelling: { type: Type.STRING, description: "A simple phonetic spelling guide for Korean speakers. e.g., 'uh-may-zing'" }
  };

  switch (level) {
    case Level.L1:
      return {
        prompt: `Generate a beginner (Level 1) vocabulary worksheet. Focus on repetition and very simple sentences. Include the IPA and a simple phonetic spelling.`,
        schema: {
          type: Type.OBJECT,
          properties: {
            ...commonProperties,
            wordRepetitions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'The word repeated exactly 3 times.'},
            exampleSentences: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Two very simple example sentences.' },
            changedSentence: { type: Type.STRING, description: 'One of the example sentences, slightly modified (e.g., changed subject).' },
            ownSimpleSentence: { type: Type.STRING, description: 'A new, very simple sentence a student could create.'},
            usageExamples: { type: Type.STRING, description: 'A short quote or proverb using the word.'}
          },
          required: ['word', 'koreanMeaning', 'ipa', 'phoneticSpelling', 'wordRepetitions', 'exampleSentences', 'changedSentence', 'ownSimpleSentence', 'usageExamples']
        }
      };
    case Level.L2:
      return {
        prompt: `Generate an elementary (Level 2) vocabulary worksheet. Introduce definitions and basic grammar conversion. Include the IPA and a simple phonetic spelling.`,
        schema: {
          type: Type.OBJECT,
          properties: {
            ...commonProperties,
            definition: { type: Type.STRING, description: 'A simple English definition of the word.' },
            simpleSentences: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Two simple sentences a student can make.' },
            grammarConversions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Four sentences showing grammatical conversions (e.g., past tense, future tense, question, negative).' },
            usageContext: { type: Type.STRING, description: 'A brief explanation of situations where the word is commonly used.' },
            usageExamples: { type: Type.STRING, description: 'A proverb, quote, or textbook-style sentence using the word.'}
          },
           required: ['word', 'koreanMeaning', 'partOfSpeech', 'ipa', 'phoneticSpelling', 'definition', 'simpleSentences', 'grammarConversions', 'usageContext', 'usageExamples']
        }
      };
    case Level.L3:
       return {
        prompt: `Generate an intermediate (Level 3) vocabulary worksheet. Focus on real-life application, synonyms, and paragraph context. Include the IPA and a simple phonetic spelling.`,
        schema: {
          type: Type.OBJECT,
          properties: {
            ...commonProperties,
            definition: { type: Type.STRING, description: 'A clear English definition of the word.' },
            exampleSentence: { type: Type.STRING, description: 'A good example sentence.' },
            realLifeSentence: { type: Type.STRING, description: 'A sentence demonstrating the word in a daily life situation.' },
            shortParagraph: { type: Type.STRING, description: 'A short conversational paragraph (3-5 sentences) using the word naturally.' },
            usageContext: { type: Type.STRING, description: 'Description of where or when this word can be used.' },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 2-3 common synonyms.' },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 1-2 common antonyms.' },
            grammarConversions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Two sentences showing grammatical conversions (e.g., changing tense, active/passive voice).' },
          },
          required: ['word', 'koreanMeaning', 'partOfSpeech', 'ipa', 'phoneticSpelling', 'definition', 'exampleSentence', 'realLifeSentence', 'shortParagraph', 'usageContext', 'synonyms', 'antonyms', 'grammarConversions']
        }
      };
    case Level.L4:
      return {
        prompt: `Generate an advanced (Level 4) vocabulary worksheet. Include nuanced usage, a longer paragraph, and self-reflection prompts. Include the IPA and a simple phonetic spelling.`,
        schema: {
          type: Type.OBJECT,
          properties: {
            ...commonProperties,
            definition: { type: Type.STRING, description: 'A detailed English definition.' },
            realLifeSentence: { type: Type.STRING, description: 'A sentence depicting a realistic, daily life situation.' },
            grammarConversions: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'Two sentences converting the original based on grammar (e.g., complex tenses, conditional).'},
            miniParagraph: { type: Type.STRING, description: 'A mini-paragraph (at least 5 sentences) in a speech-like style using the word.' },
            usageContext: { type: Type.STRING, description: 'Explanation of where this word can be used.' },
            synonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 3-4 synonyms, including nuanced ones.' },
            antonyms: { type: Type.ARRAY, items: { type: Type.STRING }, description: 'A list of 2-3 antonyms.' },
            selfCheck: { type: Type.STRING, description: 'Prompts for self-check: e.g., difficulties, ways to remember, related proverbs or quotes.' },
          },
          required: ['word', 'koreanMeaning', 'partOfSpeech', 'ipa', 'phoneticSpelling', 'definition', 'realLifeSentence', 'grammarConversions', 'miniParagraph', 'usageContext', 'synonyms', 'antonyms', 'selfCheck']
        }
      };
  }
};


export async function generateWorksheetData(word: string, level: Level): Promise<WorksheetData> {
  const { prompt, schema } = getLevelSchemaAndPrompt(level);
  
  const fullPrompt = `You are an expert English teacher creating vocabulary worksheets for Korean students. For the word "${word}", ${prompt}.`;

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
      config: {
        responseMimeType: 'application/json',
        responseSchema: schema,
      },
    });

    const jsonString = response.text.trim();
    const parsedData = JSON.parse(jsonString);

    // Basic validation
    if (!parsedData || !parsedData.word) {
      throw new Error("AI response is missing required data.");
    }
    
    // The Gemini API will return data according to the schema for the requested level.
    // So we can cast it to the correct type.
    return parsedData as WorksheetData;

  } catch (error) {
    console.error("Error generating worksheet data:", error);
    throw new Error("Failed to generate worksheet content from the AI. The model may have returned an invalid format.");
  }
}

export async function generateImageForWord(word: string, level: Level): Promise<string | null> {
    console.log(`Generating image for "${word}" at level ${level} using imagen-4.0-generate-001.`);
    
    let prompt = `A child-friendly, simple, colorful illustration representing the concept of '${word}'. Avoid using any text or letters in the image. The style should be like a drawing in a children's book, on a clean white background.`;

    if (level === Level.L3 || level === Level.L4) {
        prompt = `An expressive and slightly more detailed illustration representing the nuanced concept of '${word}'. The style should be suitable for an older learner, like a drawing in a young adult novel. Clean white background, no text or letters in the image.`;
    }

    try {
        const response = await ai.models.generateImages({
            model: 'imagen-4.0-generate-001',
            prompt: prompt,
            config: {
              numberOfImages: 1,
              outputMimeType: 'image/png',
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            const base64ImageBytes: string = response.generatedImages[0].image.imageBytes;
            const imageData = `data:image/png;base64,${base64ImageBytes}`;
            return imageData;
        }
        
        console.warn(`No image generated for "${word}".`);
        return null;

    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        if (errorMessage.includes("429") || errorMessage.includes("RESOURCE_EXHAUSTED") || errorMessage.includes("quota")) {
            console.warn(`Image generation quota exceeded for word "${word}". Unable to generate a new image. The app will continue without it.`);
        } else {
            console.error(`An unexpected error occurred while generating an image for "${word}":`, error);
        }
        // Don't throw an error, just return null so the app can continue without an image.
        return null;
    }
}