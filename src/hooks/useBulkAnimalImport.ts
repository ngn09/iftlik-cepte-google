
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAnimals } from "@/hooks/useAnimals";
import {
  AnimalImportData,
  DocumentInfo,
  validateAnimalData,
  processExcelFile,
  processPDFFile
} from "@/utils/animalImportUtils";

export const useBulkAnimalImport = () => {
  const { addAnimal } = useAnimals();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [previewData, setPreviewData] = useState<AnimalImportData[]>([]);
  const [errors, setErrors] = useState<string[]>([]);
  const [documentInfo, setDocumentInfo] = useState<DocumentInfo>({});

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    console.log('Dosya seçildi:', selectedFile.name, selectedFile.type, selectedFile.size);
    
    setFile(selectedFile);
    setIsProcessing(true);
    setPreviewData([]);
    setErrors([]);
    setDocumentInfo({});

    try {
      let rawData;
      let docInfo: DocumentInfo = {};
      
      if (selectedFile.type.includes('excel') || 
          selectedFile.name.endsWith('.xlsx') || 
          selectedFile.name.endsWith('.xls')) {
        console.log('Excel dosyası işleniyor...');
        rawData = await processExcelFile(selectedFile);
      } else if (selectedFile.type === 'application/pdf' || 
                 selectedFile.name.endsWith('.pdf')) {
        console.log('PDF dosyası işleniyor...');
        const result = await processPDFFile(selectedFile);
        rawData = result.data;
        docInfo = result.documentInfo;
        setDocumentInfo(docInfo);
        console.log('PDF işleme tamamlandı, veri sayısı:', rawData.length);
      } else {
        throw new Error('Desteklenmeyen dosya formatı. Lütfen Excel (.xlsx) veya PDF dosyası seçin.');
      }

      console.log('Ham veri:', rawData);
      
      const { valid, errors } = validateAnimalData(rawData);
      console.log('Doğrulama sonucu - Geçerli:', valid.length, 'Hatalı:', errors.length);
      
      setPreviewData(valid);
      setErrors(errors);

      if (valid.length === 0 && errors.length > 0) {
        toast({
          variant: "destructive",
          title: "Hata",
          description: "Dosyada geçerli hayvan verisi bulunamadı. Detaylar için hata listesini kontrol edin."
        });
      } else if (valid.length > 0) {
        toast({
          title: "Başarılı",
          description: `${valid.length} hayvan kaydı başarıyla okundu.${errors.length > 0 ? ` ${errors.length} hata ile karşılaşıldı.` : ''}`
        });
      }
    } catch (error) {
      console.error('Dosya işleme hatası:', error);
      const errorMessage = error instanceof Error ? error.message : "Dosya işlenirken hata oluştu";
      setErrors([errorMessage]);
      toast({
        variant: "destructive",
        title: "Dosya İşleme Hatası",
        description: errorMessage
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
      return false;
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

    return successCount > 0;
  };

  const resetState = () => {
    setFile(null);
    setPreviewData([]);
    setErrors([]);
    setDocumentInfo({});
  };

  return {
    file,
    isProcessing,
    previewData,
    errors,
    documentInfo,
    handleFileChange,
    handleImport,
    resetState
  };
};
