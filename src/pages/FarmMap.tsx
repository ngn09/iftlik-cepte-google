
import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { MapPin, Home, Truck, Droplets, Zap, Plus, Edit, Move, Square, MousePointer, Grid3X3, Users, Wheat, Trash2, Copy, Eye, EyeOff, Settings } from "lucide-react";
import { useAnimals } from "@/hooks/useAnimals";
import { useFeedStock } from "@/hooks/useFeedStock";
import FarmLocationEditor from "@/components/FarmLocationEditor";

interface MapLocation {
  id: string;
  name: string;
  type: 'Ahır' | 'Yem Deposu' | 'Su Deposu' | 'Ofis' | 'Makine Parkı' | 'Mera' | 'Padok';
  status: 'Aktif' | 'Bakımda' | 'Kapalı';
  coordinates: { x: number; y: number };
  size: { width: number; height: number };
  capacity?: number;
  currentOccupancy?: number;
  description: string;
  lastUpdated: string;
  animals?: {
    species: string;
    breed: string;
    count: number;
    feedType?: string;
  }[];
}

const FarmMap = () => {
  const { animals } = useAnimals();
  const { feedStock } = useFeedStock();
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MapLocation | null>(null);
  const [draggedLocation, setDraggedLocation] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [editingName, setEditingName] = useState<string | null>(null);
  const [tempName, setTempName] = useState('');
  const mapRef = useRef<HTMLDivElement>(null);

  // Sample farm locations with blueprint-style positioning
  const [locations, setLocations] = useState<MapLocation[]>([
    {
      id: "1",
      name: "Ana Ahır",
      type: "Ahır",
      status: "Aktif",
      coordinates: { x: 30, y: 25 },
      size: { width: 160, height: 100 },
      capacity: 150,
      currentOccupancy: 142,
      description: "Süt ineklerinin barındırıldığı ana ahır",
      lastUpdated: "2024-01-15",
      animals: [
        { species: "İnek", breed: "Holstein", count: 85, feedType: "Yüksek Proteinli Karma" },
        { species: "İnek", breed: "Simmental", count: 57, feedType: "Standart Karma" }
      ]
    },
    {
      id: "2",
      name: "Yem Deposu",
      type: "Yem Deposu",
      status: "Aktif",
      coordinates: { x: 65, y: 20 },
      size: { width: 100, height: 80 },
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
      coordinates: { x: 15, y: 65 },
      size: { width: 80, height: 80 },
      capacity: 10000,
      currentOccupancy: 8500,
      description: "Ana su deposu - 10.000 litre kapasiteli",
      lastUpdated: "2024-01-15"
    },
    {
      id: "4",
      name: "Kuzey Mera",
      type: "Mera",
      status: "Aktif",
      coordinates: { x: 45, y: 55 },
      size: { width: 140, height: 90 },
      capacity: 50,
      currentOccupancy: 35,
      description: "Kuzey taraftaki otlatma alanı",
      lastUpdated: "2024-01-15",
      animals: [
        { species: "İnek", breed: "Angus", count: 35, feedType: "Doğal Otlak" }
      ]
    }
  ]);

  // Handle global mouse events for dragging
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (draggedLocation && mapRef.current) {
        const rect = mapRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
        const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

        setLocations(prev => prev.map(loc =>
          loc.id === draggedLocation
            ? { 
                ...loc, 
                coordinates: { 
                  x: Math.max(5, Math.min(90, x)), 
                  y: Math.max(5, Math.min(90, y)) 
                } 
              }
            : loc
        ));
      }
    };

    const handleMouseUp = () => {
      setDraggedLocation(null);
      document.body.style.cursor = 'default';
    };

    if (draggedLocation) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'grabbing';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [draggedLocation, dragOffset]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'Ahır': return <Home className="h-5 w-5" />;
      case 'Yem Deposu': return <Wheat className="h-5 w-5" />;
      case 'Su Deposu': return <Droplets className="h-5 w-5" />;
      case 'Ofis': return <Home className="h-5 w-5" />;
      case 'Makine Parkı': return <Truck className="h-5 w-5" />;
      case 'Mera': return <MapPin className="h-5 w-5" />;
      case 'Padok': return <Square className="h-5 w-5" />;
      default: return <MapPin className="h-5 w-5" />;
    }
  };

  const getBlueprintColor = (type: string, isSelected: boolean) => {
    if (isSelected) return 'border-blue-500 bg-blue-50';
    
    switch (type) {
      case 'Ahır': return 'border-slate-600 bg-slate-50';
      case 'Yem Deposu': return 'border-amber-600 bg-amber-50';
      case 'Su Deposu': return 'border-cyan-600 bg-cyan-50';
      case 'Ofis': return 'border-purple-600 bg-purple-50';
      case 'Makine Parkı': return 'border-orange-600 bg-orange-50';
      case 'Mera': return 'border-green-600 bg-green-50';
      case 'Padok': return 'border-emerald-600 bg-emerald-50';
      default: return 'border-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Aktif': return 'bg-green-500';
      case 'Bakımda': return 'bg-yellow-500';
      case 'Kapalı': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getOccupancyPercentage = (location: MapLocation) => {
    if (!location.capacity || !location.currentOccupancy) return 0;
    return Math.round((location.currentOccupancy / location.capacity) * 100);
  };

  const handleMouseDown = (e: React.MouseEvent, locationId: string) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const rect = e.currentTarget.getBoundingClientRect();
    const mapRect = mapRef.current?.getBoundingClientRect();
    
    if (mapRect) {
      setDragOffset({
        x: e.clientX - rect.left - rect.width / 2,
        y: e.clientY - rect.top - rect.height / 2
      });
    }
    
    setDraggedLocation(locationId);
    setSelectedLocation(locations.find(l => l.id === locationId) || null);
  };

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !mapRef.current || draggedLocation) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newLocation: MapLocation = {
      id: `loc_${Date.now()}`,
      name: "Yeni Konum",
      type: "Padok",
      status: "Aktif",
      coordinates: { x, y },
      size: { width: 120, height: 80 },
      description: "",
      lastUpdated: new Date().toISOString().split('T')[0],
      animals: []
    };
    
    setLocations(prev => [...prev, newLocation]);
    setSelectedLocation(newLocation);
  };

  const handleNameEdit = (locationId: string, newName: string) => {
    setLocations(prev => prev.map(loc =>
      loc.id === locationId ? { ...loc, name: newName } : loc
    ));
    setEditingName(null);
    setTempName('');
  };

  const startNameEdit = (location: MapLocation) => {
    setEditingName(location.id);
    setTempName(location.name);
  };

  const deleteLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    if (selectedLocation?.id === locationId) {
      setSelectedLocation(null);
    }
  };

  const duplicateLocation = (location: MapLocation) => {
    const newLocation: MapLocation = {
      ...location,
      id: `loc_${Date.now()}`,
      name: `${location.name} (Kopya)`,
      coordinates: { 
        x: Math.min(85, location.coordinates.x + 5), 
        y: Math.min(85, location.coordinates.y + 5) 
      }
    };
    setLocations(prev => [...prev, newLocation]);
  };

  const openEditor = (location?: MapLocation) => {
    setEditingLocation(location || null);
    setIsEditorOpen(true);
  };

  const handleSaveLocation = (location: MapLocation) => {
    if (editingLocation) {
      setLocations(prev => prev.map(loc => loc.id === location.id ? location : loc));
    } else {
      setLocations(prev => [...prev, location]);
    }
    setSelectedLocation(location);
  };

  const handleDeleteLocation = (locationId: string) => {
    setLocations(prev => prev.filter(loc => loc.id !== locationId));
    setSelectedLocation(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6 relative">
      {/* Toolbar - Top Right Corner */}
      <div className="absolute top-6 right-6 z-10 flex items-center gap-3 bg-white rounded-2xl p-3 shadow-xl border">
        <Button
          variant={isEditMode ? 'default' : 'ghost'}
          size="sm"
          onClick={() => setIsEditMode(!isEditMode)}
          className="rounded-xl"
        >
          {isEditMode ? <Eye className="h-4 w-4 mr-2" /> : <Edit className="h-4 w-4 mr-2" />}
          {isEditMode ? 'Görünüm' : 'Düzenle'}
        </Button>
        
        {isEditMode && (
          <>
            <div className="w-px h-6 bg-slate-200" />
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowGrid(!showGrid)}
              className="rounded-xl"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Grid
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLocations([])}
              className="rounded-xl text-red-600 hover:text-red-700 hover:bg-red-50"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Temizle
            </Button>
          </>
        )}
        
        <div className="w-px h-6 bg-slate-200" />
        
        <Button
          onClick={() => openEditor()}
          className="rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700"
          size="sm"
        >
          <Plus className="h-4 w-4 mr-2" />
          Konum Ekle
        </Button>
      </div>

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-800 mb-2">Çiftlik Haritası</h1>
        <p className="text-slate-600">Interaktif çiftlik düzeni ve konumlandırma</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-6 md:grid-cols-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-700">Toplam Konum</CardTitle>
            <MapPin className="h-5 w-5 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-800">{locations.length}</div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-green-700">Aktif Konum</CardTitle>
            <Zap className="h-5 w-5 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-800">
              {locations.filter(l => l.status === 'Aktif').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700">Bakımda</CardTitle>
            <Truck className="h-5 w-5 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-yellow-800">
              {locations.filter(l => l.status === 'Bakımda').length}
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-purple-700">Ortalama Kapasite</CardTitle>
            <Home className="h-5 w-5 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-purple-800">
              {locations.filter(l => l.capacity && l.currentOccupancy).length > 0 
                ? Math.round(
                    locations
                      .filter(l => l.capacity && l.currentOccupancy)
                      .reduce((acc, l) => acc + getOccupancyPercentage(l), 0) /
                    locations.filter(l => l.capacity && l.currentOccupancy).length
                  )
                : 0}%
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
        {/* Blueprint Map */}
        <div className="xl:col-span-3">
          <Card className="shadow-2xl border-0 bg-white overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100">
              <CardTitle className="text-xl text-slate-800 flex items-center gap-2">
                <Grid3X3 className="h-5 w-5" />
                Çiftlik Kroki Haritası
              </CardTitle>
              <CardDescription>
                {isEditMode 
                  ? 'Konumları sürükleyerek taşıyın • Çift tıkla: Düzenle • Sağ tıkla: Seçenekler'
                  : 'Konum detayları için kutucuklara tıklayın • Düzenle butonuyla değişiklik yapın'
                }
              </CardDescription>
              {isEditMode && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <MousePointer className="h-4 w-4" />
                  <span>Düzenleme Modu Aktif - Sürükle & Bırak</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              <div 
                ref={mapRef}
                className={`relative overflow-hidden bg-slate-100 ${
                  isEditMode ? 'cursor-crosshair' : ''
                }`} 
                style={{ 
                  height: '700px',
                  backgroundImage: showGrid ? `
                    linear-gradient(rgba(148, 163, 184, 0.1) 1px, transparent 1px),
                    linear-gradient(90deg, rgba(148, 163, 184, 0.1) 1px, transparent 1px)
                  ` : 'none',
                  backgroundSize: showGrid ? '20px 20px' : 'none'
                }}
                onClick={handleMapClick}
              >
                {/* Blueprint style border */}
                <div className="absolute inset-4 border-2 border-dashed border-slate-400 rounded-lg pointer-events-none" />
                
                {/* Location Buildings */}
                {locations.map((location) => (
                  <div
                    key={location.id}
                    className={`absolute group transition-all duration-200 ${
                      selectedLocation?.id === location.id ? 'z-20' : 'z-10'
                    } ${
                      draggedLocation === location.id ? 'scale-105 shadow-2xl' : 'hover:scale-102'
                    }`}
                    style={{
                      left: `${location.coordinates.x}%`,
                      top: `${location.coordinates.y}%`,
                      width: `${location.size.width}px`,
                      height: `${location.size.height}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedLocation(location);
                    }}
                    onDoubleClick={(e) => {
                      e.stopPropagation();
                      openEditor(location);
                    }}
                    onContextMenu={(e) => {
                      e.preventDefault();
                      setSelectedLocation(location);
                    }}
                  >
                    {/* Blueprint Building */}
                    <div 
                      className={`
                        w-full h-full border-2 border-dashed transition-all duration-200 rounded-lg
                        ${getBlueprintColor(location.type, selectedLocation?.id === location.id)}
                        ${isEditMode ? 'cursor-move hover:shadow-lg' : 'cursor-pointer hover:shadow-md'}
                        ${draggedLocation === location.id ? 'rotate-1' : ''}
                        relative overflow-hidden
                      `}
                      onMouseDown={(e) => handleMouseDown(e, location.id)}
                    >
                      {/* Header with Icon and Status */}
                      <div className="absolute top-0 left-0 right-0 bg-white/90 border-b border-slate-200 p-2 flex items-center justify-between">
                        <div className="flex items-center gap-2 flex-1">
                          {getLocationIcon(location.type)}
                          {editingName === location.id ? (
                            <Input
                              value={tempName}
                              onChange={(e) => setTempName(e.target.value)}
                              onBlur={() => handleNameEdit(location.id, tempName)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') handleNameEdit(location.id, tempName);
                                if (e.key === 'Escape') {
                                  setEditingName(null);
                                  setTempName('');
                                }
                              }}
                              className="h-6 text-xs font-semibold border-0 p-0 focus:ring-1 focus:ring-blue-500"
                              autoFocus
                            />
                          ) : (
                            <span 
                              className="font-semibold text-xs truncate cursor-pointer hover:text-blue-600"
                              onClick={(e) => {
                                e.stopPropagation();
                                if (isEditMode) startNameEdit(location);
                              }}
                            >
                              {location.name}
                            </span>
                          )}
                        </div>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(location.status)}`} />
                      </div>
                      
                      {/* Content Area */}
                      <div className="absolute inset-0 pt-8 p-3 text-slate-600">
                        <div className="text-xs text-slate-500 mb-2">{location.type}</div>
                        
                        {location.animals && location.animals.length > 0 && (
                          <div className="space-y-1 mb-3">
                            {location.animals.slice(0, 2).map((animal, idx) => (
                              <div key={idx} className="flex items-center justify-between text-xs bg-white/50 px-2 py-1 rounded border">
                                <span className="truncate">{animal.breed}</span>
                                <Badge variant="secondary" className="text-xs h-4 bg-slate-200 text-slate-700 border-0">
                                  {animal.count}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        {location.capacity && (
                          <div className="absolute bottom-3 left-3 right-3">
                            <div className="text-xs mb-1 text-slate-600">
                              Doluluk: {getOccupancyPercentage(location)}%
                            </div>
                            <div className="w-full bg-slate-200 rounded-full h-1.5">
                              <div 
                                className="bg-slate-600 h-1.5 rounded-full transition-all"
                                style={{ width: `${getOccupancyPercentage(location)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Quick Actions for Selected Item */}
                      {selectedLocation?.id === location.id && isEditMode && (
                        <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1 bg-white rounded-lg shadow-lg border p-1">
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              openEditor(location);
                            }}
                          >
                            <Settings className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation();
                              duplicateLocation(location);
                            }}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 px-2 text-xs text-red-600 hover:bg-red-50"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLocation(location.id);
                            }}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                
                {/* Blueprint Legend */}
                <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur rounded-xl p-4 shadow-xl border border-slate-200">
                  <h4 className="font-semibold text-sm text-slate-700 mb-3">Kroki Lejantı</h4>
                  <div className="space-y-2 text-xs">
                    {[
                      { type: 'Ahır', icon: <Home className="h-3 w-3" /> },
                      { type: 'Yem Deposu', icon: <Wheat className="h-3 w-3" /> },
                      { type: 'Su Deposu', icon: <Droplets className="h-3 w-3" /> },
                      { type: 'Mera', icon: <MapPin className="h-3 w-3" /> },
                      { type: 'Padok', icon: <Square className="h-3 w-3" /> }
                    ].map(({ type, icon }) => (
                      <div key={type} className="flex items-center gap-2">
                        {icon}
                        <span className="text-slate-600">{type}</span>
                      </div>
                    ))}
                  </div>
                  {isEditMode && (
                    <div className="mt-3 pt-3 border-t border-slate-200 text-xs text-slate-500">
                      <div>• Sürükle: Konumu değiştir</div>
                      <div>• Çift tıkla: Detaylı düzenle</div>
                      <div>• İsim tıkla: Hızlı düzenle</div>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Location Details Panel */}
        <div>
          <Card className="shadow-xl border-0 bg-white sticky top-6">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <CardTitle className="text-xl text-slate-800">Konum Detayları</CardTitle>
              <CardDescription>
                {selectedLocation ? 'Seçili konumun detay bilgileri' : 'Detayları görmek için bir konum seçin'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {selectedLocation ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl border-2 border-dashed ${getBlueprintColor(selectedLocation.type, false)} shadow-md`}>
                      {getLocationIcon(selectedLocation.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-800">{selectedLocation.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className="text-xs">{selectedLocation.type}</Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedLocation.status)}`} />
                        <span className="text-sm text-slate-600">{selectedLocation.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  {selectedLocation.description && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Açıklama:</label>
                      <p className="text-sm text-slate-600 mt-1">{selectedLocation.description}</p>
                    </div>
                  )}
                  
                  {selectedLocation.animals && selectedLocation.animals.length > 0 && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Hayvan Bilgileri:</label>
                      <div className="mt-2 space-y-2">
                        {selectedLocation.animals.map((animal, idx) => (
                          <div key={idx} className="bg-slate-50 p-3 rounded-lg border border-slate-200">
                            <div className="flex justify-between items-start mb-2">
                              <div>
                                <p className="font-medium text-sm">{animal.species} - {animal.breed}</p>
                                <p className="text-xs text-slate-500">Sayı: {animal.count} baş</p>
                              </div>
                              <Badge variant="outline" className="text-xs bg-white">
                                {animal.count}
                              </Badge>
                            </div>
                            {animal.feedType && (
                              <div className="flex items-center gap-1 text-xs text-slate-500">
                                <Wheat className="h-3 w-3" />
                                <span>Rasyon: {animal.feedType}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Konum Koordinatları */}
                  <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <label className="text-sm font-semibold text-slate-700 flex items-center gap-2 mb-3">
                      <Move className="h-4 w-4" />
                      Konumlandırma
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">X Koordinatı (%)</label>
                        <Input
                          type="number"
                          min="5"
                          max="95"
                          value={Math.round(selectedLocation.coordinates.x)}
                          onChange={(e) => {
                            const x = Math.max(5, Math.min(95, parseFloat(e.target.value) || 0));
                            setLocations(prev => prev.map(loc =>
                              loc.id === selectedLocation.id
                                ? { ...loc, coordinates: { ...loc.coordinates, x } }
                                : loc
                            ));
                            setSelectedLocation(prev => prev ? { ...prev, coordinates: { ...prev.coordinates, x } } : null);
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                      <div>
                        <label className="text-xs text-slate-500 block mb-1">Y Koordinatı (%)</label>
                        <Input
                          type="number"
                          min="5"
                          max="95"
                          value={Math.round(selectedLocation.coordinates.y)}
                          onChange={(e) => {
                            const y = Math.max(5, Math.min(95, parseFloat(e.target.value) || 0));
                            setLocations(prev => prev.map(loc =>
                              loc.id === selectedLocation.id
                                ? { ...loc, coordinates: { ...loc.coordinates, y } }
                                : loc
                            ));
                            setSelectedLocation(prev => prev ? { ...prev, coordinates: { ...prev.coordinates, y } } : null);
                          }}
                          className="h-8 text-sm"
                        />
                      </div>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">
                      Konumu sürükleyerek de değiştirebilirsiniz (Düzenleme modunda)
                    </p>
                  </div>

                  {selectedLocation.capacity && (
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Kapasite Durumu:</label>
                      <div className="mt-2">
                        <div className="flex justify-between text-sm mb-2">
                          <span>{selectedLocation.currentOccupancy} / {selectedLocation.capacity}</span>
                          <span className="font-medium">{getOccupancyPercentage(selectedLocation)}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-3">
                          <div 
                            className="bg-gradient-to-r from-slate-500 to-slate-600 h-3 rounded-full transition-all"
                            style={{ width: `${getOccupancyPercentage(selectedLocation)}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                  
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-200">
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Koordinatlar:</label>
                      <p className="text-xs text-slate-600">
                        X: {Math.round(selectedLocation.coordinates.x)}%, Y: {Math.round(selectedLocation.coordinates.y)}%
                      </p>
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-700">Boyut:</label>
                      <p className="text-xs text-slate-600">
                        {selectedLocation.size.width} × {selectedLocation.size.height}px
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button 
                      size="sm" 
                      className="flex-1" 
                      onClick={() => openEditor(selectedLocation)}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Detaylı Düzenle
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => duplicateLocation(selectedLocation)}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Kopyala
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="text-center text-slate-500 py-12">
                  <Grid3X3 className="h-16 w-16 mx-auto mb-4 opacity-30" />
                  <p className="text-lg font-medium mb-2">Konum Seçin</p>
                  <p className="text-sm">Detayları görmek için haritadan bir konum seçin</p>
                  <div className="mt-4 text-xs text-slate-400">
                    <p>💡 İpucu: Düzenle modunda konumları sürükleyebilirsiniz</p>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Location Editor Dialog */}
      <FarmLocationEditor
        isOpen={isEditorOpen}
        onClose={() => setIsEditorOpen(false)}
        location={editingLocation}
        onSave={handleSaveLocation}
        onDelete={handleDeleteLocation}
      />
    </div>
  );
};

export default FarmMap;
