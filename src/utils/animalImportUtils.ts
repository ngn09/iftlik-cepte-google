
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
    throw new Error('Excel dosyası işlenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata'));
  }
};

export const processPDFFile = async (file: File): Promise<{ data: any[], documentInfo: DocumentInfo }> => {
  try {
    console.log('PDF dosyası işleniyor:', file.name);
    
    // PDF-lib kullanarak PDF'i oku
    const arrayBuffer = await file.arrayBuffer();
    
    // Basit text extraction için FileReader kullan
    const text = await extractTextFromPDF(arrayBuffer);
    console.log('PDF text çıkarıldı, uzunluk:', text.length);
    
    if (!text || text.length < 100) {
      throw new Error('PDF dosyasından metin çıkarılamadı veya dosya boş görünüyor');
    }
    
    // Belge bilgilerini çıkar
    const lines = text.split('\n').map(line => line.trim()).filter(line => line);
    console.log('Toplam satır sayısı:', lines.length);
    
    // Kurum bilgisi arama
    const institutionLine = lines.find(line => 
      line.includes('Tarım') || 
      line.includes('Bakanlık') || 
      line.includes('Müdürlük') ||
      line.includes('Veteriner')
    );
    
    // İşletme bilgisi arama
    const farmLine = lines.find(line => 
      line.includes('İşletme') && (line.includes('Adı') || line.includes('Bilgi') || line.includes(':'))
    );

    const documentInfo: DocumentInfo = {
      institution: institutionLine,
      farmInfo: farmLine,
      date: new Date().toLocaleDateString('tr-TR')
    };

    console.log('Belge bilgileri:', documentInfo);

    // "İŞLETMEDEKİ MEVCUT HAYVANLAR" bölümünü bul
    const sectionPatterns = [
      'İŞLETMEDEKİ MEVCUT HAYVANLAR',
      'MEVCUT HAYVANLAR',
      'HAYVAN LİSTESİ',
      'Küpe No'
    ];
    
    let startIndex = -1;
    for (const pattern of sectionPatterns) {
      startIndex = lines.findIndex(line => line.includes(pattern));
      if (startIndex !== -1) {
        console.log(`"${pattern}" bölümü ${startIndex}. satırda bulundu`);
        break;
      }
    }

    if (startIndex === -1) {
      throw new Error('Hayvan listesi bölümü bulunamadı. Lütfen doğru belge formatını kontrol edin.');
    }

    // Tablo başlığını bul
    let headerIndex = -1;
    const headerPatterns = ['Küpe No', 'Sıra', 'No'];
    
    for (let i = startIndex; i < Math.min(startIndex + 10, lines.length); i++) {
      for (const pattern of headerPatterns) {
        if (lines[i].includes(pattern)) {
          headerIndex = i;
          console.log(`Tablo başlığı ${headerIndex}. satırda bulundu:`, lines[i]);
          break;
        }
      }
      if (headerIndex !== -1) break;
    }

    if (headerIndex === -1) {
      // Başlık bulunamazsa startIndex'ten sonraki ilk uygun satırı kullan
      headerIndex = startIndex + 1;
      console.log('Tablo başlığı bulunamadı, varsayılan olarak', headerIndex, 'kullanılıyor');
    }

    const data = [];
    let processedRows = 0;
    
    // Tablo verilerini işle
    for (let i = headerIndex + 1; i < lines.length && processedRows < 100; i++) {
      const line = lines[i].trim();
      
      // Boş satır, sayfa sonu veya başka bölüm kontrolü
      if (!line || 
          line.length < 10 || 
          line.includes('Sayfa') || 
          line.includes('Toplam') ||
          line.includes('İMZA') ||
          line.includes('Tarih')) {
        continue;
      }
      
      console.log(`${i}. satır işleniyor:`, line);
      
      // Satırı parse et - çeşitli ayraçları dene
      let columns = [];
      
      // Tab ile ayrılmış
      if (line.includes('\t')) {
        columns = line.split('\t').map(col => col.trim()).filter(col => col);
      }
      // Birden fazla boşluk ile ayrılmış
      else if (line.includes('  ')) {
        columns = line.split(/\s{2,}/).map(col => col.trim()).filter(col => col);
      }
      // Tek boşluk ile ayrılmış (son çare)
      else {
        columns = line.split(/\s+/).map(col => col.trim()).filter(col => col);
      }
      
      console.log('Ayrıştırılan sütunlar:', columns);
      
      if (columns.length >= 4) {
        // Sıra numarası varsa atla
        let startIdx = 0;
        if (columns.length > 4 && !isNaN(parseInt(columns[0])) && parseInt(columns[0]) < 1000) {
          startIdx = 1;
        }

        const kupeNo = columns[startIdx];
        const irk = columns[startIdx + 1];
        const cinsiyet = columns[startIdx + 2];
        const dogumTarihi = columns[startIdx + 3];

        // Geçerli küpe numarası kontrolü - Türkiye küpe numarası formatı
        if (kupeNo && 
            (kupeNo.startsWith('TR') || kupeNo.length >= 8) && 
            kupeNo.length <= 20 &&
            irk && irk.length > 1) {
          
          const animalData = {
            id: kupeNo,
            breed: irk,
            gender: cinsiyet || 'ERKEK',
            date_of_birth: dogumTarihi || '2024-01-01'
          };
          
          console.log('Hayvan verisi ekleniyor:', animalData);
          data.push(animalData);
          processedRows++;
        }
      }
    }
    
    console.log(`Toplam ${data.length} hayvan verisi işlendi`);
    
    if (data.length === 0) {
      throw new Error('PDF\'den hayvan verisi çıkarılamadı. Lütfen belgenin doğru formatta olduğundan emin olun.');
    }

    return { data, documentInfo };
  } catch (error) {
    console.error('PDF işleme hatası:', error);
    throw new Error(`PDF dosyası işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
};

// Basit PDF metin çıkarma fonksiyonu
const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    // PDF içeriğini string olarak çıkar (basit yaklaşım)
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    
    // PDF'deki metin objelerini bul
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    // PDF stream'lerinden metin çıkar
    const streamRegex = /BT\s*.*?ET/gs;
    const streams = pdfString.match(streamRegex) || [];
    
    for (const stream of streams) {
      // Tj ve TJ operatorlerini bul
      const textRegex = /\((.*?)\)\s*Tj|\[(.*?)\]\s*TJ/g;
      let match;
      
      while ((match = textRegex.exec(stream)) !== null) {
        const textContent = match[1] || match[2];
        if (textContent) {
          text += textContent.replace(/\\n/g, '\n').replace(/\\r/g, '\r') + ' ';
        }
      }
    }
    
    // Eğer yukardaki yöntem başarısız olursa, alternatif yöntem
    if (text.length < 50) {
      const simpleTextRegex = /\(([^)]+)\)/g;
      let match;
      
      while ((match = simpleTextRegex.exec(pdfString)) !== null) {
        const textContent = match[1];
        if (textContent && textContent.length > 2) {
          text += textContent + ' ';
        }
      }
    }
    
    return text;
  } catch (error) {
    console.error('PDF metin çıkarma hatası:', error);
    throw new Error('PDF dosyasından metin çıkarılamadı');
  }
};
