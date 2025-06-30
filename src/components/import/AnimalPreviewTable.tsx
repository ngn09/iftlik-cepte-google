
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AnimalImportData } from "@/utils/animalImportUtils";

interface AnimalPreviewTableProps {
  previewData: AnimalImportData[];
}

export const AnimalPreviewTable = ({ previewData }: AnimalPreviewTableProps) => {
  if (previewData.length === 0) return null;

  return (
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
  );
};
