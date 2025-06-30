
import * as XLSX from 'xlsx';

export interface AnimalImportData {
  id: string;
  species: 'İnek' | 'Koyun' | 'Keçi' | 'Tavuk' | 'Diğer';
  breed: string;
  gender: 'Erkek' | 'Dişi';
  status: 'Aktif' | 'Hamile' | 'Hasta';
  date_of_birth: string;
}

export interface DocumentInfo {
  institution?: string;
  farmInfo?: string;
  date?: string;
}

export const validateAnimalData = (data: any[]): { valid: AnimalImportData[], errors: string[] } => {
  const valid: AnimalImportData[] = [];
  const errors: string[] = [];
  const validSpecies = ['İnek', 'Koyun', 'Keçi', 'Tavuk', 'Diğer'];
  const validGenders = ['Erkek', 'Dişi'];
  const validStatuses = ['Aktif', 'Hamile', 'Hasta'];

  data.forEach((row, index) => {
    const rowNumber = index + 1;
    
    // Zorunlu alanları kontrol et
    if (!row.id || !row.breed || !row.gender || !row.date_of_birth) {
      errors.push(`Satır ${rowNumber}: Zorunlu alanlar eksik (Küpe No, Irk, Cinsiyet, Doğum Tarihi)`);
      return;
    }

    // Irk bilgisinden tür çıkarımı yap
    let species: 'İnek' | 'Koyun' | 'Keçi' | 'Tavuk' | 'Diğer' = 'İnek';
    const breedLower = row.breed.toLowerCase();
    if (breedLower.includes('holstein') || breedLower.includes('simmental') || breedLower.includes('jersey')) {
      species = 'İnek';
    } else if (breedLower.includes('merinos') || breedLower.includes('akkaraman')) {
      species = 'Koyun';
    } else if (breedLower.includes('kıl keçi') || breedLower.includes('angora')) {
      species = 'Keçi';
    } else if (breedLower.includes('tavuk') || breedLower.includes('piliç')) {
      species = 'Tavuk';
    }

    // Cinsiyet kontrolü ve düzeltme
    let gender: 'Erkek' | 'Dişi' = 'Dişi';
    if (row.gender?.toUpperCase() === 'ERKEK' || row.gender?.toUpperCase() === 'E') {
      gender = 'Erkek';
    } else if (row.gender?.toUpperCase() === 'DİŞİ' || row.gender?.toUpperCase() === 'DIŞI' || row.gender?.toUpperCase() === 'D') {
      gender = 'Dişi';
    }

    // Tarih formatı düzeltme (DD.MM.YYYY -> YYYY-MM-DD)
    let formattedDate = row.date_of_birth;
    if (formattedDate && formattedDate.includes('.')) {
      const parts = formattedDate.split('.');
      if (parts.length === 3) {
        formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    // Tarih formatı kontrolü
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formattedDate)) {
      errors.push(`Satır ${rowNumber}: Geçersiz tarih formatı (${formattedDate})`);
      return;
    }

    valid.push({
      id: row.id.toString(),
      species: species,
      breed: row.breed.toString(),
      gender: gender,
      status: 'Aktif',
      date_of_birth: formattedDate
    });
  });

  return { valid, errors };
};

export const processExcelFile = async (file: File) => {
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(worksheet);

    // Türkçe başlıkları İngilizce eşleştir
    const mappedData = jsonData.map((row: any) => ({
      id: row['Küpe No'] || row['ID'] || row['id'],
      breed: row['Irk'] || row['Breed'] || row['breed'] || row['Cins'],
      gender: row['Cinsiyet'] || row['Gender'] || row['gender'],
      date_of_birth: row['Doğum Tarihi'] || row['Birth Date'] || row['date_of_birth'],
      arrival_date: row['İşletmeye Geliş Tarihi'] || row['Arrival Date']
    }));

    return mappedData;
  } catch (error) {
    throw new Error('Excel dosyası işlenirken hata oluştu');
  }
};

export const processPDFFile = async (file: File): Promise<{ data: any[], documentInfo: DocumentInfo }> => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const text = new TextDecoder('utf-8').decode(arrayBuffer);
    
    // Belge bilgilerini çıkar
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    
    // Kurum bilgisi arama
    const institutionLine = lines.find(line => 
      line.includes('Tarım') || line.includes('Bakanlık') || line.includes('Müdürlük')
    );
    
    // İşletme bilgisi arama
    const farmLine = lines.find(line => 
      line.includes('İşletme') && (line.includes('Adı') || line.includes('Bilgi'))
    );

    const documentInfo: DocumentInfo = {
      institution: institutionLine,
      farmInfo: farmLine,
      date: new Date().toLocaleDateString('tr-TR')
    };

    // "İŞLETMEDEKİ MEVCUT HAYVANLAR" bölümünü bul
    const startIndex = lines.findIndex(line => 
      line.includes('İŞLETMEDEKİ MEVCUT HAYVANLAR') || 
      line.includes('MEVCUT HAYVANLAR')
    );

    if (startIndex === -1) {
      throw new Error('Hayvan listesi bölümü bulunamadı');
    }

    // Tablo başlığını bul
    let headerIndex = -1;
    for (let i = startIndex + 1; i < lines.length; i++) {
      if (lines[i].includes('Küpe No') || lines[i].includes('Sıra')) {
        headerIndex = i;
        break;
      }
    }

    if (headerIndex === -1) {
      throw new Error('Tablo başlığı bulunamadı');
    }

    const data = [];
    
    // Tablo verilerini işle
    for (let i = headerIndex + 1; i < lines.length; i++) {
      const line = lines[i];
      
      // Boş satır veya sayfa sonu kontrolü
      if (!line || line.length < 10) continue;
      
      // Tablo satırını parse et (tab, space veya dikey çubuk ile ayrılmış)
      const columns = line.split(/[\t\|]/).map(col => col.trim()).filter(col => col);
      
      if (columns.length >= 4) {
        // Sıra numarası varsa atla
        let startIdx = 0;
        if (!isNaN(parseInt(columns[0]))) {
          startIdx = 1;
        }

        const kupeNo = columns[startIdx];
        const irk = columns[startIdx + 1];
        const cinsiyet = columns[startIdx + 2];
        const dogumTarihi = columns[startIdx + 3];

        // Geçerli küpe numarası kontrolü
        if (kupeNo && kupeNo.startsWith('TR') && kupeNo.length > 5) {
          data.push({
            id: kupeNo,
            breed: irk || 'Holstein-SA',
            gender: cinsiyet || 'ERKEK',
            date_of_birth: dogumTarihi || '2024-01-01'
          });
        }
      }
    }
    
    if (data.length === 0) {
      throw new Error('PDF\'den hayvan verisi çıkarılamadı');
    }

    return { data, documentInfo };
  } catch (error) {
    throw new Error(`PDF dosyası işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
};
