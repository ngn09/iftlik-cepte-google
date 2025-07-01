
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Wrench, Calendar, DollarSign, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { InventoryItem } from '@/hooks/useInventory';
import { useInventory } from '@/hooks/useInventory';

const InventoryItemDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { inventory, isLoading } = useInventory();
  const [item, setItem] = useState<InventoryItem | null>(null);

  useEffect(() => {
    if (inventory && id) {
      const foundItem = inventory.find(item => item.id === parseInt(id));
      setItem(foundItem || null);
    }
  }, [inventory, id]);

  if (isLoading) {
    return <div className="p-6">Yükleniyor...</div>;
  }

  if (!item) {
    return (
      <div className="p-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Öğe Bulunamadı</h2>
          <p className="text-muted-foreground mb-4">Aradığınız demirbaş öğesi bulunamadı.</p>
          <Button onClick={() => navigate('/inventory')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Envanteri Geri Dön
          </Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif': return 'bg-green-100 text-green-800';
      case 'Bakımda': return 'bg-yellow-100 text-yellow-800';
      case 'Arızalı': return 'bg-red-100 text-red-800';
      case 'Arşivlendi': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Araç': return '🚗';
      case 'Ekipman': return '🔧';
      case 'Makine': return '⚙️';
      default: return '📦';
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={() => navigate('/inventory')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Envanteri Geri Dön
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <span className="text-2xl">{getCategoryIcon(item.category)}</span>
              {item.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Badge className={getStatusColor(item.status)}>
                {item.status}
              </Badge>
              <Badge variant="outline">{item.category}</Badge>
            </div>
            
            {item.description && (
              <div>
                <h3 className="font-semibold mb-2">Açıklama</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Mali Bilgiler
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-1">Değer</h3>
              <p className="text-2xl font-bold text-green-600">
                ₺{item.value.toLocaleString('tr-TR')}
              </p>
            </div>
            <Separator />
            <div>
              <h3 className="font-semibold mb-1">Satın Alma Tarihi</h3>
              <p className="text-muted-foreground">
                {new Date(item.purchase_date).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wrench className="h-5 w-5" />
              Bakım Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {item.last_maintenance && (
              <div>
                <h3 className="font-semibold mb-1">Son Bakım</h3>
                <p className="text-muted-foreground">
                  {new Date(item.last_maintenance).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}
            
            {item.next_maintenance && (
              <div>
                <h3 className="font-semibold mb-1">Sonraki Bakım</h3>
                <p className="text-muted-foreground flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  {new Date(item.next_maintenance).toLocaleDateString('tr-TR')}
                </p>
                {new Date(item.next_maintenance) < new Date() && (
                  <div className="flex items-center gap-2 text-red-600 text-sm">
                    <AlertTriangle className="h-4 w-4" />
                    Bakım tarihi geçmiş
                  </div>
                )}
              </div>
            )}
            
            {!item.last_maintenance && !item.next_maintenance && (
              <p className="text-muted-foreground text-sm">
                Henüz bakım bilgisi eklenmemiş.
              </p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistem Bilgileri</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div>
              <h3 className="font-semibold mb-1">Oluşturulma</h3>
              <p className="text-muted-foreground text-sm">
                {new Date(item.created_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-1">Son Güncelleme</h3>
              <p className="text-muted-foreground text-sm">
                {new Date(item.updated_at).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InventoryItemDetails;
