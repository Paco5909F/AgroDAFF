import { NextResponse } from 'next/server'
import { getCampaignAnalytics } from '@/server/analytics'
import { getUserContextSafe } from '@/server/context'
import { prisma } from '@/lib/prisma'
import { revalidatePath } from 'next/cache'
import { checkPlanLimits } from '@/server/billing-limits'

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function POST(req: Request) {
    try {
        const ctx = await getUserContextSafe();
        if (!ctx) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

        const body = await req.json();
        const prompt: string = body.prompt?.toLowerCase() || "";

        let responseMessage = "Interesante pregunta. Aún estoy aprendiendo, ¿podrías reformularlo usando palabras como 'gastos', 'rendimiento', o pedirme 'crear un lote' explícitamente?";

        // Intent: CREAR LOTE
        // Regex para detectar: "crea un lote llamado Norte de 100 hectareas", "agendame un lote Sur de 50 has"
        const createLoteRegex = /(?:crea|crear|agrega|agregar|agenda|agendar|inventame).*(?:un )?lote (?:llamado )?([a-z0-9\s]+) de (\d+(?:\.\d+)?) (?:ha|has|hectarea|hectareas)/i;
        const matchLote = prompt.match(createLoteRegex);

        if (matchLote) {
            const nombre = matchLote[1].trim();
            const hectareas = parseFloat(matchLote[2]);
            
            // Check limits
            const limitCheck = await checkPlanLimits(ctx.empresaId, 'LOTE');
            if (!limitCheck.allowed) {
                return NextResponse.json({ success: true, message: `⚠️ **AgroDAFF IA:** No puedo crear el lote. ${limitCheck.message}` });
            }

            // Get first establishment
            const est = await prisma.establecimiento.findFirst({
                where: { empresa_id: ctx.empresaId, deleted_at: null }
            });

            if (!est) {
                return NextResponse.json({ success: true, message: "⚠️ **AgroDAFF IA:** Primero necesitas registrar un 'Establecimiento' (Campo) en el menú principal para que yo pueda asignarle lotes." });
            }

            await prisma.lote.create({
                data: {
                    nombre,
                    hectareas,
                    establecimiento_id: est.id,
                    empresa_id: ctx.empresaId
                }
            });

            // Simulamos demora
            await delay(1200);
            
            return NextResponse.json({ 
                success: true, 
                message: `✅ **¡Hecho!** He creado el lote **"${nombre}"** con **${hectareas} hectáreas** y lo asigné a tu campo principal. Ya puedes verlo en tu mapa de lotes.` 
            });
        }

        const stats = await getCampaignAnalytics(null);
        await delay(600); // Simulamos procesamiento cognitivo

        // Intent: RENDIMIENTO / ANALISIS
        if (prompt.includes("rinde") || prompt.includes("rendimiento") || prompt.includes("como viene")) {
            if (stats.gastoTotal === 0) {
                responseMessage = "📉 Todavía no tienes gastos registrados en esta campaña. ¡Registra labores o insumos para que pueda predecir tu rendimiento!";
            } else if (stats.sugerencias.length > 0) {
                responseMessage = `🤔 **Análisis Rápido:** Tu campaña tiene un costo hundido de $${stats.gastoTotal}. Además, detecté algunas desviaciones:\n\n` + stats.sugerencias.map(s => `- ${s}`).join("\n");
            } else {
                responseMessage = `📊 **Análisis Rápido:** Vienes muy bien. Tu inversión actual es de **$${stats.gastoTotal}** y no veo gastos anómalos en labores ni insumos. ¡Sigue así!`;
            }
        }
        // Intent: GASTOS TOTALES
        else if (prompt.includes("cuanto gaste") || prompt.includes("cuánto gasté") || prompt.includes("costo total")) {
            const formatTotal = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(stats.gastoTotal);
            responseMessage = `Hasta el momento llevás invertidos **${formatTotal}** en la campaña activa. Si me preguntas por "rinde", te doy un resumen de tu eficiencia.`;
        } 
        // Intent: HERBICIDAS
        else if (prompt.includes("herbicida")) {
            const herbCost = stats.gastoPorInsumo['HERBICIDA'] || 0;
            const formatHerb = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'ARS' }).format(herbCost);
            responseMessage = `En herbicidas venís gastando un total de **${formatHerb}**. Es vital rotar principios activos para evitar malezas resistentes.`;
        }
        // Intent: SUGERENCIAS GENERICAS
        else if (prompt.includes("sugerencia") || prompt.includes("recomend") || prompt.includes("consejo")) {
            if (stats.sugerencias.length > 0) {
                responseMessage = `💡 **AgroDAFF IA dice:**\n\n` + stats.sugerencias.map(s => `- ${s}`).join("\n");
            } else {
                responseMessage = "La verdad es que tu perfil productivo viene impecable en costos relativos. No hay alertas por el momento.";
            }
        }
        // Intent: LOTES CAROS
        else if (prompt.includes("lote") || prompt.includes("campo") || prompt.includes("caro")) {
            if (Object.keys(stats.gastoPorLote).length === 0) {
                responseMessage = "Aún no tenés lotes con costos registrados. Prueba pidiéndome: *'crea un lote llamado Norte de 100 has'*";
            } else {
                let maxLote = '';
                let maxCost = 0;
                for (const [lname, lcost] of Object.entries(stats.gastoPorLote)) {
                    if (lcost > maxCost) { maxCost = lcost; maxLote = lname; }
                }
                responseMessage = `El lote donde más invertiste es **'${maxLote}'** con un acumulado de $${maxCost}.`;
            }
        }
        // Intent: INSUMOS ESPECIFICOS
        else if (prompt.includes("semilla") || prompt.includes("fertilizante")) {
            const seed = stats.gastoPorInsumo['SEMILLA'] || 0;
            const fert = stats.gastoPorInsumo['FERTILIZANTE'] || 0;
            responseMessage = `Inversión actual:\n🌱 Semillas: $${seed}\n🧬 Fertilizantes: $${fert}`;
        }
        // Intent: AGENDAR ORDEN DE TRABAJO
        else if (prompt.includes("orden") || (prompt.includes("agenda") && !prompt.includes("lote")) || prompt.includes("labor")) {
            responseMessage = "📝 Para agendar una orden de trabajo (siembra, aplicación, cosecha), por favor dirígete a la sección **'Órdenes'** en el menú principal. Todavía no puedo agendarlas automáticamente porque requieren que selecciones contratistas e insumos precisos.";
        }
        // Intent: SALUDO
        else if (prompt.includes("hola") || prompt.includes("saludo")) {
             responseMessage = "¡Hola! Soy AgroDAFF Assistant, tu experto en gestión. Puedes decirme cosas como: \n\n- *'¿Cómo viene el rendimiento?'*\n- *'Crea un lote llamado Sur de 100 hectáreas'* \n- *'¿Cuánto llevo gastado?'*";
        }
        // FALLBACK
        else {
             responseMessage = "Interesante pregunta. Aún estoy aprendiendo, ¿podrías reformularlo usando palabras como 'gastos', 'rendimiento', o pedirme 'crea un lote Sur de 50 has' explícitamente?";
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
