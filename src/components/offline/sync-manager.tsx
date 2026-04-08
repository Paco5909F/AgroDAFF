'use client'

import { useEffect, useState, useCallback, useRef } from 'react'
import { getOfflineDB, PendingAction } from '@/lib/offline/db'
import { toast } from 'sonner'
import { createOrden, updateOrden } from '@/server/ordenes' // The server action

export function OfflineSyncManager() {
  const isSyncingRef = useRef(false)
  const [isSyncingUI, setIsSyncingUI] = useState(false)
  const [isOnline, setIsOnline] = useState(true)

  // Polling offline DB and resyncing
  const syncPendingActions = useCallback(async () => {
    if (typeof window === 'undefined' || !navigator.onLine || isSyncingRef.current) return;
    
    const db = getOfflineDB();
    if (!db) return;

    isSyncingRef.current = true;
    setIsSyncingUI(true);
    let syncedCount = 0;

    try {
      // Find all pending
      const pending = await db.pendingActions.where('status').equals('pending').toArray();
      
      if (pending.length > 0) {
        toast.info("⏳ Intentando sincronizar datos creados sin conexión...");
        
        for (const action of pending) {
          try {
            await db.pendingActions.update(action.id!, { status: 'syncing' });

            if (action.action === 'CREATE_ORDEN') {
              const res = await createOrden(action.payload);
              if (res.success) {
                await db.pendingActions.delete(action.id!);
                syncedCount++;
              } else {
                throw new Error("Validation Error: " + JSON.stringify(res.error));
              }
            } else if (action.action === 'UPDATE_ORDEN' as any) {
              const res = await updateOrden(action.payload.id, action.payload.data);
              if (res.success) {
                await db.pendingActions.delete(action.id!);
                syncedCount++;
              } else {
                throw new Error("Validation Error: " + JSON.stringify(res.error));
              }
            }

          } catch (e: any) {
             console.error("Fallo al sincronizar un item local:", e);
             await db.pendingActions.update(action.id!, { 
                 status: 'failed', 
                 error: e.message || 'Unknown server error' 
             });
          }
        }
        
        if (syncedCount > 0) {
            toast.success(`✅ Sincronización offline exitosa! (${syncedCount} elementos subidos)`);
        }
      }

    } catch (err) {
      console.error("General Sync Error", err);
    } finally {
      isSyncingRef.current = false;
      setIsSyncingUI(false);
    }

  }, []);

  useEffect(() => {
    const handleOnline = () => {
        setIsOnline(true);
        toast.success("🌐 Conexión restaurada, sincronizando en background...");
        syncPendingActions();
    };
    
    const handleOffline = () => {
        setIsOnline(false);
        toast.warning("📵 Sin red. El sistema guardará tus próximos cambios localmente.", { duration: 5000 });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Initial check
    setIsOnline(navigator.onLine);
    if (navigator.onLine) {
        syncPendingActions();
    }

    return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
    }
  }, [syncPendingActions]);

  // Network Status indicator pill
  return (
      <div className="fixed top-1 left-[50%] translate-x-[-50%] z-[60]">
         {!isOnline && (
            <div className="bg-amber-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center justify-center gap-2 animate-in slide-in-from-top-4">
              <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
              Offline - Guardado Seguro Activado
            </div>
         )}
         {isSyncingUI && (
             <div className="bg-blue-500 text-white px-3 py-1 text-xs font-bold rounded-full shadow-lg flex items-center justify-center gap-2 animate-in slide-in-from-top-4">
               <span className="w-2 h-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
               Sincronizando al Backend...
             </div>
         )}
      </div>
  )
}
