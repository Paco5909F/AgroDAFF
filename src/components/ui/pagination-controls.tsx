
'use client'

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

interface PaginationControlsProps {
    currentPage: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

export function PaginationControls({
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
}: PaginationControlsProps) {
    const router = useRouter()
    const searchParams = useSearchParams()

    const handlePageChange = (newPage: number) => {
        const params = new URLSearchParams(searchParams)
        params.set("page", newPage.toString())
        router.push(`?${params.toString()}`)
    }

    if (totalPages <= 1) return null;

    return (
        <div className="flex items-center justify-between px-2 py-4">
            <div className="text-sm text-muted-foreground hidden sm:block">
                Página <span className="font-medium">{currentPage}</span> de{" "}
                <span className="font-medium">{totalPages}</span>
            </div>

            <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!hasPrevPage}
                >
                    <ChevronLeft className="h-4 w-4 mr-2" />
                    Anterior
                </Button>

                <div className="text-sm text-muted-foreground sm:hidden">
                    {currentPage} / {totalPages}
                </div>

                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNextPage}
                >
                    Siguiente
                    <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
            </div>
        </div>
    )
}
