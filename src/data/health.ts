
export interface HealthRecord {
  id: number;
  animalTag: string;
  date: string;
  diagnosis: string;
  treatment: string;
  notes?: string;
  vetName: string;
  imageUrls?: string[];
  isArchived: boolean;
  outcome?: 'Tedavi Altında' | 'İyileşti' | 'Öldü';
}

export const healthRecordsData: HealthRecord[] = [
  {
    id: 1,
    animalTag: 'TR-001',
    date: '2025-06-10',
    diagnosis: 'Mastit',
    treatment: 'Antibiyotik tedavisi',
    notes: 'Sol arka meme lobunda şişlik ve kızarıklık.',
    vetName: 'Dr. Ayşe Yılmaz',
    imageUrls: ['https://images.unsplash.com/photo-1465379944081-7f47de8d74ac?q=80&w=400&h=300&fit=crop'],
    isArchived: true,
    outcome: 'İyileşti',
  },
  {
    id: 2,
    animalTag: 'TR-015',
    date: '2025-06-08',
    diagnosis: 'Topallık',
    treatment: 'Ağrı kesici ve bandaj',
    vetName: 'Dr. Ali Veli',
    notes: 'Sağ ön ayakta hassasiyet.',
    imageUrls: [],
    isArchived: false,
    outcome: 'Tedavi Altında',
  },
  {
    id: 3,
    animalTag: 'TR-007',
    date: '2025-05-20',
    diagnosis: 'Rutin Kontrol',
    treatment: 'Aşı yapıldı (IBR-BVD)',
    vetName: 'Dr. Ayşe Yılmaz',
    imageUrls: [],
    isArchived: true,
  },
  {
    id: 4,
    animalTag: 'TR-023',
    date: '2025-04-15',
    diagnosis: 'Doğum sonrası kontrol',
    treatment: 'Vitamin takviyesi',
    vetName: 'Dr. Ayşe Yılmaz',
    imageUrls: ['https://images.unsplash.com/photo-1582562124811-c0901d0a901?q=80&w=400&h=300&fit=crop'],
    isArchived: false,
    outcome: 'İyileşti',
  },
  {
    id: 5,
    animalTag: 'TR-005',
    date: '2025-06-12',
    diagnosis: 'Şarbon',
    treatment: 'Tedavi denendi, başarısız.',
    notes: 'Hayvan kurtarılamadı.',
    vetName: 'Dr. Ali Veli',
    imageUrls: [],
    isArchived: true,
    outcome: 'Öldü',
  },
];
