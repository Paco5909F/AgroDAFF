'use client'

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Wheat, Package } from "lucide-react"

interface StockOverviewProps {
    stock: Record<string, number>
}

export function StockOverview({ stock }: StockOverviewProps) {
    const products = Object.entries(stock).filter(([_, qty]) => qty > 0)

    // Sort slightly to put most volume first if needed, or keep order
    // products.sort((a, b) => b[1] - a[1])

    return (
        <Card className="h-full border shadow-none border-slate-200 bg-white relative overflow-hidden group hover:border-indigo-300 hover:shadow-md transition-all duration-300">
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <CardContent className="p-5 flex flex-col h-full pl-7">
                <div className="flex justify-between items-start mb-4">
                    <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-xl">
                        <Wheat className="h-6 w-6" />
                    </div>
                </div>

                <div className="flex-1">
                    <p className="text-sm font-medium text-slate-500 mb-2">Stock en Silo</p>

                    {products.length === 0 ? (
                        <div>
                            <h3 className="text-2xl md:text-3xl font-bold text-slate-300 tracking-tight">
                                0 <span className="text-lg font-normal text-slate-400">Tn</span>
                            </h3>
                            <p className="text-xs text-slate-400 mt-1">Sin cereal en acopio</p>
                        </div>
                    ) : (
                        <div className="space-y-3 mt-1">
                            {products.slice(0, 3).map(([prod, qty]) => (
                                <div key={prod} className="flex justify-between items-end border-b border-indigo-50 pb-1 last:border-0">
                                    <span className="text-sm text-slate-600 font-medium">{prod}</span>
                                    <span className="text-lg font-bold text-slate-800">
                                        {qty.toLocaleString('es-AR', { maximumFractionDigits: 0 })} <span className="text-xs font-normal text-slate-400">Tn</span>
                                    </span>
                                </div>
                            ))}
                            {products.length > 3 && (
                                <p className="text-xs text-indigo-500 text-center pt-1 font-medium">
                                    + {products.length - 3} más...
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
