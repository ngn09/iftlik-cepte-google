
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DocumentInfo as DocumentInfoType } from "@/utils/animalImportUtils";

interface DocumentInfoProps {
  documentInfo: DocumentInfoType;
}

export const DocumentInfo = ({ documentInfo }: DocumentInfoProps) => {
  if (!documentInfo.institution) return null;

  return (
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
  );
};
