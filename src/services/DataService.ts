// src/services/dataService.ts

export const findRelevantData = async (keywords: string[]) => {
  try {
    const response = await fetch('/data/centros-educativos-y-culturales.geojson');
    if (!response.ok) {
      throw new Error("No se pudo cargar '/data/centros-educativos-y-culturales.geojson'");
    }

    const centrosData = await response.json();
    if (!centrosData.features || !Array.isArray(centrosData.features)) {
      return [];
    }

    const scoredResults = centrosData.features.map((feature: any) => {
      const p = feature.properties;
      // Validamos que existan las propiedades para evitar errores de null
      const nombre = p.nombre || "";
      const tipo = p.actividad_tipo || "";
      const muni = p.municipio_nombre || "";
      
      const textToSearch = `${nombre} ${tipo} ${muni}`.toLowerCase();
      
      let score = 0;
      keywords.forEach(word => {
        const cleanWord = word.toLowerCase().trim();
        if (cleanWord.length > 2 && textToSearch.includes(cleanWord)) {
          score += 10;
          if (nombre.toLowerCase().includes(cleanWord)) score += 5;
        }
      });

      const randomBonus = Math.random(); 
      // Retornamos un objeto nuevo con el score
      return { ...feature, finalScore: score + randomBonus };
    }).filter((f: any) => f.finalScore > 1); // Tipamos 'f' como any

    // 2. ORDENAR POR PUNTUACIÓN
    // Tipamos 'a' y 'b' como any para acceder a finalScore sin errores
    const sortedResults = scoredResults.sort((a: any, b: any) => b.finalScore - a.finalScore);

    // 3. RETORNAR RESULTADOS
    return sortedResults.slice(0, 5).map((f: any) => {
      const p = f.properties;
      
      let categoriaReal = p.actividad_tipo || 'Centro';
      const nombreLow = (p.nombre || "").toLowerCase();
      
      // Desambiguación manual
      if (nombreLow.includes('ludoteca')) categoriaReal = 'Ludoteca';
      else if (nombreLow.includes('archivo')) categoriaReal = 'Archivo Histórico';
      else if (nombreLow.includes('biblioteca')) categoriaReal = 'Biblioteca';

      return {
        nombre: p.nombre || 'Sin nombre',
        tipo: categoriaReal, 
        municipio: p.municipio_nombre || 'Tenerife',
        telefono: p.telefono || 'No disponible',
        info_extra: `Categoría original: ${p.actividad_tipo || 'No definida'}` 
      };
    });

  } catch (error) {
    console.error("Error en dataService:", error);
    return [];
  }
};


export const getStats = async () => {
  try {
    const response = await fetch('/data/centros-educativos-y-culturales.geojson');

    if (!response.ok) {
      throw new Error("No se pudo encontrar el archivo '/data/centros-educativos-y-culturales.geojson'");
    }

    const data = await response.json();

    const stats = {
      bibliotecas: 0,
      museos: 0,
      centrosEducativos: 0,
      centrosCulturales: 0,
    };

    if (data.features && Array.isArray(data.features)) {
        data.features.forEach((f: any) => {
          const tipo = (f.properties.actividad_tipo || "").toLowerCase();

          
          if (tipo.includes('biblioteca')) {
            stats.bibliotecas++;
          } else if (tipo.includes('museo')) {
            stats.museos++;
          } else if (
            tipo.includes('enseñanza') || tipo.includes('guarderias')
          ) {
            stats.centrosEducativos++;
          } else if (
            tipo.includes('cultural')
          ) {
            stats.centrosCulturales++;
          }
        });
    }

    return stats;
  } catch (error) {
    console.error("Error cargando estadísticas locales:", error);
    return null;
  }
};
