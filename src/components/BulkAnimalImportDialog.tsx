
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { useAnimals } from "@/hooks/useAnimals";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload, AlertTriangle } from "lucide-react";
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

  const validateAnimalData = (data: any[]): { valid: AnimalImportData[], errors: string[] } => {
    const valid: AnimalImportData[] = [];
    const errors: string[] = [];
    const validSpecies = ['İnek', 'Koyun', 'Keçi', 'Tavuk', 'Diğer'];
    const validGenders = ['Erkek', 'Dişi'];
    const validStatuses = ['Aktif', 'Hamile', 'Hasta'];

    data.forEach((row, index) => {
      const rowNumber = index + 1;
      
      // Zorunlu alanları kontrol et
      if (!row.id || !row.species || !row.breed || !row.gender || !row.date_of_birth) {
        errors.push(`Satır ${rowNumber}: Zorunlu alanlar eksik (Küpe No, Tür, Cins, Cinsiyet, Doğum Tarihi)`);
        return;
      }

      // Tür kontrolü
      if (!validSpecies.includes(row.species)) {
        errors.push(`Satır ${rowNumber}: Geçersiz tür (${validSpecies.join(', ')} olmalı)`);
        return;
      }

      // Cinsiyet kontrolü
      if (!validGenders.includes(row.gender)) {
        errors.push(`Satır ${rowNumber}: Geçersiz cinsiyet (${validGenders.join(', ')} olmalı)`);
        return;
      }

      // Durum kontrolü (opsiyonel, varsayılan Aktif)
      const status = row.status || 'Aktif';
      if (!validStatuses.includes(status)) {
        errors.push(`Satır ${rowNumber}: Geçersiz durum (${validStatuses.join(', ')} olmalı)`);
        return;
      }

      // Tarih formatı kontrolü
      const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
      if (!dateRegex.test(row.date_of_birth)) {
        errors.push(`Satır ${rowNumber}: Geçersiz tarih formatı (YYYY-MM-DD olmalı)`);
        return;
      }

      valid.push({
        id: row.id.toString(),
        species: row.species,
        breed: row.breed.toString(),
        gender: row.gender,
        status: status,
        date_of_birth: row.date_of_birth
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
        species: row['Tür'] || row['Species'] || row['species'],
        breed: row['Cins'] || row['Breed'] || row['breed'],
        gender: row['Cinsiyet'] || row['Gender'] || row['gender'],
        status: row['Durum'] || row['Status'] || row['status'] || 'Aktif',
        date_of_birth: row['Doğum Tarihi'] || row['Birth Date'] || row['date_of_birth']
      }));

      return mappedData;
    } catch (error) {
      throw new Error('Excel dosyası işlenirken hata oluştu');
    }
  };

  const processPDFFile = async (file: File) => {
    try {
      // PDF işleme için basit metin çıkarma
      const text = await file.text();
      const lines = text.split('\n').filter(line => line.trim());
      
      // Basit CSV benzeri format varsayımı
      const data = [];
      for (let i = 1; i < lines.length; i++) { // İlk satır başlık
        const values = lines[i].split(/[,;\t]/);
        if (values.length >= 5) {
          data.push({
            id: values[0]?.trim(),
            species: values[1]?.trim(),
            breed: values[2]?.trim(),
            gender: values[3]?.trim(),
            date_of_birth: values[4]?.trim(),
            status: values[5]?.trim() || 'Aktif'
          });
        }
      }
      
      return data;
    } catch (error) {
      throw new Error('PDF dosyası işlenirken hata oluştu');
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setIsProcessing(true);
    setPreviewData([]);
    setErrors([]);

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
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Toplu Hayvan İçe Aktarma</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-sm">Dosya Formatı Bilgisi</CardTitle>
              <CardDescription>
                Excel (.xlsx) veya PDF dosyası yükleyebilirsiniz. Dosyanızda şu sütunlar bulunmalıdır:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-1">
                <p><strong>Küpe No:</strong> Hayvanın benzersiz kimlik numarası</p>
                <p><strong>Tür:</strong> İnek, Koyun, Keçi, Tavuk, Diğer</p>
                <p><strong>Cins:</strong> Hayvan cinsi (örn: Holstein)</p>
                <p><strong>Cinsiyet:</strong> Erkek, Dişi</p>
                <p><strong>Doğum Tarihi:</strong> YYYY-MM-DD formatında (örn: 2023-01-15)</p>
                <p><strong>Durum:</strong> Aktif, Hamile, Hasta (opsiyonel, varsayılan: Aktif)</p>
              </div>
            </CardContent>
          </Card>

          <div className="space-y-2">
            <Label htmlFor="file">Dosya Seç</Label>
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
                        <th className="text-left p-2">Cins</th>
                        <th className="text-left p-2">Cinsiyet</th>
                        <th className="text-left p-2">Durum</th>
                        <th className="text-left p-2">Doğum Tarihi</th>
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.slice(0, 10).map((animal, index) => (
                        <tr key={index} className="border-b">
                          <td className="p-2">{animal.id}</td>
                          <td className="p-2">{animal.species}</td>
                          <td className="p-2">{animal.breed}</td>
                          <td className="p-2">{animal.gender}</td>
                          <td className="p-2">{animal.status}</td>
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
