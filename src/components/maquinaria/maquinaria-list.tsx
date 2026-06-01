'use client'

import { Tractor, Settings, Wrench, Clock, Search } from 'lucide-react'
import { hasPermission, PERMISSIONS } from '@/lib/permissions'
import { MaquinariaFormDialog } from './maquinaria-form-dialog'
import { MantenimientoFormDialog } from './mantenimiento-form-dialog'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'

interface MaquinariaListProps {
    data: any[]
    rol: string
}

export function MaquinariaList({ data, rol }: MaquinariaListProps) {
    const canEdit = hasPermission(rol, PERMISSIONS.MAQUINARIA, 'update')
    const [search, setSearch] = useState('')

    const filtered = data.filter(m => 
        m.nombre.toLowerCase().includes(search.toLowerCase()) || 
        m.tipo.toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="flex flex-col gap-6">
            <div className="relative max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input 
                    placeholder="Buscar maquinaria..." 
                    className="pl-9 bg-white" 
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {filtered.length === 0 ? (
                <div className="bg-white rounded-2xl p-8 text-center border border-slate-100">
                    <Tractor className="h-12 w-12 text-slate-300 mx-auto mb-3" />
                    <h3 className="text-lg font-medium text-slate-800">No se encontraron maquinarias</h3>
                    <p className="text-slate-500">Agregue tractores, cosechadoras o camiones a su flota.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {filtered.map(maq => (
                        <div key={maq.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${maq.estado === 'ACTIVA' ? 'bg-emerald-100 text-emerald-600' : 'bg-red-100 text-red-600'}`}>
                                            <Tractor className="h-6 w-6" />
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-slate-800 leading-none">{maq.nombre}</h3>
                                            <span className="text-xs text-slate-500 font-medium uppercase tracking-wider">{maq.tipo}</span>
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2 py-1 rounded-full font-bold ${maq.estado === 'ACTIVA' ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                                        {maq.estado}
                                    </span>
                                </div>
                                
                                <div className="grid grid-cols-2 gap-2 mt-4 text-sm text-slate-600">
                                    <div>
                                        <span className="text-xs text-slate-400 block mb-0.5">Marca/Modelo</span>
                                        <span className="font-medium text-slate-700">{maq.marca || '-'} {maq.modelo || ''}</span>
                                    </div>
                                    <div>
                                        <span className="text-xs text-slate-400 block mb-0.5">Patente</span>
                                        <span className="font-medium text-slate-700">{maq.patente || '-'}</span>
                                    </div>
                                    <div className="col-span-2 bg-slate-50 rounded-lg p-3 mt-2 flex items-center justify-between border border-slate-100">
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-slate-400" />
                                            <span className="text-xs text-slate-500 font-medium">Horas Motor</span>
                                        </div>
                                        <span className="font-bold text-slate-800">{Number(maq.horas_motor).toLocaleString('es-AR')} hs</span>
                                    </div>
                                </div>
                            </div>

                            {canEdit && (
                                <div className="flex gap-2 mt-4 pt-4 border-t border-slate-100">
                                    <MantenimientoFormDialog maquinariaId={maq.id} trigger={
                                        <Button variant="outline" className="flex-1 text-xs h-9 bg-amber-50 text-amber-700 hover:bg-amber-100 hover:text-amber-800 border-amber-200">
                                            <Wrench className="w-3 h-3 mr-1.5" /> Mantenimiento
                                        </Button>
                                    } />
                                    
                                    <MaquinariaFormDialog maquinaria={maq} trigger={
                                        <Button variant="ghost" size="icon" className="h-9 w-9 text-slate-400 hover:text-blue-600 hover:bg-blue-50 shrink-0">
                                            <Settings className="w-4 h-4" />
                                        </Button>
                                    } />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}
