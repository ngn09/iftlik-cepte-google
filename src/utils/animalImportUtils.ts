
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
    
    console.log(`Satır ${rowNumber} işleniyor:`, row);
    
    // Zorunlu alanları kontrol et - güvenli string dönüşümü
    const idValue = row.id ? String(row.id).trim() : '';
    const breedValue = row.breed ? String(row.breed).trim() : '';
    const genderValue = row.gender ? String(row.gender).trim() : '';
    const birthDateValue = row.date_of_birth ? String(row.date_of_birth).trim() : '';
    
    if (!idValue || !breedValue || !genderValue || !birthDateValue) {
      errors.push(`Satır ${rowNumber}: Zorunlu alanlar eksik (Küpe No: "${idValue}", Irk: "${breedValue}", Cinsiyet: "${genderValue}", Doğum Tarihi: "${birthDateValue}")`);
      return;
    }

    // Irk bilgisinden tür çıkarımı yap - güvenli string işlemi
    let species: 'İnek' | 'Koyun' | 'Keçi' | 'Tavuk' | 'Diğer' = 'İnek';
    const breedLower = breedValue.toLowerCase();
    
    if (breedLower.includes('holstein') || breedLower.includes('simmental') || breedLower.includes('jersey') || breedLower.includes('montofon')) {
      species = 'İnek';
    } else if (breedLower.includes('merinos') || breedLower.includes('akkaraman') || breedLower.includes('koyun')) {
      species = 'Koyun';
    } else if (breedLower.includes('kıl keçi') || breedLower.includes('angora') || breedLower.includes('keçi')) {
      species = 'Keçi';
    } else if (breedLower.includes('tavuk') || breedLower.includes('piliç') || breedLower.includes('etlik')) {
      species = 'Tavuk';
    }

    // Cinsiyet kontrolü ve düzeltme - güvenli string işlemi
    let gender: 'Erkek' | 'Dişi' = 'Dişi';
    const genderUpper = genderValue.toUpperCase();
    if (genderUpper === 'ERKEK' || genderUpper === 'E' || genderUpper === 'M' || genderUpper === 'MALE') {
      gender = 'Erkek';
    } else if (genderUpper === 'DİŞİ' || genderUpper === 'DIŞI' || genderUpper === 'D' || genderUpper === 'F' || genderUpper === 'FEMALE') {
      gender = 'Dişi';
    }

    // Tarih formatı düzeltme
    let formattedDate = birthDateValue;
    
    // Excel tarih numarasını kontrol et
    if (!isNaN(Number(formattedDate)) && Number(formattedDate) > 25000) {
      // Excel tarih numarası ise JavaScript tarihine dönüştür
      const excelDate = new Date((Number(formattedDate) - 25569) * 86400 * 1000);
      formattedDate = excelDate.toISOString().split('T')[0];
    }
    // DD.MM.YYYY formatını kontrol et
    else if (formattedDate.includes('.')) {
      const parts = formattedDate.split('.');
      if (parts.length === 3 && parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
        formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }
    // DD/MM/YYYY formatını kontrol et
    else if (formattedDate.includes('/')) {
      const parts = formattedDate.split('/');
      if (parts.length === 3 && parts[0].length <= 2 && parts[1].length <= 2 && parts[2].length === 4) {
        formattedDate = `${parts[2]}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
      }
    }

    // Tarih formatı kontrolü
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formattedDate)) {
      errors.push(`Satır ${rowNumber}: Geçersiz tarih formatı ("${birthDateValue}" -> "${formattedDate}")`);
      return;
    }

    console.log(`Satır ${rowNumber} başarıyla işlendi:`, {
      id: idValue,
      species,
      breed: breedValue,
      gender,
      date_of_birth: formattedDate
    });

    valid.push({
      id: idValue,
      species: species,
      breed: breedValue,
      gender: gender,
      status: 'Aktif',
      date_of_birth: formattedDate
    });
  });

  return { valid, errors };
};

export const processExcelFile = async (file: File) => {
  try {
    console.log('Excel dosyası işleniyor:', file.name);
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // XLSX options ile tarih ve sayı formatlarını düzelt
    const jsonData = XLSX.utils.sheet_to_json(worksheet, {
      raw: false, // Ham verileri string olarak al
      dateNF: 'yyyy-mm-dd' // Tarih formatını belirle
    });

    console.log('Excel verisi okundu:', jsonData);

    // Türkçe başlıkları İngilizce eşleştir - case insensitive
    const mappedData = jsonData.map((row: any, index: number) => {
      console.log(`Excel satır ${index + 1}:`, row);
      
      // Tüm olası başlık kombinasyonlarını kontrol et
      const keys = Object.keys(row);
      
      const getId = () => {
        const idKeys = keys.find(key => 
          key.toLowerCase().includes('küpe') || 
          key.toLowerCase().includes('id') || 
          key.toLowerCase().includes('numara') ||
          key.toLowerCase().includes('no')
        );
        return idKeys ? row[idKeys] : null;
      };

      const getBreed = () => {
        const breedKeys = keys.find(key => 
          key.toLowerCase().includes('irk') || 
          key.toLowerCase().includes('breed') || 
          key.toLowerCase().includes('cins') ||
          key.toLowerCase().includes('ırk')
        );
        return breedKeys ? row[breedKeys] : null;
      };

      const getGender = () => {
        const genderKeys = keys.find(key => 
          key.toLowerCase().includes('cinsiyet') || 
          key.toLowerCase().includes('gender') ||
          key.toLowerCase().includes('sex')
        );
        return genderKeys ? row[genderKeys] : null;
      };

      const getBirthDate = () => {
        const dateKeys = keys.find(key => 
          key.toLowerCase().includes('doğum') || 
          key.toLowerCase().includes('birth') || 
          key.toLowerCase().includes('tarih') ||
          key.toLowerCase().includes('dogum')
        );
        return dateKeys ? row[dateKeys] : null;
      };

      return {
        id: getId(),
        breed: getBreed(),
        gender: getGender(),
        date_of_birth: getBirthDate(),
        arrival_date: row['İşletmeye Geliş Tarihi'] || row['Arrival Date'] || null
      };
    });

    console.log('Eşleştirilmiş veri:', mappedData);
    return mappedData;
  } catch (error) {
    console.error('Excel işleme hatası:', error);
    throw new Error(`Excel dosyası işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
};

export const processPDFFile = async (file: File): Promise<{ data: any[], documentInfo: DocumentInfo }> => {
  try {
    console.log('PDF dosyası işleniyor:', file.name);
    
    const arrayBuffer = await file.arrayBuffer();
    const text = await extractTextFromPDF(arrayBuffer);
    
    console.log('PDF text çıkarıldı, uzunluk:', text.length);
    console.log('PDF içeriği önizleme:', text.substring(0, 500));
    
    if (!text || text.length < 50) {
      throw new Error('PDF dosyasından metin çıkarılamadı veya dosya boş görünüyor');
    }
    
    const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
    console.log('Toplam satır sayısı:', lines.length);
    
    // İlk 20 satırı logla
    console.log('İlk 20 satır:', lines.slice(0, 20));
    
    // Belge bilgilerini çıkar
    const institutionLine = lines.find(line => 
      line.includes('Tarım') || 
      line.includes('Bakanlık') || 
      line.includes('Müdürlük') ||
      line.includes('Veteriner') ||
      line.includes('İl Müdürlüğü')
    );
    
    const farmLine = lines.find(line => 
      (line.includes('İşletme') || line.includes('Çiftlik')) && 
      (line.includes('Adı') || line.includes('Bilgi') || line.includes(':') || line.includes('Ad'))
    );

    const documentInfo: DocumentInfo = {
      institution: institutionLine,
      farmInfo: farmLine,
      date: new Date().toLocaleDateString('tr-TR')
    };

    console.log('Belge bilgileri:', documentInfo);

    // Hayvan listesi bölümünü bul - daha geniş arama
    const sectionPatterns = [
      'İŞLETMEDEKİ MEVCUT HAYVANLAR',
      'MEVCUT HAYVANLAR',
      'HAYVAN LİSTESİ',
      'HAYVAN KAYITLARI',
      'Küpe No',
      'KÜPE NO',
      'Hayvan Bilgileri',
      'HAYVAN BİLGİLERİ',
      'Tablo', // Genel tablo başlığı
      'Liste' // Genel liste başlığı
    ];
    
    let startIndex = -1;
    let foundPattern = '';
    
    for (const pattern of sectionPatterns) {
      startIndex = lines.findIndex(line => 
        line.toUpperCase().includes(pattern.toUpperCase()) ||
        line.toUpperCase().replace(/[İI]/g, 'I').includes(pattern.toUpperCase().replace(/[İI]/g, 'I'))
      );
      if (startIndex !== -1) {
        foundPattern = pattern;
        console.log(`"${pattern}" bölümü ${startIndex}. satırda bulundu:`, lines[startIndex]);
        break;
      }
    }

    // Eğer özel bölüm başlığı bulunamazsa, küpe numarası içeren satırları ara
    if (startIndex === -1) {
      console.log('Özel bölüm başlığı bulunamadı, küpe numarası araniyor...');
      startIndex = lines.findIndex(line => 
        /TR\d{12}/.test(line) || // Türkiye küpe numarası formatı
        line.includes('TR') && line.length > 10 ||
        /\d{10,}/.test(line) // Uzun sayı dizileri
      );
      
      if (startIndex !== -1) {
        console.log(`Küpe numarası ${startIndex}. satırda bulundu:`, lines[startIndex]);
        startIndex = Math.max(0, startIndex - 2); // Başlık için birkaç satır geri git
      }
    }

    if (startIndex === -1) {
      // Son çare: "TR" içeren herhangi bir satır ara
      startIndex = lines.findIndex(line => line.includes('TR'));
      if (startIndex !== -1) {
        console.log(`TR içeren satır ${startIndex}. satırda bulundu:`, lines[startIndex]);
        startIndex = Math.max(0, startIndex - 1);
      }
    }

    if (startIndex === -1) {
      console.log('Mevcut satırlar (ilk 50):', lines.slice(0, 50));
      throw new Error('PDF\'de hayvan verisi bulunamadı. Lütfen belgenin Türkiye Cumhuriyeti Tarım ve Orman Bakanlığı formatında olduğundan emin olun.');
    }

    const data = [];
    let processedRows = 0;
    
    // Tablo verilerini işle - startIndex'ten itibaren
    for (let i = startIndex; i < lines.length && processedRows < 200; i++) {
      const line = lines[i].trim();
      
      if (!line || line.length < 5) continue;
      
      // Sayfa sonu, imza, toplam gibi bölümleri atla
      if (line.includes('Sayfa') || 
          line.includes('Toplam') ||
          line.includes('İMZA') ||
          line.includes('Tarih') ||
          line.includes('Müdür') ||
          line.toUpperCase().includes('TOPLAM')) {
        continue;
      }
      
      console.log(`${i}. satır kontrol ediliyor:`, line);
      
      // Türkiye küpe numarası formatını ara (TR ile başlayan 14 haneli)
      const kupeNoMatch = line.match(/TR\d{12}/);
      if (kupeNoMatch) {
        const kupeNo = kupeNoMatch[0];
        console.log('Küpe numarası bulundu:', kupeNo);
        
        // Satırın geri kalanını parse et
        const remainingText = line.replace(kupeNo, '').trim();
        const parts = remainingText.split(/\s+/).filter(part => part.length > 0);
        
        console.log('Küpe numarası sonrası kısım:', parts);
        
        if (parts.length >= 2) {
          // İlk anlamlı kelime irk olabilir
          let breed = parts[0];
          let gender = 'ERKEK'; // Varsayılan
          let birthDate = '2024-01-01'; // Varsayılan
          
          // Cinsiyet bilgisini ara
          const genderPart = parts.find(part => 
            part.toUpperCase().includes('ERKEK') || 
            part.toUpperCase().includes('DİŞİ') ||
            part.toUpperCase().includes('DIŞI') ||
            part.toUpperCase() === 'E' ||
            part.toUpperCase() === 'D'
          );
          
          if (genderPart) {
            gender = genderPart.toUpperCase().includes('DİŞİ') || 
                    genderPart.toUpperCase().includes('DIŞI') || 
                    genderPart.toUpperCase() === 'D' ? 'DİŞİ' : 'ERKEK';
          }
          
          // Tarih formatını ara (DD.MM.YYYY)
          const datePart = parts.find(part => /\d{1,2}\.\d{1,2}\.\d{4}/.test(part));
          if (datePart) {
            birthDate = datePart;
          }
          
          const animalData = {
            id: kupeNo,
            breed: breed || 'Belirsiz',
            gender: gender,
            date_of_birth: birthDate
          };
          
          console.log('Hayvan verisi ekleniyor:', animalData);
          data.push(animalData);
          processedRows++;
        }
      }
    }
    
    console.log(`PDF'den toplam ${data.length} hayvan verisi çıkarıldı`);
    
    if (data.length === 0) {
      console.log('Veri bulunamadı. PDF içeriğinin tamamı:', text);
      throw new Error('PDF\'den hayvan verisi çıkarılamadı. Belge formatını kontrol edin veya daha açık/okunabilir bir PDF kullanın.');
    }

    return { data, documentInfo };
  } catch (error) {
    console.error('PDF işleme hatası:', error);
    throw new Error(`PDF dosyası işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
};

// Gelişmiş PDF metin çıkarma fonksiyonu
const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    
    // PDF içeriğini string olarak decode et
    const pdfString = new TextDecoder('latin1').decode(uint8Array);
    
    // Metin objelerini bul ve çıkar
    const patterns = [
      /\((.*?)\)\s*Tj/g,
      /\[(.*?)\]\s*TJ/g,
      /\((.*?)\)/g
    ];
    
    for (const pattern of patterns) {
      let match;
      while ((match = pattern.exec(pdfString)) !== null) {
        const textContent = match[1];
        if (textContent && textContent.length > 1 && !/^[\x00-\x1F\x7F-\xFF]*$/.test(textContent)) {
          text += textContent.replace(/\\n/g, '\n').replace(/\\r/g, '\r') + ' ';
        }
      }
    }
    
    // Türkçe karakterleri düzelt
    text = text
      .replace(/Ã¼/g, 'ü')
      .replace(/Ã¶/g, 'ö')
      .replace(/Ã§/g, 'ç')
      .replace(/Ä±/g, 'ı')
      .replace(/Å/g, 'ş')
      .replace(/Ä/g, 'ğ')
      .replace(/Ã„/g, 'İ');
    
    console.log('Çıkarılan metin uzunluğu:', text.length);
    return text;
  } catch (error) {
    console.error('PDF metin çıkarma hatası:', error);
    throw new Error('PDF dosyasından metin çıkarılamadı');
  }
};
