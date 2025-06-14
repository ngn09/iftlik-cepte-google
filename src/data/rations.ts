
import { FeedItem } from "./feedStock";

export interface AnimalGroup {
  id: number;
  name: string;
  animalCount: number;
}

export interface RationItem {
  feedStockId: number;
  amount: number;
}

export interface Ration {
  id: number;
  animalGroupId: number;
  name:string;
  items: RationItem[];
}

export const animalGroups: AnimalGroup[] = [
  { id: 1, name: 'Sağmal İnekler (Yüksek Verim)', animalCount: 50 },
  { id: 2, name: 'Sağmal İnekler (Orta Verim)', animalCount: 75 },
  { id: 3, name: 'Kuru Dönem İnekler', animalCount: 20 },
  { id: 4, name: 'Düveler (6-12 Ay)', animalCount: 30 },
  { id: 5, name: 'Buzağılar (0-3 Ay)', animalCount: 15 },
];

export const rations: Ration[] = [
  {
    id: 1,
    animalGroupId: 1,
    name: 'Yüksek Verim Rasyonu',
    items: [
      { feedStockId: 1, amount: 20 }, // Mısır Silajı
      { feedStockId: 2, amount: 8 },  // Süt Yemi
      { feedStockId: 3, amount: 4 },  // Arpa Ezmesi
      { feedStockId: 4, amount: 5 },  // Yonca Kuru Otu
      { feedStockId: 5, amount: 0.15 },// Mineral Tozu
    ],
  },
  {
    id: 2,
    animalGroupId: 3,
    name: 'Kuru Dönem Rasyonu',
    items: [
      { feedStockId: 1, amount: 15 }, // Mısır Silajı
      { feedStockId: 4, amount: 7 },  // Yonca Kuru Otu
      { feedStockId: 5, amount: 0.1 }, // Mineral Tozu
    ],
  },
];
