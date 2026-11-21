const fs = require('fs');
const path = require('path');

const dbJsPath = path.join(__dirname, '..', 'server', 'db.js');
const dbJsonPath = path.join(__dirname, '..', 'server', 'data', 'db.json');

const dbJson = JSON.parse(fs.readFileSync(dbJsonPath, 'utf8'));
let dbJs = fs.readFileSync(dbJsPath, 'utf8');

const startMarker = 'const INITIAL_PRODUCTS = [';
const endMarker = 'const INITIAL_SETTINGS = {';

const startIndex = dbJs.indexOf(startMarker);
const endIndex = dbJs.indexOf(endMarker);

if (startIndex !== -1 && endIndex !== -1) {
  const newProductsCode = `const INITIAL_PRODUCTS = ${JSON.stringify(dbJson.products, null, 2)};\n\n`;
  dbJs = dbJs.slice(0, startIndex) + newProductsCode + dbJs.slice(endIndex);
  fs.writeFileSync(dbJsPath, dbJs, 'utf8');
  console.log('Successfully updated server/db.js with all 37 products!');
} else {
  console.error('Could not find markers in server/db.js');
}
