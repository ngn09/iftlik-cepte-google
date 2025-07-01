
// FeedStock hook'undan FeedStockItem türünü export et
export type { FeedStockItem } from '@/hooks/useFeedStock';

// Eski FeedItem türünü yeni türle değiştir
export type FeedItem = FeedStockItem;

// Örnek veriler kaldırıldı - kullanıcılar kendi verilerini ekleyecek
export const mockFeedStock: FeedStockItem[] = [];
