
// Inventory hook'undan InventoryItem türünü export et
export type { InventoryItem } from '@/hooks/useInventory';

// Örnek veriler kaldırıldı - kullanıcılar kendi verilerini ekleyecek
export const mockInventory: any[] = [];

// Eski fixedAssets export'unu kaldır ve yeni türle değiştir
export const fixedAssets: InventoryItem[] = [];
