const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'src', 'lib', 'pdf-generator.ts');
let content = fs.readFileSync(filePath, 'utf8');

// 1. Add fields to PdfBranding
content = content.replace(
`    cuit: string;
    logoUrl?: string;
}`,
`    cuit: string;
    logoUrl?: string;
    ciudad?: string;
    provincia?: string;
    pdf_footer?: string;
    pdf_primary_color?: string;
    is_profile_completed?: boolean;
}`);

// 2. Add hexToRgb and getColors, but keep COLORS as a let so we can update it globally for now?
// Actually, since this is a module, if multiple users generate PDFs concurrently, modifying a global `COLORS` object would cause race conditions!
// The proper way is to pass `branding` down.
// Let's replace COLORS with getColors(branding) everywhere. But how? 
// The easiest way is to add `colors` as an optional parameter to `drawHeader`, `drawDivider`, etc.

content = content.replace(
`// --- STYLING CONSTANTS ---
const COLORS: Record<string, [number, number, number]> = {
    primary: [0, 0, 0], // Black
    secondary: [80, 80, 80], // Dark Gray
    accent: [240, 240, 240], // Light Gray (Backgrounds)
    text: [20, 20, 20], // Almost Black
    textLight: [100, 100, 100], // Gray Text
    border: [200, 200, 200] // Light Border
};`,
`// --- HELPER FUNCTION: Hex to RGB ---
function hexToRgb(hex: string): [number, number, number] {
    const result = /^#?([a-f\\d]{2})([a-f\\d]{2})([a-f\\d]{2})$/i.exec(hex);
    return result ? [
        parseInt(result[1], 16),
        parseInt(result[2], 16),
        parseInt(result[3], 16)
    ] : [0, 0, 0];
}

// --- STYLING CONSTANTS ---
const getColors = (branding: PdfBranding) => ({
    primary: branding.pdf_primary_color ? hexToRgb(branding.pdf_primary_color) : [0, 0, 0] as [number, number, number],
    secondary: [80, 80, 80] as [number, number, number],
    accent: [240, 240, 240] as [number, number, number],
    text: [20, 20, 20] as [number, number, number],
    textLight: [100, 100, 100] as [number, number, number],
    border: [200, 200, 200] as [number, number, number]
});
const COLORS_FALLBACK = getColors(DEFAULT_BRANDING); // For backwards compatibility if needed.
`);

// Now replace all `COLORS.` with `getColors(branding).`
content = content.replace(/COLORS\./g, 'getColors(branding).');

// Now, any function that uses `getColors(branding)` needs to have `branding` in scope!
// - `drawHeader` has `branding` in scope.
// - `drawDivider` does NOT.
// - `drawLabelValue` does NOT.
// - `drawFooter` does NOT.

content = content.replace(
    'const drawDivider = (doc: jsPDF, y: number, margin: number, pageWidth: number) => {',
    'const drawDivider = (doc: jsPDF, y: number, margin: number, pageWidth: number, branding: PdfBranding = DEFAULT_BRANDING) => {'
);
content = content.replace(/drawDivider\(doc, (.*?), margin, pageWidth\)/g, 'drawDivider(doc, $1, margin, pageWidth, branding)');

content = content.replace(
    'const drawLabelValue = (doc: jsPDF, label: string, value: string, x: number, y: number, w: number) => {',
    'const drawLabelValue = (doc: jsPDF, label: string, value: string, x: number, y: number, w: number, branding: PdfBranding = DEFAULT_BRANDING) => {'
);
content = content.replace(/drawLabelValue\(doc, (.*?), (.*?), (.*?), (.*?), (.*?)\)/g, 'drawLabelValue(doc, $1, $2, $3, $4, $5, branding)');

fs.writeFileSync(filePath, content, 'utf8');
console.log('Fixed pdf-generator.ts with branding passing');
