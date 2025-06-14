
export interface FeedItem {
  id: number;
  name: string;
  type: 'Tahıl' | 'Kaba Yem' | 'Konsantre' | 'Katkı';
  stockAmount: number;
  unit: 'kg' | 'ton';
  lastUpdated: string;
  supplier: string;
}

export const feedStock: FeedItem[] = [
  {
    id: 1,
    name: 'Mısır Silajı',
    type: 'Kaba Yem',
    stockAmount: 50,
    unit: 'ton',
    lastUpdated: '10.06.2025',
    supplier: 'Yerli Üretici A.Ş.'
  },
  {
    id: 2,
    name: 'Süt Yemi (18 Protein)',
    type: 'Konsantre',
    stockAmount: 5000,
    unit: 'kg',
    lastUpdated: '12.06.2025',
    supplier: 'YemSan A.Ş.'
  },
  {
    id: 3,
    name: 'Arpa Ezmesi',
    type: 'Tahıl',
    stockAmount: 2500,
    unit: 'kg',
    lastUpdated: '05.06.2025',
    supplier: 'TohumDepo Ltd.'
  },
  {
    id: 4,
    name: 'Yonca Kuru Otu',
    type: 'Kaba Yem',
    stockAmount: 20,
    unit: 'ton',
    lastUpdated: '01.05.2025',
    supplier: 'Çiftçi Ahmet'
  },
  {
    id: 5,
    name: 'Mineral ve Vitamin Tozu',
    type: 'Katkı',
    stockAmount: 150,
    unit: 'kg',
    lastUpdated: '14.06.2025',
    supplier: 'Veteriner Deposu'
  },
];
