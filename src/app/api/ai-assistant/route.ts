import { NextResponse } from 'next/server'
import { getCampaignAnalytics } from '@/server/analytics'
import { getUserContextSafe } from '@/server/context'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
    try {
        const ctx = await getUserContextSafe();
        if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const prompt: string = body.prompt?.toLowerCase() || "";

        // NLP Simulado hyper-rápido cruzado con la DB
        let responseMessage = "Interesante pregunta. Aún estoy aprendiendo, ¿podrías reformularlo apuntando a 'gastos', 'sugerencias' o 'herbicidas'?";

        const stats = await getCampaignAnalytics(null);

        // Agregamos un ligero delay intencional para dar la "sensación de procesamiento de IA"
        await delay(600);

        // Intent Recognition (Rule-based)
        if (prompt.includes("cuanto gaste") || prompt.includes("cuánto gasté") || prompt.includes("costo total")) {
            const formatTotal = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(stats.gastoTotal);
            responseMessage = `Hasta el momento llevás invertidos **${formatTotal}** en la campaña activa (incluye insumos y labores).`;
        } 
        else if (prompt.includes("herbicida")) {
            const herbCost = stats.gastoPorInsumo['HERBICIDA'] || 0;
            const formatHerb = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(herbCost);
            responseMessage = `En herbicidas venís gastando un total de **${formatHerb}**. ¿Querés ver mi sugerencia al respecto?`;
        }
        else if (prompt.includes("sugerencia") || prompt.includes("recomend") || prompt.includes("consejo")) {
            if (stats.sugerencias.length > 0) {
                responseMessage = `💡 **AgroDAFF IA dice:**\n\n` + stats.sugerencias.map(s => `- ${s}`).join("\n");
            } else {
                responseMessage = "La verdad es que tu perfil productivo viene impecable en costos relativos. No hay alertas por el momento.";
            }
        }
        else if (prompt.includes("semilla") || prompt.includes("fertilizante")) {
            const seed = stats.gastoPorInsumo['SEMILLA'] || 0;
            const fert = stats.gastoPorInsumo['FERTILIZANTE'] || 0;
            responseMessage = `Inversión actual:\n🌱 Semillas: $${seed}\n🧬 Fertilizantes: $${fert}`;
        }
        else if (prompt.includes("lote") || prompt.includes("campo") || prompt.includes("caro")) {
            if (Object.keys(stats.gastoPorLote).length === 0) {
                responseMessage = "Aún no tenés lotes con costos cruzados registrados en el sistema.";
            } else {
                let maxLote = '';
                let maxCost = 0;
                for (const [lname, lcost] of Object.entries(stats.gastoPorLote)) {
                    if (lcost > maxCost) { maxCost = lcost; maxLote = lname; }
                }
                responseMessage = `El lote donde más invertiste es **'${maxLote}'** con un acumulado de $${maxCost}.`;
            }
        }
        else if (prompt.includes("hola") || prompt.includes("saludo")) {
             responseMessage = "¡Hola! Soy AgroDAFF Assistant, tu experto en costos agropecuarios. Preguntame sobre 'gastos', 'sugerencias' o 'insumos' de tu campaña actual.";
        }

        return NextResponse.json({ 
            success: true, 
            message: responseMessage
        });

    } catch (e) {
        console.error(e);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
