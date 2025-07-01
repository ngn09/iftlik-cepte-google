
import { FeedStockItem } from '@/hooks/useFeedStock';

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
  name: string;
  items: RationItem[];
  isArchived?: boolean;
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
      { feedStockId: 1, amount: 20 },
      { feedStockId: 2, amount: 8 },
      { feedStockId: 3, amount: 4 },
      { feedStockId: 4, amount: 5 },
      { feedStockId: 5, amount: 0.15 },
    ],
  },
  {
    id: 2,
    animalGroupId: 3,
    name: 'Kuru Dönem Rasyonu',
    items: [
      { feedStockId: 1, amount: 15 },
      { feedStockId: 4, amount: 7 },
      { feedStockId: 5, amount: 0.1 },
    ],
  },
];
