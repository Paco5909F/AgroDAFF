// src/lib/logger.ts

export type LogLevel = 'info' | 'warn' | 'error' | 'security' | 'perf';

interface LogPayload {
    level: LogLevel;
    message: string;
    context?: string;
    tenantId?: string | null;
    userId?: string | null;
    metadata?: Record<string, any>;
    durationMs?: number;
    timestamp: string;
}

class Logger {
    private isProd = process.env.NODE_ENV === 'production';

    private format(payload: LogPayload): string {
        const { timestamp, level, context, message, tenantId, userId, metadata, durationMs } = payload;
        
        let colorStart = '';
        const colorEnd = '\x1b[0m';
        
        switch (level) {
            case 'info': colorStart = '\x1b[36m'; break; // Cyan
            case 'warn': colorStart = '\x1b[33m'; break; // Yellow
            case 'error': colorStart = '\x1b[31m'; break; // Red
            case 'security': colorStart = '\x1b[41;37m'; break; // Red Background + White Text
            case 'perf': colorStart = '\x1b[35m'; break; // Magenta
        }

        const tenantData = tenantId ? `[TENANT: ${tenantId}]` : '[NO-TENANT]';
        const perfData = durationMs ? ` [${durationMs}ms]` : '';
        const metaStr = metadata ? ` | Meta: ${JSON.stringify(metadata)}` : '';

        return `${colorStart}[${timestamp}] [${level.toUpperCase()}] [CTX: ${context || 'GLOBAL'}] ${tenantData} ${message}${perfData}${metaStr}${colorEnd}`;
    }

    private emit(level: LogLevel, message: string, params?: { context?: string, tenantId?: string | null, userId?: string | null, metadata?: any, durationMs?: number }) {
        const payload: LogPayload = {
            level,
            message,
            timestamp: new Date().toISOString(),
            ...params
        };

        const formattedMessage = this.format(payload);

        // In production, we might want to send this to Datadog, Sentry, or standard out.
        if (level === 'error' || level === 'security') {
            console.error(formattedMessage);
        } else if (level === 'warn') {
            console.warn(formattedMessage);
        } else {
            console.log(formattedMessage);
        }
    }

    info(message: string, params?: Parameters<typeof this.emit>[2]) {
        this.emit('info', message, params);
    }
    
    warn(message: string, params?: Parameters<typeof this.emit>[2]) {
        this.emit('warn', message, params);
    }
    
    error(message: string, params?: Parameters<typeof this.emit>[2]) {
        this.emit('error', message, params);
    }

    security(message: string, params?: Parameters<typeof this.emit>[2]) {
        this.emit('security', message, params);
    }

    perf(message: string, durationMs: number, params?: Omit<NonNullable<Parameters<typeof this.emit>[2]>, 'durationMs'>) {
        this.emit('perf', message, { ...params, durationMs });
    }
}

export const logger = new Logger();
