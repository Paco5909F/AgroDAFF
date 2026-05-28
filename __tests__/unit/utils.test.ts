import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('utils', () => {
    describe('cn()', () => {
        it('should merge tailwind classes properly', () => {
            const result = cn('bg-red-500', 'bg-blue-500')
            expect(result).toBe('bg-blue-500')
        })

        it('should handle conditional classes', () => {
            const isActive = true
            const result = cn('base-class', isActive && 'active-class')
            expect(result).toBe('base-class active-class')
        })
    })
})
