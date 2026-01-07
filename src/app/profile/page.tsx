import { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { getUserProfile } from '@/server/usuarios'
import { Contact } from 'lucide-react'
import { ProfileForm } from '@/components/profile/profile-form'

export const metadata: Metadata = {
    title: 'Mi Perfil | Trisquel',
    description: 'Administrar cuenta de usuario',
}

export default async function ProfilePage() {
    const profile = await getUserProfile()

    if (!profile.success || !profile.data) {
        redirect('/login')
    }

    return (
        <div className="flex-1 space-y-4">
            <div className="flex items-center justify-between space-y-2">
                <div>
                    <h1 className="text-3xl font-light text-slate-800 tracking-tight flex items-center gap-3">
                        <Contact className="h-8 w-8 text-slate-400" />
                        Mi Perfil
                    </h1>
                    <p className="text-slate-500 font-light mt-1">Gestione su información personal y preferencias de seguridad.</p>
                </div>
            </div>
            <ProfileForm user={profile.data} />
        </div>
    )
}

