import Link from "next/link"
import { redirect } from "next/navigation"
import { LayoutDashboard, UserCircle2, Wrench, Mail, ArrowRight, Wheat, Tractor, BarChart3, FileSpreadsheet, ShieldCheck, Truck } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="min-h-screen font-sans bg-background text-foreground">



      {/* HERO SECTION */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/bg-v2.png" alt="Campo Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-white/40 to-white"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 text-xs font-semibold uppercase tracking-wider mb-6">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Nuevo: Gestión Multi-Empresa
          </div>
          <h1 className="text-4xl lg:text-6xl font-extrabold text-slate-900 leading-[1.1] mb-6 tracking-tight">
            El Sistema Operativo para <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
              Acopios y Agroservicios
            </span>
          </h1>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Gestione clientes, órdenes de trabajo, stocks de silos y logística desde una única plataforma en la nube. Simple, potente y diseñado para el campo argentino.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href={user ? "/dashboard" : "/login?view=sign_up"} className="w-full sm:w-auto px-8 py-3.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-semibold text-lg shadow-lg hover:shadow-emerald-200 transition-all flex items-center justify-center gap-2">
              {user ? "Ir a mi Panel" : "Probar Gratis 14 Días"}
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="#features" className="w-full sm:w-auto px-8 py-3.5 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 rounded-lg font-semibold text-lg shadow-sm hover:shadow-md transition-all">
              Ver Características
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center gap-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-200">
            {/* Social Proof / Trust Badges */}
            <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm bg-slate-100 px-4 py-2 rounded-full shadow-sm">
              <ShieldCheck className="w-5 h-5 text-emerald-600" /> Datos Encriptados
            </div>
            <div className="flex items-center gap-2 text-slate-600 font-semibold text-sm bg-slate-100 px-4 py-2 rounded-full shadow-sm">
              <Wheat className="w-5 h-5 text-amber-500" /> +50.000 Hectáreas Gestionadas
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES GRID */}
      <section id="features" className="py-20 bg-slate-50 border-t border-slate-200">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Todo lo que necesita para crecer</h2>
            <p className="text-slate-600">Deje las planillas de cálculo. Pase al siguiente nivel de profesionalización.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<FileSpreadsheet className="w-6 h-6 text-blue-600" />}
              title="Órdenes y Presupuestos"
              description="Genere documentos profesionales con su logo en segundos. Seguimiento de estados y facturación."
            />
            <FeatureCard
              icon={<Tractor className="w-6 h-6 text-emerald-600" />}
              title="Control de Labores"
              description="Registro detallado de siembra, cosecha y pulverización por lote y campaña."
            />
            <FeatureCard
              icon={<Truck className="w-6 h-6 text-indigo-600" />}
              title="Logística y Silos"
              description="Administre cartas de porte y stocks físicos en planta, celda o silobolsa en tiempo real."
            />
            <FeatureCard
              icon={<LayoutDashboard className="w-6 h-6 text-amber-600" />}
              title="Tablero de Control"
              description="Métricas clave de su negocio en una sola pantalla. Tome decisiones basadas en datos."
            />
            <FeatureCard
              icon={<UserCircle2 className="w-6 h-6 text-purple-600" />}
              title="Gestión de Equipo"
              description="Invite a encargados, maquinistas y administrativos con roles y permisos específicos."
            />
            <FeatureCard
              icon={<BarChart3 className="w-6 h-6 text-rose-600" />}
              title="Multi-Empresa"
              description="¿Administra varios campos o sociedades? Gestione todo desde una sola cuenta."
            />
          </div>
        </div>
      </section>

      {/* PRICING PREVIEW */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="bg-slate-900 rounded-2xl overflow-hidden p-8 md:p-12 relative">
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8 text-center md:text-left">
              <div className="max-w-xl text-white">
                <h2 className="text-3xl font-bold mb-4">Plan Profesional</h2>
                <p className="text-slate-300 text-lg mb-6">
                  Acceda a todas las funciones sin límites. Soporte prioritario y actualizaciones semanales.
                </p>
                <ul className="space-y-2 text-slate-300 mb-8 inline-block text-left">
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Usuarios Ilimitados</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Múltiples Establecimientos</li>
                  <li className="flex items-center gap-2"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Soporte WhatsApp Directo</li>
                </ul>
                <div className="text-3xl font-bold text-emerald-400 md:hidden">
                  $25.000 <span className="text-sm font-normal text-slate-400">/mes</span>
                </div>
              </div>
              <div className="bg-white p-6 rounded-xl shadow-xl w-full max-w-sm text-center">
                <div className="text-sm text-slate-500 uppercase tracking-wide font-semibold mb-2">Precio Estándar</div>
                <div className="text-4xl font-extrabold text-slate-900 mb-4">
                  $25.000 <span className="text-base font-normal text-slate-500">/mes</span>
                </div>
                <Link href="/pricing" className="block w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold transition-all">
                  Ver Planes
                </Link>
                <p className="text-xs text-slate-500 mt-4">
                  IVA incluido. Cancelación en cualquier momento.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-50 border-t border-slate-200 py-12">
        <div className="container mx-auto px-6 flex flex-col items-center gap-6 text-center">
          <div className="text-sm text-slate-500">
            © {new Date().getFullYear()} El Trisquel Agroservicios. Todos los derechos reservados.
          </div>
          <div className="flex gap-6 justify-center">
            <Link href="/contacto" className="text-sm text-slate-600 hover:text-emerald-600">Contacto</Link>
            <Link href="/politica" className="text-sm text-slate-600 hover:text-emerald-600">Política de Privacidad</Link>
            <Link href="/terminos" className="text-sm text-slate-600 hover:text-emerald-600">Términos de Uso</Link>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <div className="bg-white p-6 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all hover:-translate-y-1">
      <div className="w-12 h-12 rounded-lg bg-slate-50 flex items-center justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-600 text-sm leading-relaxed">{description}</p>
    </div>
  )
}
