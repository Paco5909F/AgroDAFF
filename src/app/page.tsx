import Link from "next/link"
import { LayoutDashboard, UserCircle2, Wrench, Mail, ArrowRight } from "lucide-react"
import { createClient } from "@/lib/supabase/server"

export default async function LandingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen font-sans relative flex items-center justify-center p-4">

      {/* 
        FULL SCREEN BACKGROUND
        Crystal clear image covering the entire viewport.
      */}
      <div className="absolute inset-0 z-0">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/images/field_background.png"
          alt="Campo Argentino"
          className="w-full h-full object-cover object-center"
        />
        {/* Very light overlay to ensure card pops, but background remains visible and sharp */}
        <div className="absolute inset-0 bg-black/20"></div>
      </div>

      {/* 
        CENTRAL PORTAL CARD 
        White/Glass container for the Corporate ERP feel.
      */}
      <div className="relative z-10 w-full max-w-4xl bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row animate-in zoom-in-95 duration-500">

        {/* LEFT SIDE: BRANDING (35%) */}
        <div className="w-full lg:w-[35%] bg-slate-900 p-6 lg:p-8 flex flex-col justify-between text-white relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

          <div className="relative z-10">
            <div className="w-16 h-16 bg-white rounded-lg p-2 mb-6 shadow-md">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight uppercase leading-tight">
              Agroservicios <br /> El Trisquel
            </h1>
            <div className="h-1 w-12 bg-yellow-500 mt-4 rounded-full"></div>
          </div>

          <div className="relative z-10 mt-8 md:mt-0">
            <p className="text-slate-400 text-xs font-medium uppercase tracking-widest">
              Portal de Gestión
            </p>
            <p className="text-slate-500 text-[10px] mt-1">
              v2.0.0 • O'Higgins
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: TILES GRID (65%) */}
        <div className="w-full lg:w-[65%] p-5 lg:p-8 bg-slate-50">

          <div className="mb-6">
            <h2 className="text-xl font-bold text-slate-800">
              {user ? `Hola, ${user.email?.split('@')[0]}` : "Bienvenido"}
            </h2>
            <p className="text-sm text-slate-500">
              Seleccione un módulo para comenzar:
            </p>
          </div>

          <div className="grid gap-4">

            {/* PRIMARY: ACCESO */}
            <Link href={user ? "/dashboard" : "/login"} className="group">
              <div className="bg-white border border-slate-200 hover:border-green-500 hover:ring-1 hover:ring-green-500/20 rounded-xl p-5 shadow-sm transition-all flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center text-green-700 group-hover:bg-green-600 group-hover:text-white transition-colors">
                    {user ? <LayoutDashboard className="w-6 h-6" /> : <UserCircle2 className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-green-700">
                      {user ? "Ir al Dashboard" : "Ingreso al Sistema"}
                    </h3>
                    <p className="text-xs text-slate-500">
                      Acceso seguro a operaciones y reportes.
                    </p>
                  </div>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
              </div>
            </Link>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* SERVICES TILE */}
              <button className="bg-white border border-slate-200 hover:border-yellow-400 rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-yellow-50 flex items-center justify-center text-yellow-600 group-hover:bg-yellow-100 transition-colors">
                  <Wrench className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Servicios</h4>
                  <p className="text-[10px] text-slate-500 leading-tight mt-1">Catálogo de labores.</p>
                </div>
              </button>

              {/* CONTACT TILE */}
              <button className="bg-white border border-slate-200 hover:border-blue-400 rounded-xl p-4 shadow-sm hover:shadow-md transition-all text-left flex flex-col gap-3 group">
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-blue-100 transition-colors">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-slate-900">Contacto</h4>
                  <p className="text-[10px] text-slate-500 leading-tight mt-1">Soporte y Ventas.</p>
                </div>
              </button>
            </div>

          </div>
        </div>

      </div>

    </div>
  )
}
