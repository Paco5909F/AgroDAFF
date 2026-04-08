import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Phone, Tractor, Wheat, Truck } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function PublicServiciosPage() {
    const services = [
        {
            title: "Servicio de Cosecha",
            subtitle: "Recolección de Precisión",
            description: "Tecnología de punta para la recolección de sus cultivos. Contamos con maquinaria moderna que garantiza eficiencia, menor pérdida y mayor calidad de grano.",
            image: "/images/services/real_cosecha.jpg",
            icon: <Wheat className="w-6 h-6" />,
            color: "emerald",
            features: ["Monitores de rendimiento", "Mapeo en tiempo real", "Cabezales de última generación"]
        },
        {
            title: "Embolsado de Granos",
            subtitle: "Almacenamiento Seguro",
            description: "Sistema de almacenamiento flexible y seguro. Proteja su producción en el lote con nuestro servicio de embolsado profesional.",
            image: "/images/services/servicio_embolsado.png",
            icon: <Tractor className="w-6 h-6" />,
            color: "amber",
            features: ["Embolsadoras de alta capacidad", "Cuidado del grano", "Personal capacitado"]
        },
        {
            title: "Transporte de Cargas",
            subtitle: "Logística Integral",
            description: "Logística integral para su producción. Flota propia y tercerizada para mover su cosecha a puerto o acopio con total seguridad.",
            image: "/images/services/real_transporte.jpg",
            icon: <Truck className="w-6 h-6" />,
            color: "blue",
            features: ["Seguimiento satelital", "Unidades modernas", "Disponibilidad garantizada"]
        }
    ]

    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            {/* HEADER - HORIZONTAL DESIGN */}
            <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm h-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">

                    <div className="flex items-center gap-4">
                        <Link href="/login" className="group p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-700" />
                        </Link>

                        <div className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg shadow-emerald-100 transition-transform group-hover:scale-105 bg-white p-0.5 border border-emerald-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/logo-agrodaff.jpg" alt="Trisquel Logo" className="object-contain w-full h-full" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-800 leading-tight tracking-tight group-hover:text-emerald-700 transition-colors">AgroDAFF</span>
                                <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase">Agroservicios</span>
                            </div>
                        </div>
                    </div>

                    {/* Right: Contact */}
                    <Link href="/contacto">
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium">
                            <Phone className="w-4 h-4 mr-2" />
                            Contacto
                        </Button>
                    </Link>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center space-y-2">
                    <p className="text-sm font-bold tracking-[0.3em] text-slate-400 uppercase">
                        Agroservicios AgroDAFF
                    </p>
                    <h1 className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight mb-4">
                        Nuestros <span className="font-serif italic text-emerald-600">Servicios</span>
                    </h1>
                    <p className="text-xl text-slate-500 font-light max-w-2xl mx-auto pt-4">
                        Soluciones integrales para el ciclo productivo, con la misma calidad y compromiso que nos caracteriza.
                    </p>
                </div>
            </section>

            {/* SERVICES GRID */}
            <section className="pb-20 px-4 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {services.map((service, index) => (
                        <Card
                            key={index}
                            className={`border shadow-sm bg-white relative overflow-hidden group hover:shadow-md transition-all duration-300 animate-in fade-in zoom-in-95 duration-500 delay-${index * 100}
                        ${service.color === 'emerald' ? 'hover:border-emerald-300' : ''}
                        ${service.color === 'amber' ? 'hover:border-amber-300' : ''}
                        ${service.color === 'blue' ? 'hover:border-blue-300' : ''}
                    `}
                        >
                            {/* Top Color Strip */}
                            <div className={`absolute top-0 left-0 w-full h-1 
                        ${service.color === 'emerald' ? 'bg-emerald-500' : ''}
                        ${service.color === 'amber' ? 'bg-amber-500' : ''}
                        ${service.color === 'blue' ? 'bg-blue-500' : ''}
                    `}></div>

                            {/* Image Area */}
                            <div className="aspect-video w-full overflow-hidden bg-slate-100 relative">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className={`w-full h-full object-cover transition-transform duration-700 
                                        ${service.title.includes('Transporte') ? 'object-left' : 'transform group-hover:scale-105'}
                                    `}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-60"></div>
                                <div className="absolute bottom-4 left-4 text-white">
                                    <p className="text-xs font-medium uppercase tracking-wider opacity-90">{service.subtitle}</p>
                                </div>
                            </div>

                            <CardHeader className="pb-3">
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-xl font-bold text-slate-800">{service.title}</CardTitle>
                                    <div className={`p-2 rounded-lg 
                                ${service.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : ''}
                                ${service.color === 'amber' ? 'bg-amber-50 text-amber-600' : ''}
                                ${service.color === 'blue' ? 'bg-blue-50 text-blue-600' : ''}
                             `}>
                                        {service.icon}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent>
                                <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                                    {service.description}
                                </p>

                                <div className="space-y-3 pt-4 border-t border-slate-100">
                                    {service.features.map((feature, i) => (
                                        <div key={i} className="flex items-center gap-2 text-sm text-slate-600 font-medium">
                                            <CheckCircle2 className={`w-4 h-4 
                                        ${service.color === 'emerald' ? 'text-emerald-500' : ''}
                                        ${service.color === 'amber' ? 'text-amber-500' : ''}
                                        ${service.color === 'blue' ? 'text-blue-500' : ''}
                                    `} />
                                            {feature}
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </section>


        </div >
    )
}
