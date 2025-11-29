// Service pour Meta AI (Llama via Groq)
// Alternative gratuite et rapide à Gemini

const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || '';
const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';

export const generateWithMeta = async (query: string): Promise<string> => {
    console.log("Meta AI: Attempting to generate response...");
    console.log("Meta AI: API Key present?", !!GROQ_API_KEY);

    if (!GROQ_API_KEY) {
        console.warn("Meta AI: API Key is missing.");
        return "Notre assistant est momentanément indisponible. (Clé API manquante).";
    }

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${GROQ_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'llama-3.3-70b-versatile', // Ou 'llama-3.1-8b-instant' pour plus rapide
                messages: [
                    {
                        role: 'system',
                        content: `Tu es l'assistant virtuel intelligent de l'entreprise "Pacao" (PDS).
            
Voici les services que propose Pacao :
1. Création graphique : Logos, Cartes (visite, membres).
2. Impression & Déco : Photos murales, Affiches PUB.
3. Personnalisation : Flocage, Sachets personnalisées.
4. Matériel : Matériels électriques, Ordinateurs.

Réponds de manière professionnelle, élégante et serviable (style concis).
Le but est d'inciter le client à demander un devis ou à s'intéresser aux services.
Réponds impérativement en français. Fais moins de 80 mots.`
                    },
                    {
                        role: 'user',
                        content: query
                    }
                ],
                temperature: 0.7,
                max_tokens: 150,
            }),
        });

        if (!response.ok) {
            throw new Error(`API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";
    } catch (error) {
        console.error("Meta AI API Error:", error);
        return "La connexion au service a échoué. Veuillez réessayer plus tard.";
    }
};
