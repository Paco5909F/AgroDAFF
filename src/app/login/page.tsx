'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from 'sonner'
import { Loader2, Mail, ArrowLeft, CheckCircle2, Wrench, Phone } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
    const [isLogin, setIsLogin] = useState(true)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [nombre, setNombre] = useState('') // New State
    const [isPending, startTransition] = useTransition()
    const router = useRouter()
    const supabase = createClient()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        startTransition(async () => {
            if (isLogin) {
                // LOGIN FLOW
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                })
                if (error) {
                    toast.error('Error al iniciar sesión: ' + error.message)
                } else {
                    toast.success('Iniciando sesión...')
                    router.refresh()
                    router.push('/dashboard')
                }
            } else {
                // REGISTER FLOW
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                        data: {
                            full_name: nombre, // Passing full_name for trigger
                        }
                    }
                })
                if (error) {
                    toast.error('Error al registrarse: ' + error.message)
                } else {
                    toast.success('¡Registro exitoso! Verifique su correo.')
                }
            }
        })
    }

    const handleGoogleLogin = async () => {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${window.location.origin}/auth/callback`
            }
        })
        if (error) toast.error(error.message)
    }

    return (
        <div className="min-h-screen font-sans relative flex items-center justify-center p-4">

            {/* FULL SCREEN BACKGROUND (Matching Landing V8) */}
            <div className="absolute inset-0 z-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                    src="/images/bg-v2.png"
                    alt="Campo Argentino"
                    className="w-full h-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
            </div>

            {/* CENTRAL CARD */}
            <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row h-auto min-h-[600px] animate-in zoom-in-95 duration-500">

                {/* LEFT SIDE: BRANDING/INFO (40%) */}
                <div className="w-full md:w-[40%] bg-slate-900 p-8 flex flex-col justify-between text-white relative overflow-hidden">
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>

                    <div className="relative z-10">
                        <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-8 text-sm group">
                            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                            Volver al Inicio
                        </Link>

                        <div className="w-16 h-16 bg-white rounded-lg p-2 mb-6 shadow-md">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src="/images/logo.png" alt="Logo" className="w-full h-full object-contain" />
                        </div>
                        <h1 className="text-2xl font-bold tracking-tight uppercase leading-tight">
                            Agroservicios <br /> El Trisquel
                        </h1>
                        <div className="h-1 w-12 bg-yellow-500 mt-4 rounded-full"></div>
                    </div>

                    <div className="relative z-10 mt-8 space-y-4">
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-300">Gestión de lotes y órdenes.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-300">Facturación AFIP integrada.</p>
                        </div>
                        <div className="flex items-start gap-3">
                            <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                            <p className="text-sm text-slate-300">Reportes en tiempo real.</p>
                        </div>
                    </div>

                    {/* PUBLIC LINKS RECOVERED */}
                    <div className="relative z-10 mt-8 space-y-3">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Accesos Públicos</p>
                        <div className="grid grid-cols-2 gap-3">
                            <Link href="/servicios" className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                                <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-400 group-hover:text-yellow-300 transition-colors">
                                    <Wrench className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-slate-200 group-hover:text-white font-medium">Servicios</span>
                            </Link>
                            <Link href="/contacto" className="flex items-center gap-2 p-3 rounded-lg bg-white/5 hover:bg-white/10 transition-colors border border-white/5 group">
                                <div className="w-8 h-8 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:text-blue-300 transition-colors">
                                    <Phone className="w-4 h-4" />
                                </div>
                                <span className="text-sm text-slate-200 group-hover:text-white font-medium">Contacto</span>
                            </Link>
                        </div>
                    </div>

                    <div className="mt-8 pt-6 border-t border-white/10">
                        <p className="text-slate-500 text-[10px] font-medium tracking-widest uppercase">
                            Secure Access v2.0
                        </p>
                    </div>
                </div>

                {/* RIGHT SIDE: FORMS (60%) */}
                <div className="w-full md:w-[60%] p-8 md:p-12 bg-white flex flex-col justify-center">

                    <div className="mb-8 text-center md:text-left">
                        <h2 className="text-2xl font-bold text-slate-800">
                            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
                        </h2>
                        <p className="text-slate-500 mt-1">
                            {isLogin ? "Acceda a su panel de control." : "Únase a la plataforma de gestión."}
                        </p>
                    </div>

                    <div className="space-y-4">
                        <Button
                            variant="outline"
                            onClick={handleGoogleLogin}
                            className="w-full h-12 rounded-xl border-slate-200 bg-white text-slate-700 font-semibold hover:bg-slate-50 hover:border-slate-300 transition-all flex items-center justify-center gap-2 shadow-sm"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Continuar con Google
                        </Button>

                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t border-slate-200" />
                            </div>
                            <div className="relative flex justify-center text-xs uppercase">
                                <span className="bg-white px-2 text-slate-400 font-medium">O con correo</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {!isLogin && (
                                <div className="space-y-1 animate-in slide-in-from-left">
                                    <label className="text-xs font-bold text-slate-600 uppercase">Nombre Completo</label>
                                    <Input
                                        type="text"
                                        placeholder="Juan Pérez"
                                        value={nombre}
                                        onChange={(e) => setNombre(e.target.value)}
                                        required={!isLogin}
                                        className="h-11 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-green-500 transition-all font-medium"
                                    />
                                </div>
                            )}

                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Email</label>
                                <Input
                                    type="email"
                                    placeholder="nombre@empresa.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="h-11 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-green-500 transition-all font-medium"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-xs font-bold text-slate-600 uppercase">Contraseña</label>
                                <Input
                                    type="password"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    className="h-11 rounded-lg border-slate-200 bg-slate-50 focus:bg-white focus:border-green-500 transition-all font-medium"
                                />
                            </div>

                            <Button
                                type="submit"
                                disabled={isPending}
                                className="w-full h-12 rounded-lg bg-green-700 hover:bg-green-800 text-white font-bold shadow-md hover:shadow-lg transition-all"
                            >
                                {isPending ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <Mail className="mr-2 h-5 w-5" />}
                                {isLogin ? "INGRESAR" : "CREAR CUENTA"}
                            </Button>
                        </form>
                    </div>

                    <div className="mt-8 text-center text-sm">
                        <span className="text-slate-500">
                            {isLogin ? "¿No tiene una cuenta?" : "¿Ya tiene una cuenta?"}
                        </span>
                        <button
                            onClick={() => setIsLogin(!isLogin)}
                            className="ml-2 font-bold text-green-700 hover:underline"
                        >
                            {isLogin ? "Regístrese aquí" : "Inicie sesión"}
                        </button>
                    </div>

                </div>

            </div>
        </div>
    )
}
