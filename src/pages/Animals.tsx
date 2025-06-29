
import { useState } from "react";
import { useAnimals } from "@/hooks/useAnimals";
import { parseISO } from 'date-fns';
import AnimalFormDialog from "@/components/AnimalFormDialog";
import BulkAnimalImportDialog from "@/components/BulkAnimalImportDialog";
import { AnimalPageHeader } from "@/components/AnimalPageHeader";
import { AnimalStatistics } from "@/components/AnimalStatistics";
import { AnimalListSection } from "@/components/AnimalListSection";
import { AnimalPageSkeleton } from "@/components/AnimalPageSkeleton";

const Animals = () => {
  const { animals, isLoading } = useAnimals();
  const [filter, setFilter] = useState('');
  const [calfAgeLimit, setCalfAgeLimit] = useState(12);
  const [isFormDialogOpen, setIsFormDialogOpen] = useState(false);
  const [isBulkImportOpen, setIsBulkImportOpen] = useState(false);

  const getLatestUpdateDate = () => {
    if (animals.length === 0) return new Date();
    const dates = animals.map(a => parseISO(a.updated_at));
    return new Date(Math.max.apply(null, dates as any));
  };

  const handleExportPDF = () => {
    // PDF export functionality will be implemented later
    console.log("PDF export functionality");
  };

  const handleExportExcel = () => {
    // Excel export functionality will be implemented later
    console.log("Excel export functionality");
  };

  if (isLoading) {
    return <AnimalPageSkeleton />;
  }

  return (
    <div>
      <AnimalFormDialog 
        isOpen={isFormDialogOpen}
        onOpenChange={setIsFormDialogOpen}
      />
      
      <BulkAnimalImportDialog
        isOpen={isBulkImportOpen}
        onOpenChange={setIsBulkImportOpen}
      />
      
      <AnimalPageHeader
        onAddAnimal={() => setIsFormDialogOpen(true)}
        onBulkImport={() => setIsBulkImportOpen(true)}
        onExportPDF={handleExportPDF}
        onExportExcel={handleExportExcel}
      />
      
      <AnimalStatistics
        animals={animals}
        calfAgeLimit={calfAgeLimit}
        onCalfAgeLimitChange={setCalfAgeLimit}
      />

      <AnimalListSection
        animals={animals}
        filter={filter}
        onFilterChange={setFilter}
        latestUpdateDate={getLatestUpdateDate()}
      />
    </div>
  );
};

export default Animals;
