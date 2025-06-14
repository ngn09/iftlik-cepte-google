
export const ROLES = {
  'Yönetici': 'Tüm sistem ayarlarına erişebilir, kullanıcıları yönetebilir ve tüm verileri görebilir.',
  'Veteriner': 'Hayvan sağlık kayıtlarını yönetebilir, tedavi ve aşı bilgilerini girebilir.',
  'İşçi': 'Envanter, yem stoğu ve günlük görevler gibi operasyonel verileri yönetir.',
  'Misafir': 'Sadece belirli verileri görüntüleme yetkisine sahiptir, veri girişi veya değişiklik yapamaz.',
};

export const roleOptions = Object.keys(ROLES).map(role => ({ value: role, label: role }));

export type Role = keyof typeof ROLES;
