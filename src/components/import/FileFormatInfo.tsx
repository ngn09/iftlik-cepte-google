
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info } from "lucide-react";

export const FileFormatInfo = () => {
  return (
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
  );
};
