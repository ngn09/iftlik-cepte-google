
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

interface ErrorDisplayProps {
  errors: string[];
}

export const ErrorDisplay = ({ errors }: ErrorDisplayProps) => {
  if (errors.length === 0) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm text-red-600 flex items-center gap-2">
          <AlertTriangle className="h-4 w-4" />
          Hatalar ({errors.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-sm space-y-1 max-h-32 overflow-y-auto">
          {errors.map((error, index) => (
            <p key={index} className="text-red-600">{error}</p>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
