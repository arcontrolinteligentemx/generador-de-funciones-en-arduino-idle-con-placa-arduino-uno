import { GoogleGenAI } from "@google/genai";
import { AppConfig } from '../types';

export const generateCustomLogic = async (prompt: string, currentConfig: AppConfig): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key not found");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const systemContext = `
    Eres un experto programador de C++ para Arduino, especializado en máquinas arcade, rocolas (jukeboxes) y sistemas de control de monedas (monederos).
    
    Tu tarea es generar SOLAMENTE el código C++ que va dentro de una función void customRoutine() o funciones auxiliares.
    NO generes el sketch completo, solo la lógica solicitada.
    
    Contexto actual del hardware:
    - Pin Monedero: ${currentConfig.coin.pin}
    - Pines Botones: ${currentConfig.buttons.map(b => `${b.id}=Pin ${b.pin}`).join(', ')}
    - Créditos actuales variable global: 'credits' (int)
    - Pulsos actuales variable global: 'pulseCount' (volatile int)
    
    El usuario pedirá una funcionalidad extra. Devuelve código C++ válido y optimizado.
    Si usas 'delay', procura que sea mínimo para no bloquear el loop, o usa millis().
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        systemInstruction: systemContext,
        temperature: 0.3, // Low temperature for code precision
      }
    });

    // Strip markdown code blocks if present
    let text = response.text || "";
    text = text.replace(/```cpp/g, "").replace(/```/g, "").trim();
    
    return text;
  } catch (error) {
    console.error("Error generating code:", error);
    throw new Error("Falló la generación de código inteligente.");
  }
};