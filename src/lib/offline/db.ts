import Dexie, { type Table } from 'dexie';

export interface PendingAction {
  id?: number;
  idempotencyKey: string;
  action: 'CREATE_ORDEN' | 'CREATE_CLIENTE' | 'UPDATE_LOTE';
  payload: any;
  status: 'pending' | 'syncing' | 'failed';
  error?: string;
  createdAt: number;
}

export interface LocalLote {
  id: string;
  nombre: string;
  hectareas: number;
}

export interface LocalInsumo {
  id: string;
  nombre: string;
  unidad: string;
}

export class AgroDaffOfflineDB extends Dexie {
  pendingActions!: Table<PendingAction, number>;
  lotesStore!: Table<LocalLote, string>;
  insumosStore!: Table<LocalInsumo, string>;

  constructor() {
    super('AgroDaffDB');
    this.version(1).stores({
      pendingActions: '++id, idempotencyKey, action, status, createdAt',
      lotesStore: 'id, nombre',
      insumosStore: 'id, nombre'
    });
  }
}

let dbInstance: AgroDaffOfflineDB;

export function getOfflineDB() {
  if (typeof window === 'undefined') return null; // Avoid running on Server
  if (!dbInstance) {
    dbInstance = new AgroDaffOfflineDB();
  }
  return dbInstance;
}
