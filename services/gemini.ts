import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const generateLore = async (query: string, context: string): Promise<string> => {
  if (!apiKey) {
    console.warn("API Key is missing. Returning mock data.");
    return "Notre assistant est momentanément indisponible. (Veuillez configurer votre API_KEY).";
  }

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Tu es l'assistant virtuel intelligent de l'entreprise "Pacao" (PDS).
      
      Voici les services que propose Pacao :
      1. Création graphique : Logos, Cartes (visite, membres).
      2. Impression & Déco : Photos murales, Affiches PUB.
      3. Personnalisation : Flocage, Sachets personnalisées.
      4. Matériel : Matériels électriques, Ordinateurs.
      
      Question du client potentiel : "${query}"
      
      Réponds de manière professionnelle, élégante et serviable (style concis). Le but est d'inciter le client à demander un devis ou à s'intéresser aux services. Réponds impérativement en français. Fais moins de 80 mots.
      `,
    });
    return response.text || "Je n'ai pas compris votre demande.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "La connexion au service a échoué. Veuillez réessayer plus tard.";
  }
};