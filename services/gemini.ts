import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY || '';
const genAI = new GoogleGenerativeAI(apiKey);

export const generateLore = async (query: string, context: string): Promise<string> => {
  console.log("Gemini: Attempting to generate lore...");
  console.log("Gemini: API Key present?", !!apiKey);

  if (!apiKey) {
    console.warn("Gemini: API Key is missing.");
    return "Notre assistant est momentanément indisponible. (Clé API manquante).";
  }

  try {
    console.log("Gemini: Calling generateContent with model gemini-1.5-flash");
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const prompt = `Tu es l'assistant virtuel intelligent de l'entreprise "Pacao" (PDS).
      
    Voici les services que propose Pacao :
    1. Création graphique : Logos, Cartes (visite, membres).
    2. Impression & Déco : Photos murales, Affiches PUB.
    3. Personnalisation : Flocage, Sachets personnalisées.
    4. Matériel : Matériels électriques, Ordinateurs.
    
    Question du client potentiel : "${query}"
    
    Réponds de manière professionnelle, élégante et serviable (style concis). Le but est d'inciter le client à demander un devis ou à s'intéresser aux services. Réponds impérativement en français. Fais moins de 80 mots.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "La connexion au service a échoué. Veuillez réessayer plus tard.";
  }
};