
import { Button } from "@/components/ui/button";
import { Plus, FileText, Upload } from "lucide-react";

interface AnimalPageHeaderProps {
  onAddAnimal: () => void;
  onBulkImport: () => void;
  onExportPDF: () => void;
  onExportExcel: () => void;
}

export const AnimalPageHeader = ({ 
  onAddAnimal, 
  onBulkImport, 
  onExportPDF, 
  onExportExcel 
}: AnimalPageHeaderProps) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-3xl font-bold">Hayvanlar</h1>
      <div className="flex items-center gap-2">
        <Button variant="outline" onClick={onBulkImport}>
          <Upload className="h-4 w-4 mr-2" />
          Toplu İçe Aktar
        </Button>
        <Button variant="outline" onClick={onExportPDF}>
          <FileText className="h-4 w-4 mr-2" />
          PDF Aktar
        </Button>
        <Button variant="outline" onClick={onExportExcel}>
          <FileText className="h-4 w-4 mr-2" />
          Excel Aktar
        </Button>
        <Button onClick={onAddAnimal}>
          <Plus className="h-4 w-4" />
          Yeni Hayvan Ekle
        </Button>
      </div>
    </div>
  );
};
