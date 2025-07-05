
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
    
    // Satır bazlı ayrıştırma yerine tablo yapısını daha akıllıca bul
    const allText = text.replace(/\s+/g, ' ').trim();
    console.log('Temizlenmiş metin:', allText.substring(0, 1000));
    
    // Belge bilgilerini çıkar
    const institutionMatch = allText.match(/(T\.C\.|Türkiye Cumhuriyeti|Tarım|Bakanlık|İl Müdürlüğü|Veteriner)/i);
    const farmMatch = allText.match(/(İşletme|Çiftlik).{0,50}(Adı|Ad|:|Name)/i);

    const documentInfo: DocumentInfo = {
      institution: institutionMatch ? institutionMatch[0] : undefined,
      farmInfo: farmMatch ? farmMatch[0] : undefined,
      date: new Date().toLocaleDateString('tr-TR')
    };

    console.log('Belge bilgileri:', documentInfo);

    const data = [];
    
    // TR ile başlayan küpe numaralarını ve çevresindeki veriyi bul
    const kupePattern = /TR\d{12}/g;
    let match;
    let kupeNos = [];
    
    while ((match = kupePattern.exec(allText)) !== null) {
      kupeNos.push({
        kupeNo: match[0],
        index: match.index,
        contextStart: Math.max(0, match.index - 100),
        contextEnd: Math.min(allText.length, match.index + 200)
      });
    }
    
    console.log(`${kupeNos.length} küpe numarası bulundu:`, kupeNos.map(k => k.kupeNo));
    
    for (const kupeInfo of kupeNos) {
      const context = allText.substring(kupeInfo.contextStart, kupeInfo.contextEnd);
      console.log(`${kupeInfo.kupeNo} için kontekst:`, context);
      
      // Her küpe numarasının çevresindeki bilgileri parse et
      const contextParts = context.split(/\s+/).filter(part => part.length > 0);
      const kupeIndex = contextParts.findIndex(part => part === kupeInfo.kupeNo);
      
      if (kupeIndex !== -1) {
        // Küpe numarasından sonraki parçaları incele
        const afterKupe = contextParts.slice(kupeIndex + 1, kupeIndex + 10);
        console.log(`${kupeInfo.kupeNo} sonrası parçalar:`, afterKupe);
        
        let breed = 'Belirsiz';
        let gender = 'Erkek';
        let birthDate = '2024-01-01';
        
        // Irk bilgisini bul (Holstein-SA, Simmental vb.)
        const breedPart = afterKupe.find(part => 
          part.includes('Holstein') || 
          part.includes('Simmental') || 
          part.includes('Jersey') ||
          part.includes('Montofon') ||
          part.includes('-SA') ||
          part.includes('-DA') ||
          part.length > 3 && !part.match(/^\d/) && !['ERKEK', 'DİŞİ', 'DIŞI'].includes(part.toUpperCase())
        );
        
        if (breedPart) {
          breed = breedPart;
        }
        
        // Cinsiyet bilgisini bul
        const genderPart = afterKupe.find(part => 
          part.toUpperCase() === 'ERKEK' || 
          part.toUpperCase() === 'DİŞİ' ||
          part.toUpperCase() === 'DIŞI'
        );
        
        if (genderPart) {
          gender = genderPart.toUpperCase().includes('DİŞİ') || 
                  genderPart.toUpperCase().includes('DIŞI') ? 'Dişi' : 'Erkek';
        }
        
        // Tarih bilgisini bul (DD.MM.YY veya DD.MM.YYYY formatında)
        const datePart = afterKupe.find(part => 
          /\d{1,2}\.\d{1,2}\.\d{2,4}/.test(part)
        );
        
        if (datePart) {
          const parts = datePart.split('.');
          if (parts.length === 3) {
            let year = parts[2];
            // 2 haneli yılı 4 haneye çevir
            if (year.length === 2) {
              const yearNum = parseInt(year);
              year = yearNum > 50 ? `19${year}` : `20${year}`;
            }
            birthDate = `${year}-${parts[1].padStart(2, '0')}-${parts[0].padStart(2, '0')}`;
          }
        }
        
        const animalData = {
          id: kupeInfo.kupeNo,
          breed: breed,
          gender: gender,
          date_of_birth: birthDate
        };
        
        console.log('Hayvan verisi ekleniyor:', animalData);
        data.push(animalData);
      }
    }
    
    console.log(`PDF'den toplam ${data.length} hayvan verisi çıkarıldı`);
    
    if (data.length === 0) {
      console.log('Veri bulunamadı. Tüm metin içeriği:', allText);
      throw new Error('PDF\'den hayvan verisi çıkarılamadı. Lütfen Excel şablonunu kullanmayı deneyin.');
    }

    return { data, documentInfo };
  } catch (error) {
    console.error('PDF işleme hatası:', error);
    throw new Error(`PDF dosyası işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
  }
};

// Excel şablonu oluşturma fonksiyonu
export const createAnimalImportTemplate = () => {
  try {
    const templateData = [
      {
        'Küpe No': 'TR100001234567',
        'Irk': 'Holstein-SA',
        'Cinsiyet': 'Erkek',
        'Doğum Tarihi': '15.05.2020'
      },
      {
        'Küpe No': 'TR100001234568',
        'Irk': 'Simmental',
        'Cinsiyet': 'Dişi', 
        'Doğum Tarihi': '22.08.2019'
      },
      {
        'Küpe No': 'TR100001234569',
        'Irk': 'Jersey',
        'Cinsiyet': 'Dişi',
        'Doğum Tarihi': '10.12.2021'
      }
    ];

    // Yeni çalışma kitabı oluştur
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(templateData);
    
    // Kolon genişliklerini ayarla
    const colWidths = [
      { wch: 20 }, // Küpe No
      { wch: 15 }, // Irk
      { wch: 12 }, // Cinsiyet
      { wch: 15 }  // Doğum Tarihi
    ];
    ws['!cols'] = colWidths;
    
    // Çalışma sayfasını ekle
    XLSX.utils.book_append_sheet(wb, ws, 'Hayvan Şablonu');
    
    // Dosyayı indir
    const fileName = `hayvan_import_sablonu_${new Date().toISOString().split('T')[0]}.xlsx`;
    XLSX.writeFile(wb, fileName);
    
    console.log('Excel şablonu oluşturuldu:', fileName);
    return true;
  } catch (error) {
    console.error('Şablon oluşturma hatası:', error);
    throw new Error('Excel şablonu oluşturulamadı');
  }
};

// Gelişmiş PDF metin çıkarma fonksiyonu
const extractTextFromPDF = async (arrayBuffer: ArrayBuffer): Promise<string> => {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = '';
    
    // PDF içeriğini farklı encoding'lerle dene
    const encodings = ['utf-8', 'latin1', 'windows-1254'];
    let bestText = '';
    let maxLength = 0;
    
    for (const encoding of encodings) {
      try {
        const pdfString = new TextDecoder(encoding).decode(uint8Array);
        
        // Çeşitli PDF metin çıkarma desenleri
        const patterns = [
          /\((.*?)\)\s*Tj/g,
          /\[(.*?)\]\s*TJ/g,
          /\((.*?)\)\s*Tj/gi,
          /BT\s*(.*?)\s*ET/gs,
          /\(([\s\S]*?)\)/g
        ];
        
        let extractedText = '';
        for (const pattern of patterns) {
          let match;
          while ((match = pattern.exec(pdfString)) !== null) {
            const textContent = match[1];
            if (textContent && textContent.length > 0) {
              // Özel karakterleri temizle ama Türkçe karakterleri koru
              const cleanText = textContent
                .replace(/\\n/g, '\n')
                .replace(/\\r/g, '\r')
                .replace(/\\t/g, '\t')
                .replace(/\\\\/g, '\\');
              extractedText += cleanText + ' ';
            }
          }
        }
        
        // Eğer bu encoding daha iyi sonuç verdiyse kaydet
        if (extractedText.length > maxLength) {
          maxLength = extractedText.length;
          bestText = extractedText;
        }
      } catch (e) {
        console.log(`${encoding} encoding başarısız:`, e);
      }
    }
    
    text = bestText;
    
    // Türkçe karakter düzeltmeleri
    text = text
      .replace(/Ã¼/g, 'ü')
      .replace(/Ã¶/g, 'ö')
      .replace(/Ã§/g, 'ç')
      .replace(/Ä±/g, 'ı')
      .replace(/Å/g, 'ş')
      .replace(/Ä/g, 'ğ')
      .replace(/Ã„/g, 'İ')
      .replace(/Ã/g, 'İ')
      .replace(/ÄŸ/g, 'ğ')
      .replace(/Å\u009f/g, 'ş');
    
    // Eğer hala metin çıkaramadıysak, raw binary'den tablo verilerini ara
    if (text.length < 100) {
      const rawText = Array.from(uint8Array)
        .map(byte => String.fromCharCode(byte))
        .join('');
      
      // TR ile başlayan küpe numaralarını bul
      const kupeMatches = rawText.match(/TR\d{12}/g);
      if (kupeMatches && kupeMatches.length > 0) {
        console.log('Raw binary\'den küpe numaraları bulundu:', kupeMatches.length);
        // Bu durumda raw text'i kullan
        text = rawText;
      }
    }
    
    console.log('Çıkarılan metin uzunluğu:', text.length);
    console.log('İlk 500 karakter:', text.substring(0, 500));
    return text;
  } catch (error) {
    console.error('PDF metin çıkarma hatası:', error);
    throw new Error('PDF dosyasından metin çıkarılamadı');
  }
};
