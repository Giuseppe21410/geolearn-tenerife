import JavaScriptObfuscator from 'javascript-obfuscator';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Vite coloca todo en 'dist', pero los JS suelen estar en 'dist/assets'
const distPath = path.join(__dirname, 'dist');

/**
 * Función para buscar archivos de forma recursiva
 */
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(function(file) {
    if (fs.statSync(dirPath + "/" + file).isDirectory()) {
      arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles);
    } else {
      if (file.endsWith('.js')) {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
  });

  return arrayOfFiles;
}

console.log('🚀 Iniciando proceso de ofuscación...');

if (fs.existsSync(distPath)) {
  const jsFiles = getAllFiles(distPath);
  
  if (jsFiles.length === 0) {
    console.log('⚠️ No se encontraron archivos .js en la carpeta dist.');
  }

  jsFiles.forEach(filePath => {
    const fileName = path.basename(filePath);
    const code = fs.readFileSync(filePath, 'utf8');
    
    // Si el archivo ya está ofuscado o es muy pequeño, podrías saltarlo, 
    // pero aquí lo procesamos todo para asegurar:
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      controlFlowFlatteningThreshold: 1,
      numbersToExpressions: true,
      simplify: true,
      stringArray: true,
      stringArrayThreshold: 1,
      // Esto hará que sea casi imposible de leer:
      renameGlobals: false 
    }).getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscatedCode);
    console.log(`✅ Ofuscado: ${fileName}`);
  });

  console.log('🎉 ¡Proceso finalizado con éxito!');
} else {
  console.log('❌ Error: La carpeta "dist" no existe. Ejecuta primero "npm run build".');
}