
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAnimals } from "@/hooks/useAnimals";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, AlertTriangle, Info } from "lucide-react";
import * as XLSX from 'xlsx';

interface BulkAnimalImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AnimalImportData {
  id: string;
  species: 'İnek' | 'Koyun' | 'Keçi' | 'Tavuk' | 'Diğer';
  breed: string;
  gender: 'Erkek' | 'Dişi';
  status: 'Aktif' | 'Hamile' | 'Hasta';
  date_of_birth: string;
}

const BulkAnimalImportDialog = ({ isOpen, onOpenChange }: BulkAnimalImportDialogProps) => {
  const { addAnimal } = useAnimals();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<AnimalImportData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [documentInfo, setDocumentInfo] = useState<{
    institution?: string;
    farmInfo?: string;
    date?: string;
  }>({});

  const validateAnimalData = (data: any[]): { valid: AnimalImportData[], errors: string[] } => {
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

  const processExcelFile = async (file: File) => {
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

  const processPDFFile = async (file: File) => {
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

      setDocumentInfo({
        institution: institutionLine,
        farmInfo: farmLine,
        date: new Date().toLocaleDateString('tr-TR')
      });

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

      return data;
    } catch (error) {
      throw new Error(`PDF dosyası işlenirken hata oluştu: ${error instanceof Error ? error.message : 'Bilinmeyen hata'}`);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setPreviewData([]);
    setErrors([]);
    setDocumentInfo({});

    try {
      let rawData;
      
      if (selectedFile.type.includes('excel') || selectedFile.name.endsWith('.xlsx') || selectedFile.name.endsWith('.xls')) {
        rawData = await processExcelFile(selectedFile);
      } else if (selectedFile.type === 'application/pdf' || selectedFile.name.endsWith('.pdf')) {
        rawData = await processPDFFile(selectedFile);
      } else {
        throw new Error('Desteklenmeyen dosya formatı. Lütfen Excel (.xlsx) veya PDF dosyası seçin.');
      }

      const { valid, errors } = validateAnimalData(rawData);
      setPreviewData(valid);
      setErrors(errors);

      if (valid.length === 0 && errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Dosyada geçerli hayvan verisi bulunamadı."
        });
      } else if (valid.length > 0) {
        toast({
          title: "Başarılı",
          description: `${valid.length} hayvan kaydı başarıyla okundu.`
        });
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Dosya İşleme Hatası",
        description: error instanceof Error ? error.message : "Dosya işlenirken hata oluştu"
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleImport = async () => {
    if (previewData.length === 0) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "İçe aktarılacak hayvan verisi bulunamadı."
      });
      return;
    }

    setIsProcessing(true);
    let successCount = 0;
    let errorCount = 0;

    for (const animal of previewData) {
      try {
        await new Promise<void>((resolve, reject) => {
          addAnimal(animal, {
            onSuccess: () => {
              successCount++;
              resolve();
            },
            onError: (error) => {
              errorCount++;
              console.error(`Hayvan ${animal.id} eklenirken hata:`, error);
              reject(error);
            }
          });
        });
      } catch (error) {
        errorCount++;
      }
    }

    setIsProcessing(false);
    
    toast({
      title: "İçe Aktarma Tamamlandı",
      description: `${successCount} hayvan başarıyla eklendi. ${errorCount > 0 ? `${errorCount} hata oluştu.` : ''}`
    });

    if (successCount > 0) {
      onOpenChange(false);
      setFile(null);
      setPreviewData([]);
      setErrors([]);
      setDocumentInfo({});
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Toplu Hayvan İçe Aktarma</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm flex items-center gap-2">
                <Info className="h-4 w-4" />
                Desteklenen Dosya Formatları
              </CardTitle>
              <CardDescription>
                Bakanlık belgesi formatındaki PDF dosyaları ve Excel (.xlsx) dosyaları desteklenmektedir.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="font-medium text-blue-800">PDF Belgesi İçin:</p>
                  <p className="text-blue-700">• "İŞLETMEDEKİ MEVCUT HAYVANLAR" bölümünü otomatik olarak tespit eder</p>
                  <p className="text-blue-700">• Küpe No, Irk, Cinsiyet, Doğum Tarihi bilgilerini okur</p>
                  <p className="text-blue-700">• Tarih formatını otomatik olarak düzenler (DD.MM.YYYY → YYYY-MM-DD)</p>
                </div>
                <div className="bg-green-50 p-3 rounded-lg">
                  <p className="font-medium text-green-800">Excel Dosyası İçin:</p>
                  <p className="text-green-700">• Küpe No, Irk/Cins, Cinsiyet, Doğum Tarihi sütunları olmalıdır</p>
                  <p className="text-green-700">• İşletmeye Geliş Tarihi (opsiyonel)</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="file">PDF Belgesi veya Excel Dosyası Seç</Label>
            <Input
              id="file"
              type="file"
              accept=".xlsx,.xls,.pdf"
              onChange={handleFileChange}
              disabled={isProcessing}
            />
          </div>

          {isProcessing && (
            <div className="text-center py-4">
              <p>Dosya işleniyor...</p>
            </div>
          )}

          {documentInfo.institution && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-blue-600">Belge Bilgileri</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1">
                  {documentInfo.institution && <p><strong>Kurum:</strong> {documentInfo.institution}</p>}
                  {documentInfo.farmInfo && <p><strong>İşletme:</strong> {documentInfo.farmInfo}</p>}
                  {documentInfo.date && <p><strong>İşlem Tarihi:</strong> {documentInfo.date}</p>}
                </div>
              </CardContent>
            </Card>
          )}

          {errors.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" />
                  Hatalar ({errors.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
                  {errors.map((error, index) => (
                    <p key={index} className="text-red-600">{error}</p>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {previewData.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">Önizleme ({previewData.length} kayıt)</CardTitle>
                <CardDescription>
                  İçe aktarılacak hayvanlar aşağıda gösterilmektedir.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-2">Küpe No</th>
                        <th className="text-left p-2">Tür</th>
                        <th className="text-left p-2">Irk</th>
                        <th className="text-left p-2">Cinsiyet</th>
                        <th className="text-left p-2">Durum</th>
                        <th className="text-left p-2">Doğum Tarihi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((animal, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2 font-mono text-xs">{animal.id}</td>
                          <td className="p-2">{animal.species}</td>
                          <td className="p-2">{animal.breed}</td>
                          <td className="p-2">{animal.gender}</td>
                          <td className="p-2">
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              {animal.status}
                            </span>
                          </td>
                          <td className="p-2">{animal.date_of_birth}</td>
                        </tr>
                      ))}
                      {previewData.length > 10 && (
                        <tr>
                          <td colSpan={6} className="p-2 text-center text-gray-500">
                            ... ve {previewData.length - 10} kayıt daha
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              İptal
            </Button>
            <Button 
              onClick={handleImport}
              disabled={previewData.length === 0 || isProcessing}
            >
              <Upload className="h-4 w-4 mr-2" />
              {previewData.length} Hayvan İçe Aktar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default BulkAnimalImportDialog;
