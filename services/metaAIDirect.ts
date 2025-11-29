// Service pour Meta AI - API Directe
// Utilise l'API Llama via Meta AI directement

const META_API_KEY = import.meta.env.VITE_META_API_KEY || '';
const META_API_URL = 'https://www.llama-api.com/chat/completions';

export const generateWithMetaDirect = async (query: string): Promise<string> => {
    console.log("Meta AI Direct: Attempting to generate response...");
    console.log("Meta AI Direct: API Key present?", !!META_API_KEY);

    if (!META_API_KEY) {
        console.warn("Meta AI Direct: API Key is missing.");
        return "Notre assistant est momentanément indisponible. (Clé API Meta manquante).";
    }

    try {
        const response = await fetch(META_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${META_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
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
                stream: false,
                max_tokens: 150
            }),
        });

        if (!response.ok) {
            throw new Error(`Meta API responded with status: ${response.status}`);
        }

        const data = await response.json();
        return data.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";
    } catch (error) {
        console.error("Meta AI Direct API Error:", error);
        return "La connexion au service Meta AI a échoué. Veuillez réessayer plus tard.";
    }
};
