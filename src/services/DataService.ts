// src/services/dataService.ts

export const findRelevantData = async (keywords: string[]) => {
  try {
    const response = await fetch('https://datos.tenerife.es/ckan/api/action/package_show?id=573a49e8-e2fb-4fe4-b47b-ac5dec1bf580');
    const apiResult = await response.json();
    const geojsonResource = apiResult.result.resources.find((res: any) => res.format.toLowerCase() === 'geojson');
    
    if (!geojsonResource) return [];

    const dataResponse = await fetch(geojsonResource.url);
    const centrosData = await dataResponse.json();

    // 1. FILTRADO Y PUNTUACIÓN
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
    const response = await fetch('https://datos.tenerife.es/ckan/api/action/package_show?id=573a49e8-e2fb-4fe4-b47b-ac5dec1bf580');
    const apiResult = await response.json();
    const url = apiResult.result.resources.find((res: any) => res.format.toLowerCase() === 'geojson').url;
    const data = await (await fetch(url)).json();

    const stats = {
      bibliotecas: 0,
      museos: 0,
      centrosEducativos: 0,
      centrosCulturales: 0,
    };

    data.features.forEach((f: any) => {
      const tipo = (f.properties.actividad_tipo || "").toLowerCase();

      // Lógica de clasificación
      if (tipo.includes('biblioteca') ) {
        stats.bibliotecas++;
      } else if (tipo.includes('museo')) {
        stats.museos++;
      }  else if (
        tipo.includes('enseñanza') || tipo.includes('guarderias') 
      ) {
        stats.centrosEducativos++;
      } else if (
        tipo.includes('cultural') 
      ) {
        stats.centrosCulturales++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error cargando estadísticas:", error);
    return null;
  }
};