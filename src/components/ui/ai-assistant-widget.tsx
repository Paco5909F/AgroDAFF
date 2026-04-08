'use client'

import { useState, useRef, useEffect } from 'react'
import { Bot, Send, X, MessageSquare, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export function AIAssistantWidget() {
    const [isOpen, setIsOpen] = useState(false)
    const [input, setInput] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const [messages, setMessages] = useState<{ role: 'user' | 'ai', content: string }[]>([
        { role: 'ai', content: '¡Hola! Soy la IA de AgroDAFF. Consultame por tus costos, sugerencias o análisis de campaña actual.' }
    ])

    const messagesEndRef = useRef<HTMLDivElement>(null)

    // Auto-scroll to bottom of chat
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
        }
    }, [messages, isOpen])

    const handleSend = async () => {
        if (!input.trim()) return;

        const userMsg = input;
        setInput('');
        setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/ai-assistant', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ prompt: userMsg })
            });

            const data = await res.json();

            if (data.success) {
                setMessages(prev => [...prev, { role: 'ai', content: data.message }]);
            } else {
                setMessages(prev => [...prev, { role: 'ai', content: '❌ Oops... No pude procesar esa orden en este momento.' }]);
            }
        } catch (e) {
            setMessages(prev => [...prev, { role: 'ai', content: '⚠️ Error de red. Intenta más tarde.' }]);
        } finally {
            setIsLoading(false);
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleSend();
        }
    }

    return (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
            {isOpen && (
                <div className="mb-4 w-80 sm:w-96 min-h-[400px] max-h-[500px] bg-background/95 backdrop-blur-md rounded-2xl shadow-2xl border border-border flex flex-col overflow-hidden animate-in slide-in-from-bottom-5">
                    {/* Header */}
                    <div className="p-4 bg-primary/10 border-b border-border flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary overflow-hidden">
                            <Bot className="w-5 h-5 flex-shrink-0" />
                            <span className="font-semibold truncate">AgroDAFF AI</span>
                        </div>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-background/20" onClick={() => setIsOpen(false)}>
                            <X className="w-4 h-4" />
                        </Button>
                    </div>

                    {/* Chat Box */}
                    <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3">
                        {messages.map((m, i) => (
                            <div key={i} className={cn("max-w-[85%] rounded-lg p-3 text-sm",
                                m.role === 'ai'
                                    ? "bg-muted text-foreground self-start rounded-tl-none border border-border/50"
                                    : "bg-primary text-primary-foreground self-end rounded-tr-none shadow-sm"
                            )}>
                                {/* Basic markdown bold support for rendering prices */}
                                {m.content.split('**').map((part, pidx) => pidx % 2 === 1 ? <strong key={pidx}>{part}</strong> : part)}
                            </div>
                        ))}
                        {isLoading && (
                            <div className="bg-muted text-foreground self-start rounded-lg rounded-tl-none border border-border/50 p-3 max-w-[85%] flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin text-muted-foreground" />
                                <span className="text-xs text-muted-foreground italic">Cerebro analizando la DB...</span>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Input Area */}
                    <div className="p-3 bg-card border-t border-border flex gap-2">
                        <input
                            type="text"
                            className="flex-1 bg-background border border-input rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
                            placeholder="Preguntame sobre tus lotes..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                        <Button onClick={handleSend} disabled={!input.trim() || isLoading} className="rounded-full w-10 h-10 p-0 flex-shrink-0 shadow-sm" variant="default">
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            )}

            <Button
                onClick={() => setIsOpen(!isOpen)}
                className={cn(
                    "rounded-full w-14 h-14 shadow-2xl transition-all duration-300",
                    isOpen ? "rotate-90 scale-0 opacity-0" : "rotate-0 scale-100 bg-primary hover:bg-primary/90 text-primary-foreground"
                )}
            >
                <Bot className="w-6 h-6 absolute" />
            </Button>

            {/* Visual indicator (optional ping) */}
            {!isOpen && messages.length === 1 && (
                <span className="absolute top-0 right-0 flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                </span>
            )}
        </div>
    )
}
