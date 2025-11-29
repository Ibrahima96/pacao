// Service unifié pour l'IA - Utilise Gemini, Meta AI (Groq) ou Meta AI Direct
import { generateLore as generateWithGemini } from './gemini';
import { generateWithMeta } from './metaAI';
import { generateWithMetaDirect } from './metaAIDirect';

// Type d'IA à utiliser
type AIProvider = 'gemini' | 'meta' | 'meta-direct' | 'auto';

// Configuration : Choisissez votre IA préférée
const PREFERRED_AI: AIProvider = (import.meta.env.VITE_PREFERRED_AI || 'auto') as AIProvider;

/**
 * Génère une réponse intelligente en utilisant l'IA disponible
 * @param query - Question de l'utilisateur
 * @returns Réponse générée
 */
export const generateAIResponse = async (query: string): Promise<string> => {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const metaKey = import.meta.env.VITE_META_API_KEY;

    console.log('AI Service: Preferred provider:', PREFERRED_AI);
    console.log('AI Service: Gemini available?', !!geminiKey);
    console.log('AI Service: Meta (Groq) available?', !!groqKey);
    console.log('AI Service: Meta Direct available?', !!metaKey);

    // Mode automatique : utilise le premier disponible
    if (PREFERRED_AI === 'auto') {
        // Priorité : Meta Direct > Groq > Gemini
        if (metaKey) {
            console.log('AI Service: Using Meta AI Direct (auto-selected)');
            return generateWithMetaDirect(query);
        } else if (groqKey) {
            console.log('AI Service: Using Meta AI via Groq (auto-selected)');
            return generateWithMeta(query);
        } else if (geminiKey) {
            console.log('AI Service: Using Gemini (auto-selected)');
            return generateWithGemini(query, '');
        } else {
            return "Aucune IA n'est configurée. Veuillez ajouter VITE_META_API_KEY, VITE_GROQ_API_KEY ou VITE_GEMINI_API_KEY dans votre fichier .env.local";
        }
    }

    // Mode Gemini forcé
    if (PREFERRED_AI === 'gemini') {
        if (!geminiKey) {
            console.warn('AI Service: Gemini preferred but not configured, trying fallback');
            if (metaKey) return generateWithMetaDirect(query);
            if (groqKey) return generateWithMeta(query);
            return "Gemini n'est pas configuré. Ajoutez VITE_GEMINI_API_KEY dans .env.local";
        }
        console.log('AI Service: Using Gemini (forced)');
        return generateWithGemini(query, '');
    }

    // Mode Meta Groq forcé
    if (PREFERRED_AI === 'meta') {
        if (!groqKey) {
            console.warn('AI Service: Meta (Groq) preferred but not configured, trying fallback');
            if (metaKey) return generateWithMetaDirect(query);
            if (geminiKey) return generateWithGemini(query, '');
            return "Meta AI (Groq) n'est pas configuré. Ajoutez VITE_GROQ_API_KEY dans .env.local";
        }
        console.log('AI Service: Using Meta AI via Groq (forced)');
        return generateWithMeta(query);
    }

    // Mode Meta Direct forcé
    if (PREFERRED_AI === 'meta-direct') {
        if (!metaKey) {
            console.warn('AI Service: Meta Direct preferred but not configured, trying fallback');
            if (groqKey) return generateWithMeta(query);
            if (geminiKey) return generateWithGemini(query, '');
            return "Meta AI Direct n'est pas configuré. Ajoutez VITE_META_API_KEY dans .env.local";
        }
        console.log('AI Service: Using Meta AI Direct (forced)');
        return generateWithMetaDirect(query);
    }

    return "Configuration IA invalide.";
};

/**
 * Obtient le nom de l'IA actuellement utilisée
 */
export const getActiveAIProvider = (): string => {
    const geminiKey = import.meta.env.VITE_GEMINI_API_KEY;
    const groqKey = import.meta.env.VITE_GROQ_API_KEY;
    const metaKey = import.meta.env.VITE_META_API_KEY;

    if (PREFERRED_AI === 'gemini' && geminiKey) return 'Gemini';
    if (PREFERRED_AI === 'meta' && groqKey) return 'Meta AI (Groq)';
    if (PREFERRED_AI === 'meta-direct' && metaKey) return 'Meta AI Direct';

    // Auto mode - priorité Meta Direct > Groq > Gemini
    if (metaKey) return 'Meta AI Direct';
    if (groqKey) return 'Meta AI (Groq)';
    if (geminiKey) return 'Gemini';

    return 'Aucune';
};
