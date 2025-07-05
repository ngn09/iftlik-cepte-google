
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Info, CheckCircle, AlertTriangle } from "lucide-react";

export const FileFormatInfo = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm flex items-center gap-2">
          <Info className="h-4 w-4" />
          Dosya Formatları ve Öneriler
        </CardTitle>
        <CardDescription>
          En iyi sonuç için Excel şablonunu kullanmanızı öneriyoruz.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-3">
          <div className="bg-green-50 p-3 rounded-lg border border-green-200">
            <p className="font-medium text-green-800 flex items-center gap-2">
              <CheckCircle className="h-4 w-4" />
              Excel Şablonu (Önerilen)
            </p>
            <ul className="text-green-700 mt-1 space-y-1">
              <li>• %100 uyumlu format</li>
              <li>• Kolay doldurma</li>
              <li>• Hata riski minimum</li>
              <li>• Gerekli sütunlar: Küpe No, Irk, Cinsiyet, Doğum Tarihi</li>
            </ul>
          </div>
          
          <div className="bg-amber-50 p-3 rounded-lg border border-amber-200">
            <p className="font-medium text-amber-800 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              PDF Belgesi (Deneysel)
            </p>
            <ul className="text-amber-700 mt-1 space-y-1">
              <li>• T.C. Tarım Bakanlığı resmi belgeleri</li>
              <li>• "İŞLETMEDEKİ MEVCUT HAYVANLAR" tablosu</li>
              <li>• PDF kalitesine bağlı olarak hata olabilir</li>
              <li>• Sorun yaşarsanız Excel şablonunu kullanın</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
