import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock } from "lucide-react";
import { useAuditLogs } from "@/hooks/useAuditLogs";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";

const AuditLogTableSkeleton = () => (
  <div className="space-y-2">
    {[...Array(5)].map((_, i) => (
      <div key={i} className="flex items-center space-x-4 p-4">
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-40" />
      </div>
    ))}
  </div>
);

export function AuditLogTable() {
  const { auditLogs, isLoading } = useAuditLogs();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          Güvenlik Denetim Kayıtları
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading ? <AuditLogTableSkeleton /> : (
          <div className="space-y-4">
            {auditLogs.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <Shield className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Henüz denetim kaydı bulunmuyor.</p>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tarih</TableHead>
                    <TableHead>İşlem</TableHead>
                    <TableHead>Tablo</TableHead>
                    <TableHead>Detaylar</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log) => (
                    <TableRow key={log.id}>
                      <TableCell className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        {format(new Date(log.created_at), 'dd/MM/yyyy HH:mm')}
                      </TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          {log.action === 'role_change' ? 'Rol Değişikliği' : log.action}
                        </span>
                      </TableCell>
                      <TableCell>{log.table_name || '-'}</TableCell>
                      <TableCell>
                        {log.action === 'role_change' && log.old_values && log.new_values && (
                          <span className="text-sm">
                            {log.old_values.role} → {log.new_values.role}
                          </span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}