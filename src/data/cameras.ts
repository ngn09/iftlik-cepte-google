
export interface Camera {
  id: string;
  name: string;
  streamUrl: string;
  status: 'online' | 'offline';
}

export const initialCameras: Camera[] = [
  { id: '1', name: 'Ahır Girişi', streamUrl: 'placeholder.mp4', status: 'online' },
  { id: '2', name: 'Yemlik Alanı', streamUrl: 'placeholder.mp4', status: 'online' },
  { id: '3', name: 'Doğumhane', streamUrl: 'placeholder.mp4', status: 'online' },
  { id: '4', name: 'Süt Sağım Alanı', streamUrl: 'placeholder.mp4', status: 'online' },
  { id: '5', name: 'Mera Kapısı', streamUrl: 'placeholder.mp4', status: 'offline' },
  { id: '6', name: 'Depo', streamUrl: 'placeholder.mp4', status: 'online' },
  { id: '7', name: 'Buzağı Bölmesi', streamUrl: 'placeholder.mp4', status: 'online' },
  { id: '8', name: 'Revir', streamUrl: 'placeholder.mp4', status: 'online' },
];
