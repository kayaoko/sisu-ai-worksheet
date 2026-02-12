import { GoogleGenAI } from "@google/genai";

export default async function handler(req, res) {
  const API_KEY = process.env.API_KEY;

  if (!API_KEY) {
    return res.status(500).json({ error: "API key not set" });
  }

  const ai = new GoogleGenAI({ apiKey: API_KEY });

  const { word, level } = req.body;

  let prompt = `A child-friendly illustration of '${word}', no text.`;

  if (level >= 3) {
    prompt = `A detailed illustration of '${word}', no text.`;
  }

  try {
    const response = await ai.models.generateImages({
      model: "imagen-4.0-generate-001",
      prompt,
      config: {
        numberOfImages: 1,
        outputMimeType: "image/png",
      },
    });

    const image =
      response.generatedImages?.[0]?.image?.imageBytes || null;

    return res.status(200).json({ image });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
