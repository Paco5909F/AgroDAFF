import Link from 'next/link'
import { ArrowLeft, CheckCircle2, Phone, Mail, MapPin, Code2 } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"

export default function ContactoPage() {
    return (
        <div className="min-h-screen bg-slate-50/50 font-sans">
            {/* HEADER - MATCHING SERVICES PAGE */}
            <header className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-sm border-b border-slate-100 shadow-sm h-20 transition-all duration-300">
                <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/login" className="group p-2 -ml-2 rounded-full hover:bg-slate-100 transition-colors">
                            <ArrowLeft className="w-5 h-5 text-slate-400 group-hover:text-slate-700" />
                        </Link>

                        <div className="flex items-center gap-3 group">
                            <div className="relative w-10 h-10 overflow-hidden rounded-xl shadow-lg shadow-emerald-100 transition-transform group-hover:scale-105 bg-white p-0.5 border border-emerald-50">
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img src="/images/logo-agrodaff.png" alt="AgroDAFF Logo" className="object-contain w-full h-full" />
                            </div>
                            <div className="flex flex-col">
                                <span className="text-lg font-bold text-slate-800 leading-tight tracking-tight group-hover:text-emerald-700 transition-colors">AgroDAFF</span>
                                <span className="text-[10px] font-bold text-emerald-600 tracking-[0.2em] uppercase">Tecnología SaaS</span>
                            </div>
                        </div>
                    </div>

                    <Link href="/servicios">
                        <Button variant="ghost" size="sm" className="hidden sm:flex text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 font-medium">
                            <CheckCircle2 className="w-4 h-4 mr-2" />
                            Servicios
                        </Button>
                    </Link>
                </div>
            </header>

            {/* HERO SECTION */}
            <section className="pt-32 pb-12 px-4 max-w-7xl mx-auto">
                <div className="mb-8 animate-in fade-in slide-in-from-bottom-4 duration-700 text-center space-y-2">
                    <p className="text-sm font-bold tracking-[0.3em] text-slate-400 uppercase">
                        Estamos cerca
                    </p>
                    <h1 className="text-4xl md:text-6xl font-light text-slate-900 tracking-tight mb-4">
                        Canales de <span className="font-serif italic text-emerald-600">Contacto</span>
                    </h1>
                </div>
            </section>

            {/* CONTACT CARDS GRID */}
            <section className="pb-20 px-4 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* COMPANY INFO CARD */}
                    <Card className="border-emerald-100/50 shadow-lg shadow-emerald-50/50 bg-white relative overflow-hidden group hover:shadow-xl transition-all duration-300 md:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500"></div>
                        <CardHeader className="pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
                                <Phone className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl font-bold text-slate-800">Contacto Comercial</CardTitle>
                            <CardDescription className="text-slate-500">Ventas y Administración</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <MapPin className="w-5 h-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-slate-700">Buenos Aires, Argentina</p>
                                    <p className="text-sm text-slate-400">Oficina Virtual</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <Phone className="w-5 h-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-slate-700">+54 9 2364 610322</p>
                                    <p className="text-sm text-slate-400">Lunes a Viernes</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                                <Mail className="w-5 h-5 text-emerald-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-slate-700 break-all">contacto@agrodaff.com</p>
                                    <p className="text-sm text-slate-400">Email Corporativo</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* DEVELOPER INFO CARD */}
                    <Card className="border-slate-200 shadow-sm bg-slate-50/50 relative overflow-hidden group hover:shadow-md transition-all duration-300 md:col-span-2 lg:col-span-1">
                        <div className="absolute top-0 left-0 w-full h-1 bg-slate-400"></div>
                        <CardHeader className="pb-4">
                            <div className="w-12 h-12 rounded-2xl bg-white text-slate-600 flex items-center justify-center mb-4 shadow-sm border border-slate-100">
                                <Code2 className="w-6 h-6" />
                            </div>
                            <CardTitle className="text-xl font-bold text-slate-800">Soporte Técnico</CardTitle>
                            <CardDescription className="text-slate-500">Desarrollo y Mantenimiento del Sistema</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="p-4 bg-white rounded-xl border border-slate-100">
                                <p className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-1">Desarrollado por</p>
                                <p className="text-lg font-bold text-slate-800">Joaquín Rosas</p>
                            </div>

                            <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-white transition-colors">
                                <Mail className="w-5 h-5 text-slate-500 mt-0.5" />
                                <div>
                                    <p className="font-medium text-slate-700">jooaqor@gmail.com</p>
                                    <p className="text-sm text-slate-400">Soporte y Consultas Técnicas</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                </div>
            </section>
        </div>
    )
}
