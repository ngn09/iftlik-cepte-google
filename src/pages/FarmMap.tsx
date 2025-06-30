
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Barn, Truck, Droplets, Zap, Home, Plus } from "lucide-react";

interface MapLocation {
  id: string;
  name: string;
  type: 'Ahır' | 'Yem Deposu' | 'Su Deposu' | 'Ofis' | 'Makine Parkı' | 'Mera' | 'Diğer';
  status: 'Aktif' | 'Bakımda' | 'Kapalı';
  coordinates: { x: number; y: number };
  capacity?: number;
  currentOccupancy?: number;
  description: string;
  lastUpdated: string;
}

const FarmMap = () => {
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');

  // Sample farm locations - in real app this would come from database
  const [locations] = useState<MapLocation[]>([
    {
      id: "1",
      name: "Ana Ahır",
      type: "Ahır",
      status: "Aktif",
      coordinates: { x: 40, y: 30 },
      capacity: 150,
      currentOccupancy: 142,
      description: "Süt ineklerinin barındırıldığı ana ahır",
      lastUpdated: "2024-01-15"
    },
    {
      id: "2",
      name: "Yem Deposu 1",
      type: "Yem Deposu",
      status: "Aktif",
      coordinates: { x: 70, y: 20 },
      capacity: 500,
      currentOccupancy: 320,
      description: "Ana yem deposu - karma yem ve saman",
      lastUpdated: "2024-01-15"
    },
    {
      id: "3",
      name: "Su Deposu",
      type: "Su Deposu",
      status: "Aktif",
      coordinates: { x: 20, y: 60 },
      capacity: 10000,
      currentOccupancy: 8500,
      description: "Ana su deposu - 10.000 litre kapasiteli",
      lastUpdated: "2024-01-15"
    },
    {
      id: "4",
      name: "Ofis Binası",
      type: "Ofis",
      status: "Aktif",
      coordinates: { x: 80, y: 70 },
      description: "Yönetim ofisi ve misafir evi",
      lastUpdated: "2024-01-15"
    },
    {
      id: "5",
      name: "Makine Parkı",
      type: "Makine Parkı",
      status: "Aktif",
      coordinates: { x: 60, y: 80 },
      description: "Traktör ve tarım makineleri park alanı",
      lastUpdated: "2024-01-15"
    },
    {
      id: "6",
      name: "Kuzey Mera",
      type: "Mera",
      status: "Aktif",
      coordinates: { x: 30, y: 10 },
      capacity: 50,
      currentOccupancy: 35,
      description: "Kuzey taraftaki otlatma alanı",
      lastUpdated: "2024-01-15"
    }
  ]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'Ahır': return <Barn className="h-6 w-6" />;
      case 'Yem Deposu': return <Home className="h-6 w-6" />;
      case 'Su Deposu': return <Droplets className="h-6 w-6" />;
      case 'Ofis': return <Home className="h-6 w-6" />;
      case 'Makine Parkı': return <Truck className="h-6 w-6" />;
      case 'Mera': return <MapPin className="h-6 w-6" />;
      default: return <MapPin className="h-6 w-6" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif': return 'bg-green-100 text-green-800 border-green-200';
      case 'Bakımda': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Kapalı': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'Ahır': return 'bg-blue-500';
      case 'Yem Deposu': return 'bg-green-500';
      case 'Su Deposu': return 'bg-cyan-500';
      case 'Ofis': return 'bg-purple-500';
      case 'Makine Parkı': return 'bg-orange-500';
      case 'Mera': return 'bg-emerald-500';
      default: return 'bg-gray-500';
    }
  };

  const getOccupancyPercentage = (location: MapLocation) => {
    if (!location.capacity || !location.currentOccupancy) return 0;
    return Math.round((location.currentOccupancy / location.capacity) * 100);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Çiftlik Haritası</h1>
        <div className="flex gap-2">
          <Button
            variant={viewMode === 'map' ? 'default' : 'outline'}
            onClick={() => setViewMode('map')}
          >
            Harita Görünümü
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'outline'}
            onClick={() => setViewMode('list')}
          >
            Liste Görünümü
          </Button>
          <Button>
            <Plus className="h-4 w-4" />
            Konum Ekle
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Toplam Konum</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{locations.length}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Aktif Konum</CardTitle>
            <Zap className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {locations.filter(l => l.status === 'Aktif').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Bakımda</CardTitle>
            <Truck className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {locations.filter(l => l.status === 'Bakımda').length}
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Ortalama Kapasite</CardTitle>
            <Barn className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {Math.round(
                locations
                  .filter(l => l.capacity && l.currentOccupancy)
                  .reduce((acc, l) => acc + getOccupancyPercentage(l), 0) /
                locations.filter(l => l.capacity && l.currentOccupancy).length
              )}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map/List View */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>
                {viewMode === 'map' ? 'Çiftlik Haritası' : 'Konum Listesi'}
              </CardTitle>
              <CardDescription>
                {viewMode === 'map' 
                  ? 'Çiftlik konumlarını harita üzerinde görüntüleyin.'
                  : 'Tüm konumları liste halinde görüntüleyin.'
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {viewMode === 'map' ? (
                <div className="relative bg-green-100 rounded-lg overflow-hidden" style={{ height: '500px' }}>
                  {/* Farm Map Background */}
                  <div className="absolute inset-0 bg-gradient-to-b from-green-200 to-green-300">
                    {/* Grid lines for better visualization */}
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={`h-${i}`} className="absolute border-t border-green-400" style={{ top: `${i * 10}%`, width: '100%' }} />
                      ))}
                      {Array.from({ length: 10 }).map((_, i) => (
                        <div key={`v-${i}`} className="absolute border-l border-green-400" style={{ left: `${i * 10}%`, height: '100%' }} />
                      ))}
                    </div>
                  </div>
                  
                  {/* Location Markers */}
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className={`absolute cursor-pointer transform -translate-x-1/2 -translate-y-1/2 ${getLocationColor(location.type)} rounded-full p-2 text-white shadow-lg hover:scale-110 transition-transform`}
                      style={{
                        left: `${location.coordinates.x}%`,
                        top: `${location.coordinates.y}%`
                      }}
                      onClick={() => setSelectedLocation(location)}
                      title={location.name}
                    >
                      {getLocationIcon(location.type)}
                    </div>
                  ))}
                  
                  {/* Legend */}
                  <div className="absolute top-4 right-4 bg-white rounded-lg p-4 shadow-lg">
                    <h4 className="font-semibold mb-2">Konum Türleri</h4>
                    <div className="space-y-1 text-sm">
                      {Array.from(new Set(locations.map(l => l.type))).map(type => (
                        <div key={type} className="flex items-center gap-2">
                          <div className={`w-3 h-3 rounded-full ${getLocationColor(type)}`} />
                          <span>{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  {locations.map((location) => (
                    <Card 
                      key={location.id} 
                      className="p-4 cursor-pointer hover:shadow-md transition-shadow"
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`${getLocationColor(location.type)} rounded-full p-2 text-white`}>
                            {getLocationIcon(location.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold">{location.name}</h3>
                            <p className="text-sm text-muted-foreground">{location.description}</p>
                          </div>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <Badge className={getStatusColor(location.status)}>
                            {location.status}
                          </Badge>
                          {location.capacity && (
                            <span className="text-sm text-muted-foreground">
                              {getOccupancyPercentage(location)}% dolu
                            </span>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Location Details */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Konum Detayları</CardTitle>
              <CardDescription>
                {selectedLocation ? 'Seçili konumun detaylarını görüntüleyin.' : 'Detayları görmek için bir konum seçin.'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {selectedLocation ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className={`${getLocationColor(selectedLocation.type)} rounded-full p-3 text-white`}>
                      {getLocationIcon(selectedLocation.type)}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{selectedLocation.name}</h3>
                      <Badge className={getStatusColor(selectedLocation.status)}>
                        {selectedLocation.status}
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium">Tür:</label>
                      <p className="text-sm">{selectedLocation.type}</p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Açıklama:</label>
                      <p className="text-sm">{selectedLocation.description}</p>
                    </div>
                    
                    {selectedLocation.capacity && (
                      <div>
                        <label className="text-sm font-medium">Kapasite:</label>
                        <p className="text-sm">
                          {selectedLocation.currentOccupancy} / {selectedLocation.capacity} 
                          <span className="text-muted-foreground ml-2">
                            ({getOccupancyPercentage(selectedLocation)}% dolu)
                          </span>
                        </p>
                        <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                          <div 
                            className="bg-blue-600 h-2 rounded-full transition-all"
                            style={{ width: `${getOccupancyPercentage(selectedLocation)}%` }}
                          />
                        </div>
                      </div>
                    )}
                    
                    <div>
                      <label className="text-sm font-medium">Son Güncelleme:</label>
                      <p className="text-sm">
                        {new Date(selectedLocation.lastUpdated).toLocaleDateString('tr-TR')}
                      </p>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Koordinatlar:</label>
                      <p className="text-sm">
                        X: {selectedLocation.coordinates.x}%, Y: {selectedLocation.coordinates.y}%
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="w-full">
                      Düzenle
                    </Button>
                    <Button variant="outline" size="sm" className="w-full">
                      Konum Geçmişi
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-8">
                  <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>Detayları görmek için haritadan veya listeden bir konum seçin.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default FarmMap;
