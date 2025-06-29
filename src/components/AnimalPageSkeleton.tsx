
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Plus, FileText, Upload } from "lucide-react";

export const AnimalPageSkeleton = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Hayvanlar</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" disabled>
            <Upload className="h-4 w-4 mr-2" />
            Toplu İçe Aktar
          </Button>
          <Button variant="outline" disabled>
            <FileText className="h-4 w-4 mr-2" />
            PDF Aktar
          </Button>
          <Button variant="outline" disabled>
            <FileText className="h-4 w-4 mr-2" />
            Excel Aktar
          </Button>
          <Button disabled>
            <Plus className="h-4 w-4" />
            Yeni Hayvan Ekle
          </Button>
        </div>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-4" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-32" />
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-4 w-72" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-96 w-full" />
        </CardContent>
      </Card>
    </div>
  );
};
