const JavaScriptObfuscator = require('javascript-obfuscator');
const fs = require('fs');
const path = require('path');

// Ruta donde React guarda el código compilado
const buildPath = path.join(__dirname, 'build/static/js');

fs.readdirSync(buildPath).forEach(file => {
  if (file.endsWith('.js')) {
    const filePath = path.join(buildPath, file);
    const code = fs.readFileSync(filePath, 'utf8');
    
    const obfuscatedCode = JavaScriptObfuscator.obfuscate(code, {
      compact: true,
      controlFlowFlattening: true,
      numbersToExpressions: true,
      simplify: true,
      stringArray: true,
      stringArrayThreshold: 0.75
    }).getObfuscatedCode();

    fs.writeFileSync(filePath, obfuscatedCode);
  }
});