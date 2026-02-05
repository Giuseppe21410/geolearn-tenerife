// src/services/GeminiService.ts
import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey);

export const getAiResponse = async (userQuery: string, contextData: any[]) => {
  try {
    // 1. Usamos 'gemini-1.5-flash' y forzamos 'v1beta'
    // Esta combinación es la que menos errores da en Europa
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite" 
    }, { 
      apiVersion: "v1beta" 
    });

    // 2. Formateamos los datos que encontraste en el GeoJSON
    const contextText = contextData.length > 0 
      ? `Datos del Cabildo de Tenerife: ${JSON.stringify(contextData)}`
      : "No se han encontrado centros específicos en la base de datos para esta consulta.";

    const prompt = `
      Eres GeoBot, asistente de GeoLearn Tenerife. 
      Instrucciones:
      - Responde a la pregunta: "${userQuery}"
      - Usa estos datos: ${contextText}
      - Si hay web o teléfono, dalo. Sin embargo, si la web es muy larga, solo da el dominio principal. Si la web comienza por 'gobiernodecanarias.org', no muestres la web.
      - No uses párrafos largos.
      - No dejes líneas en blanco entre los puntos de la lista.
      - Usa un formato de lista compacta (ej: 1. Nombre - Municipio).
      - Si no hay datos, responde en una sola frase corta.
      - Usa un lenguaje cercano y amigable.
      - Sé amable y muy breve.
      - NO uses negritas, ni asteriscos, ni Markdown.
      - Escribe en texto plano y limpio.
      - Utiliza el campo 'tipo' proporcionado en los datos para clasificar el centro. Si el nombre dice Ludoteca, trátalo como un espacio infantil, aunque esté ubicado en una biblioteca.
    `;

    // 3. Petición real
    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();

  } catch (error: any) {
    console.error("Error detallado en el servicio:", error);
    
    // PLAN DE RESCATE: Si falla el 404, el modelo 'gemini-pro' es el más compatible
    return "Lo siento, tengo un problema técnico para acceder a los datos. ¿Puedes probar de nuevo en unos segundos?";
  }
};

// src/services/geminiService.ts

export const getSearchKeywords = async (userQuery: string): Promise<string[]> => {
  try {
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash-lite" 
    }, { 
      apiVersion: "v1beta" 
    });

    const prompt = `
      Analiza la siguiente consulta de un usuario sobre centros en Tenerife: "${userQuery}"
      Extrae las palabras clave más importantes para buscar en una base de datos.
      
      REGLAS:
      1. Convierte todo a singular (ej: "universidades" -> "universidad", "museos" -> "museo").
      2. Elimina palabras vacías (ej: "busco", "quiero", "algun", "en", "de").
      3. Si el usuario menciona un municipio, inclúyelo.
      4. Devuelve ÚNICAMENTE las palabras separadas por una coma.
      5. No ignores NINGÚN nombre específico (ej: "Sobradillo", "Anchieta", "Viera").
      6. Si el usuario pregunta por un nombre propio compuesto, devuélvelo como palabras separadas por comas. Ejemplo: 'IES El Sobradillo' -> 'ies, sobradillo'
      
      Ejemplo: "¿Hay universidades en La Laguna?" -> "universidad, La Laguna"
      Ejemplo: "Quiero ver bibliotecas de Arona" -> "biblioteca, Arona"
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Convertimos el texto "universidad, La Laguna" en un Array ["universidad", "la laguna"]
    return text.split(',').map(word => word.trim().toLowerCase());
  } catch (error) {
    console.error("Error extrayendo keywords:", error);
    // Si falla la IA, devolvemos las palabras originales como plan B
    return userQuery.toLowerCase().split(' ');
  }
};