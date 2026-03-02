import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';

const DATASETS = [
    {
        name: "Centros Educativos y Culturales",
        id: "573a49e8-e2fb-4fe4-b47b-ac5dec1bf580", 
        outputFile: "centros-educativos-y-culturales.geojson"
    },
    {
        name: "Paradas de Guagua",
        id: "749d9208-ad97-47f9-a497-0385df40420d",
        outputFile: "paradas-guaguas.geojson"
    },
    {
        name: "Paradas de Tranvía",
        id: "19914413-77e1-441c-83a7-8f0f45c0767a",
        outputFile: "paradas-tranvia.geojson"
    }
];

const API_BASE = "https://datos.tenerife.es/ckan/api/action/package_show?id=";
const __dirname = path.dirname(fileURLToPath(import.meta.url));

const fetchJson = (url) => {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
                fetchJson(res.headers.location).then(resolve).catch(reject);
                return;
            }
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                try {
                    resolve(JSON.parse(data));
                } catch (e) {
                    reject(new Error(`Respuesta no válida`));
                }
            });
        }).on('error', reject);
    });
};

const processDataset = async (dataset) => {
    console.log(`\n🔵 Procesando: ${dataset.name}...`);
    try {
        const metaData = await fetchJson(`${API_BASE}${dataset.id}`);
        const resource = metaData.result.resources.find(r => r.format && r.format.toLowerCase() === 'geojson');
        
        if (!resource) throw new Error("No hay GeoJSON");

        console.log(`   ⬇️  Descargando...`);
        const geoJsonRaw = await fetchJson(resource.url);

        const optimizedFeatures = geoJsonRaw.features
            .filter(f => {
                if (f.properties && f.properties.actividad_tipo) {
                    const tipo = f.properties.actividad_tipo.toLowerCase().trim();
                    if (
                        tipo === "centro comercial hogar informatica telecomunicaciones" || 
                        tipo === "café"
                    ) {
                        return false; 
                    }
                }
                return true; 
            })
            .map(f => {
                const coords = f.geometry.coordinates;
                const newCoords = [
                    Number(Number(coords[0]).toFixed(5)), 
                    Number(Number(coords[1]).toFixed(5))
                ];

                const newProps = { ...f.properties };

                delete newProps.fecha_creacion;
                delete newProps.fecha_actualizacion;
                delete newProps.referencia; 
                delete newProps.latitud;    
                delete newProps.longitud;   

                Object.keys(newProps).forEach(key => 
                    (newProps[key] === null || newProps[key] === "" || newProps[key] === undefined) 
                    && delete newProps[key]
                );

                return {
                    type: "Feature",
                    geometry: { type: "Point", coordinates: newCoords },
                    properties: newProps
                };
            });

        const optimizedJSON = {
            type: "FeatureCollection",
            features: optimizedFeatures
        };

        const outputPath = path.join(__dirname, 'public/data', dataset.outputFile);
        fs.writeFileSync(outputPath, JSON.stringify(optimizedJSON));

        // Ver cuánto hemos ganado
        const rawSize = JSON.stringify(geoJsonRaw).length;
        const optSize = fs.statSync(outputPath).size;
        console.log(`   ✅ Guardado. Reducción: ${((1 - optSize/rawSize) * 100).toFixed(1)}%`);

    } catch (error) {
        console.error(`   ❌ Error: ${error.message}`);
    }
};

const main = async () => {
    const publicDir = path.join(__dirname, 'public/data');
    if (!fs.existsSync(publicDir)){
        fs.mkdirSync(publicDir);
    }

    for (const dataset of DATASETS) {
        await processDataset(dataset);
    }
};

main();