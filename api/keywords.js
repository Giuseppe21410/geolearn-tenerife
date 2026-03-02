import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { userQuery } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1beta" });

    const prompt = `
      Analiza la siguiente consulta de un usuario sobre centros educativos y culturales en Tenerife: "${userQuery}"
      Extrae las palabras clave más importantes para buscar en una base de datos GeoJSON.
      
      REGLAS ESTRICTAS:
      1. Convierte todo a singular (ej: "universidades" -> "universidad", "museos" -> "museo").
      2. ELIMINA palabras vacías y de intención (ej: "busco", "quiero", "ruta", "guía", "visitar", "algun", "en", "de").
      3. No ignores nombres específicos (ej: "Sobradillo", "Anchieta"). Si es compuesto, sepáralo por comas (ej: 'IES El Sobradillo' -> 'ies, sobradillo').
      4. RECONOCIMIENTO DE ZONAS: Identifica no solo municipios, sino también BARRIOS, PUEBLOS o ZONAS (ej: "La Cuesta", "Anaga", "Ofra"). Averigua a qué municipio pertenece ese barrio e INCLUYE el municipio original y el averiguado en la lista.
      5. FORMATO DE SALIDA: Devuelve ÚNICAMENTE las palabras separadas por una coma, en minúsculas. Prohibido añadir texto adicional.

      Ejemplo 1: "¿Hay universidades en La Laguna?" -> "universidad, la laguna"
      Ejemplo 2: "Ruta de museos por Ofra" -> "museo, ofra, santa cruz de tenerife"
      Ejemplo 3: "Quiero una guía de Los Cristianos" -> "los cristianos, arona"
      Ejemplo 4: "Ruta aleatoria" -> "aleatorio"
    `;

    const result = await model.generateContent(prompt);
    const text = await result.response.text();
    const keywords = text.split(',').map(word => word.trim().toLowerCase()).filter(w => w.length > 0);

    res.status(200).json({ keywords });
  } catch (error) {
    console.error("Error en keywords:", error);
    res.status(500).json({ keywords: req.body.userQuery.toLowerCase().split(' ').filter(w => w.length > 3) });
  }
}