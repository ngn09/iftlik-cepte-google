
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload } from "lucide-react";
import { useBulkAnimalImport } from "@/hooks/useBulkAnimalImport";
import { FileFormatInfo } from "@/components/import/FileFormatInfo";
import { DocumentInfo } from "@/components/import/DocumentInfo";
import { ErrorDisplay } from "@/components/import/ErrorDisplay";
import { AnimalPreviewTable } from "@/components/import/AnimalPreviewTable";

interface BulkAnimalImportDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const BulkAnimalImportDialog = ({ isOpen, onOpenChange }: BulkAnimalImportDialogProps) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Toplu Hayvan İçe Aktarma</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <FileFormatInfo />

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
