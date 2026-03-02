import { GoogleGenerativeAI } from "@google/generative-ai";

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método no permitido' });

  try {
    const { userQuery, contextData } = req.body;
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" }, { apiVersion: "v1beta" });

    const contextText = contextData.length > 0 
      ? `Datos del Cabildo de Tenerife encontrados: ${JSON.stringify(contextData)}`
      : "No se han encontrado centros específicos en la base de datos para esta consulta.";

    const prompt = `
       Eres GeoBot, asistente experto de GeoLearn Tenerife. 
      
      Instrucciones principales:
      - Responde a la pregunta: "${userQuery}"
      - Usa estos datos: ${contextText}
      - Si hay web o teléfono, dalo. Si la web es muy larga, solo el dominio principal. NO muestres la web si empieza por 'gobiernodecanarias.org'.
      - No uses párrafos largos ni dejes líneas en blanco entre listas.
      - Usa un formato de lista compacta (ej: 📍 Nombre - Municipio).
      - Añade emoticonos para presentar la información relevante de forma más concisa.
      - Si no hay datos, responde en una sola frase corta.
      - Lenguaje cercano y amigable. Sé muy breve.
      - ESTRICTO: NO uses negritas (Solo pon negritas en los nombres de los centros), ni asteriscos, ni formato Markdown. Solo texto plano y emojis.
      - Utiliza el campo 'tipo' para clasificar el centro (ej: Si dice Ludoteca, trátalo como espacio infantil).
      - Normaliza los tipos (ej: 'museos salas de arte' -> 'Museo y Salas de Arte').
      - IMPORTANTE Si te piden búsqueda de centros, da una breve descripción de cada uno de ellos motivando a su búsqueda exhaustiva.
      
      REGLAS PARA RUTAS Y GUÍAS (¡MUY IMPORTANTE!):
      Si detectas que el usuario pide una "ruta", "guía", "recorrido" o "qué visitar":
        1. NO INCLUYAS ELEMENTOS CULTURALES, SOLO EDUCATIVOS. Solo incluye museos, bibliotecas, archivos históricos y centros educativos (escuelas, colegios, universidades, institutos...).
        2. Si NO especificó lugar: Inventa una "Ruta Educativa Aleatoria" por la isla. Selecciona 3 o 4 lugares (educativos, NO ocio) en un recorrido lógico de un día.
        3. Si SÍ especificó lugar (ej. "ruta por Anaga"): Usa los DATOS DISPONIBLES si los hay, o tu conocimiento, para crear un recorrido paso a paso por esa zona.
        4. Presenta la ruta con este formato limpio: 
           📍 Parada 1: [Lugar] - [Breve motivo educativo para ir]
           📍 Parada 2: [Lugar] - [Breve motivo educativo para ir]

      OBLIGATORIO:
      Al final de tu respuesta, añade SIEMPRE una frase invitando al usuario a seguir explorando. Hazle una pregunta relacionada con su búsqueda u ofrécele crearle una guía/ruta de otros lugares  educativos (no de ocio) por la zona. Añade emoticonos para hacerla más amigable.
    `;

    const result = await model.generateContent(prompt);
    res.status(200).json({ reply: await result.response.text() });
  } catch (error) {
    console.error("Error en chat:", error);
    res.status(500).json({ reply: "Lo siento, tengo un problema técnico para acceder a los datos en este momento." });
  }
}