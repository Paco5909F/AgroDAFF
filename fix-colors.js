const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'pdf-generator.ts');
let content = fs.readFileSync(filePath, 'utf8');

// Replace all COLORS. with colors.
content = content.replace(/COLORS\./g, 'colors.');

// Add const colors = getColors(branding); to each function
const functionsToPatch = [
    'generatePresupuestoPDF',
    'generateOrdenPDF',
    'generateLiquidacionPDF',
    'generateCartaPortePDF',
    'generateReportPDF',
    'generateDashboardPdf'
];

functionsToPatch.forEach(fn => {
    const searchString = `export const ${fn} = (`;
    const regex = new RegExp(`(export const ${fn} = .*?=>\\s*{)`, 'g');
    content = content.replace(regex, `$1\n    const colors = getColors(branding);`);
});

// Also fix the draw methods that might not have colors in scope
// drawHeader, drawDivider, drawLabelValue, etc...
// Actually, drawHeader is called from within those functions. 
// We should pass `colors` to these helper functions!
// Wait, if we change the signature of drawHeader, we have to change all call sites.
// Alternatively, since COLORS is used in drawHeader, drawDivider, drawLabelValue, drawFooter...
// Let's pass `branding: PdfBranding` to them, or `colors: any` to them.
content = content.replace(/const drawHeader = \(doc: jsPDF, title: string, docData: any\[\], branding: PdfBranding, yOffset: number = 0\) => {/g, 
'const drawHeader = (doc: jsPDF, title: string, docData: any[], branding: PdfBranding, yOffset: number = 0, colors: any = getColors(branding)) => {');

content = content.replace(/const drawDivider = \(doc: jsPDF, y: number, margin: number, pageWidth: number\) => {/g, 
'const drawDivider = (doc: jsPDF, y: number, margin: number, pageWidth: number, colors: any) => {');
// update drawDivider calls
content = content.replace(/drawDivider\(doc, (.*?), margin, pageWidth\);/g, 'drawDivider(doc, $1, margin, pageWidth, colors);');

content = content.replace(/const drawLabelValue = \(doc: jsPDF, label: string, value: string, x: number, y: number, w: number\) => {/g, 
'const drawLabelValue = (doc: jsPDF, label: string, value: string, x: number, y: number, w: number, colors: any) => {');
// update drawLabelValue calls
content = content.replace(/drawLabelValue\(doc, (.*?), (.*?), (.*?), (.*?), (.*?)\);/g, 'drawLabelValue(doc, $1, $2, $3, $4, $5, colors);');

// update generateFacturaPDF (there is no generateFacturaPDF currently, it's CartaPorte or others, but just in case)
const facturaRegex = new RegExp(`(export const generateFacturaPDF = .*?=>\\s*{)`, 'g');
content = content.replace(facturaRegex, `$1\n    const colors = getColors(branding);`);

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed pdf-generator.ts');
