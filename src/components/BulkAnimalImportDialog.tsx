
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, Download, FileText, AlertCircle } from "lucide-react";
import { useBulkAnimalImport } from "@/hooks/useBulkAnimalImport";
import { FileFormatInfo } from "@/components/import/FileFormatInfo";
import { DocumentInfo } from "@/components/import/DocumentInfo";
import { ErrorDisplay } from "@/components/import/ErrorDisplay";
import { AnimalPreviewTable } from "@/components/import/AnimalPreviewTable";
import { createAnimalImportTemplate } from "@/utils/animalImportUtils";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BulkAnimalImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BulkAnimalImportDialog = ({ isOpen, onOpenChange }: BulkAnimalImportDialogProps) => {
  const { toast } = useToast();
  const {
    isProcessing,
    previewData,
    errors,
    documentInfo,
    handleFileChange,
    handleImport,
    resetState
  } = useBulkAnimalImport();

  const handleImportClick = async () => {
    const success = await handleImport();
    if (success) {
      onOpenChange(false);
      resetState();
    }
  };

  const handleDialogClose = () => {
    onOpenChange(false);
    resetState();
  };

  const handleDownloadTemplate = async () => {
    try {
      createAnimalImportTemplate();
      toast({
        title: "Başarılı",
        description: "Excel şablonu indirildi. Şablonu doldurup tekrar yükleyebilirsiniz."
      });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Şablon indirilirken hata oluştu."
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Toplu Hayvan İçe Aktarma</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              PDF dosyalarında sorun yaşıyorsanız, Excel şablonunu indirip kullanmanızı öneriyoruz.
            </AlertDescription>
          </Alert>

          <div className="flex flex-col sm:flex-row gap-4 p-4 bg-muted/50 rounded-lg">
            <div className="flex-1">
              <h3 className="font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                Excel Şablonu (Önerilen)
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                Hazır Excel şablonunu indirin, hayvan bilgilerinizi doldurun ve yükleyin.
              </p>
              <Button onClick={handleDownloadTemplate} variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Excel Şablonu İndir
              </Button>
            </div>
            <div className="flex-1">
              <h3 className="font-medium mb-2 flex items-center">
                <FileText className="h-4 w-4 mr-2" />
                PDF Belgesi
              </h3>
              <p className="text-sm text-muted-foreground mb-3">
                T.C. Tarım ve Orman Bakanlığı resmi belgelerini yükleyebilirsiniz.
              </p>
              <p className="text-xs text-amber-600">
                Not: PDF işlemede sorunlar yaşanabilir.
              </p>
            </div>
          </div>

          <FileFormatInfo />

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

          <DocumentInfo documentInfo={documentInfo} />
          <ErrorDisplay errors={errors} />
          <AnimalPreviewTable previewData={previewData} />

          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={handleDialogClose}>
              İptal
            </Button>
            <Button 
              onClick={handleImportClick}
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
