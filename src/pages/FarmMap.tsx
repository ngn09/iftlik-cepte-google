import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Home, Truck, Droplets, Zap, Plus, Grid3X3, Users, Wheat, Edit, Move, Square, MousePointer, RotateCcw, Trash2, Copy, Eye, EyeOff } from "lucide-react";
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
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isEditMode, setIsEditMode] = useState(false);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<MapLocation | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isResizing, setIsResizing] = useState(false);
  const [draggedLocation, setDraggedLocation] = useState<string | null>(null);
  const [resizedLocation, setResizedLocation] = useState<string | null>(null);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [showGrid, setShowGrid] = useState(true);
  const [cursor, setCursor] = useState('default');
  const mapRef = useRef<HTMLDivElement>(null);

  // Global mouse event listeners
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isEditMode || !mapRef.current) return;

      if (isDragging && draggedLocation) {
        const rect = mapRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left - dragOffset.x) / rect.width) * 100;
        const y = ((e.clientY - rect.top - dragOffset.y) / rect.height) * 100;

        setLocations(prev => prev.map(loc =>
          loc.id === draggedLocation
            ? { ...loc, coordinates: { x: Math.max(0, Math.min(95, x)), y: Math.max(0, Math.min(95, y)) } }
            : loc
        ));
      } else if (isResizing && resizedLocation && resizeHandle) {
        const deltaX = e.clientX - startPosition.x;
        const deltaY = e.clientY - startPosition.y;
        
        setLocations(prev => prev.map(loc => {
          if (loc.id === resizedLocation) {
            let newWidth = originalSize.width;
            let newHeight = originalSize.height;
            
            switch (resizeHandle) {
              case 'se':
                newWidth = Math.max(60, originalSize.width + deltaX);
                newHeight = Math.max(40, originalSize.height + deltaY);
                break;
              case 'sw':
                newWidth = Math.max(60, originalSize.width - deltaX);
                newHeight = Math.max(40, originalSize.height + deltaY);
                break;
              case 'ne':
                newWidth = Math.max(60, originalSize.width + deltaX);
                newHeight = Math.max(40, originalSize.height - deltaY);
                break;
              case 'nw':
                newWidth = Math.max(60, originalSize.width - deltaX);
                newHeight = Math.max(40, originalSize.height - deltaY);
                break;
              case 'e':
                newWidth = Math.max(60, originalSize.width + deltaX);
                break;
              case 'w':
                newWidth = Math.max(60, originalSize.width - deltaX);
                break;
              case 'n':
                newHeight = Math.max(40, originalSize.height - deltaY);
                break;
              case 's':
                newHeight = Math.max(40, originalSize.height + deltaY);
                break;
            }
            
            return { ...loc, size: { width: newWidth, height: newHeight } };
          }
          return loc;
        }));
      }
    };

    const handleGlobalMouseUp = () => {
      if (isDragging || isResizing) {
        setIsDragging(false);
        setIsResizing(false);
        setDraggedLocation(null);
        setResizedLocation(null);
        setResizeHandle(null);
        setCursor('default');
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = cursor;
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
      document.body.style.cursor = 'default';
    };
  }, [isDragging, isResizing, draggedLocation, resizedLocation, resizeHandle, startPosition, originalSize, isEditMode, dragOffset, cursor]);

  // Sample farm locations
  const [locations, setLocations] = useState<MapLocation[]>([
    {
      id: "1",
      name: "Ana Ahır",
      type: "Ahır",
      status: "Aktif",
      coordinates: { x: 25, y: 20 },
      size: { width: 140, height: 90 },
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
      name: "Yem Deposu 1",
      type: "Yem Deposu",
      status: "Aktif",
      coordinates: { x: 70, y: 15 },
      size: { width: 80, height: 60 },
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
      coordinates: { x: 15, y: 70 },
      size: { width: 60, height: 60 },
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
      coordinates: { x: 45, y: 50 },
      size: { width: 120, height: 80 },
      capacity: 50,
      currentOccupancy: 35,
      description: "Kuzey taraftaki otlatma alanı",
      lastUpdated: "2024-01-15",
      animals: [
        { species: "İnek", breed: "Angus", count: 35, feedType: "Doğal Otlak" }
      ]
    }
  ]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'Ahır': return <Home className="h-4 w-4" />;
      case 'Yem Deposu': return <Wheat className="h-4 w-4" />;
      case 'Su Deposu': return <Droplets className="h-4 w-4" />;
      case 'Ofis': return <Home className="h-4 w-4" />;
      case 'Makine Parkı': return <Truck className="h-4 w-4" />;
      case 'Mera': return <MapPin className="h-4 w-4" />;
      case 'Padok': return <Square className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  const getLocationColor = (type: string) => {
    switch (type) {
      case 'Ahır': return 'from-blue-500 to-blue-600';
      case 'Yem Deposu': return 'from-amber-500 to-amber-600';
      case 'Su Deposu': return 'from-cyan-500 to-cyan-600';
      case 'Ofis': return 'from-purple-500 to-purple-600';
      case 'Makine Parkı': return 'from-orange-500 to-orange-600';
      case 'Mera': return 'from-green-500 to-green-600';
      case 'Padok': return 'from-emerald-500 to-emerald-600';
      default: return 'from-gray-500 to-gray-600';
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

  const handleMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isEditMode || !mapRef.current || isDragging || isResizing) return;
    
    const rect = mapRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    
    const newLocation: MapLocation = {
      id: `loc_${Date.now()}`,
      name: "Yeni Konum",
      type: "Padok",
      status: "Aktif",
      coordinates: { x, y },
      size: { width: 100, height: 70 },
      description: "",
      lastUpdated: new Date().toISOString().split('T')[0],
      animals: []
    };
    
    openEditor(newLocation);
  };

  const handleMouseDown = (e: React.MouseEvent, locationId: string, type: 'drag' | 'resize', handle?: string) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    const location = locations.find(l => l.id === locationId);
    if (!location) return;

    setSelectedLocation(location);
    
    if (type === 'drag') {
      const rect = mapRef.current?.getBoundingClientRect();
      if (rect) {
        const locationRect = e.currentTarget.getBoundingClientRect();
        setDragOffset({
          x: e.clientX - locationRect.left - locationRect.width / 2,
          y: e.clientY - locationRect.top - locationRect.height / 2
        });
      }
      setIsDragging(true);
      setDraggedLocation(locationId);
      setCursor('grabbing');
    } else if (type === 'resize') {
      setIsResizing(true);
      setResizedLocation(locationId);
      setResizeHandle(handle || '');
      setOriginalSize(location.size);
      setStartPosition({ x: e.clientX, y: e.clientY });
      setCursor(`${handle}-resize`);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-4xl font-bold text-slate-800 mb-2">Çiftlik Haritası</h1>
          <p className="text-slate-600">Çiftlik tesislerinizi görsel olarak yönetin</p>
        </div>
        
        {/* Toolbar */}
        <div className="flex items-center gap-3 bg-white rounded-2xl p-3 shadow-lg border">
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'map' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('map')}
              className="rounded-xl"
            >
              <Grid3X3 className="h-4 w-4 mr-2" />
              Harita
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-xl"
            >
              Liste
            </Button>
          </div>
          
          <div className="w-px h-6 bg-slate-200" />
          
          {viewMode === 'map' && (
            <>
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
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowGrid(!showGrid)}
                    className="rounded-xl"
                  >
                    <Grid3X3 className="h-4 w-4 mr-2" />
                    {showGrid ? 'Grid Gizle' : 'Grid Göster'}
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
        {/* Map/List View */}
        <div className="xl:col-span-3">
          <Card className="shadow-xl border-0 bg-white">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <CardTitle className="text-xl text-slate-800">
                {viewMode === 'map' ? 'Çiftlik Haritası' : 'Konum Listesi'}
              </CardTitle>
              <CardDescription>
                {viewMode === 'map' 
                  ? isEditMode 
                    ? 'Konumları sürükleyerek taşıyın, köşelerden tutarak boyutlandırın'
                    : 'Konum detayları için kutucuklara tıklayın'
                  : 'Tüm konumları liste halinde görüntüleyin'
                }
              </CardDescription>
              {isEditMode && (
                <div className="flex items-center gap-2 text-sm text-blue-600 bg-blue-50 px-3 py-2 rounded-lg">
                  <MousePointer className="h-4 w-4" />
                  <span>Düzenleme Modu Aktif</span>
                </div>
              )}
            </CardHeader>
            <CardContent className="p-0">
              {viewMode === 'map' ? (
                <div 
                  ref={mapRef}
                  className={`relative overflow-hidden bg-gradient-to-br from-green-50 via-green-100 to-emerald-50 ${
                    isEditMode ? 'cursor-crosshair' : ''
                  }`} 
                  style={{ height: '700px' }}
                  onClick={handleMapClick}
                >
                  {/* Grid Background */}
                  {showGrid && (
                    <div className="absolute inset-0 opacity-30">
                      <div className="absolute inset-0">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={`h-${i}`} className="absolute border-t border-emerald-300/50" style={{ top: `${i * 5}%`, width: '100%' }} />
                        ))}
                        {Array.from({ length: 20 }).map((_, i) => (
                          <div key={`v-${i}`} className="absolute border-l border-emerald-300/50" style={{ left: `${i * 5}%`, height: '100%' }} />
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {/* Location Buildings */}
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className={`absolute group transition-all duration-200 ${
                        selectedLocation?.id === location.id ? 'z-20' : 'z-10'
                      } ${
                        isEditMode ? 'hover:scale-105' : 'hover:scale-102'
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
                        if (isEditMode) {
                          openEditor(location);
                        }
                      }}
                    >
                      {/* Main Building */}
                      <div 
                        className={`
                          w-full h-full rounded-lg shadow-lg border-2 transition-all duration-200
                          bg-gradient-to-br ${getLocationColor(location.type)}
                          ${selectedLocation?.id === location.id ? 'border-blue-400 shadow-2xl ring-4 ring-blue-200' : 'border-white/50'}
                          ${isEditMode ? 'cursor-move hover:shadow-xl' : 'cursor-pointer'}
                          relative overflow-hidden
                        `}
                        onMouseDown={(e) => handleMouseDown(e, location.id, 'drag')}
                      >
                        {/* Header */}
                        <div className="absolute top-0 left-0 right-0 bg-black/20 text-white p-2 flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {getLocationIcon(location.type)}
                            <span className="font-semibold text-sm truncate">{location.name}</span>
                          </div>
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(location.status)} ring-2 ring-white`} />
                        </div>
                        
                        {/* Content */}
                        <div className="absolute inset-0 pt-10 p-3 text-white">
                          {location.animals && location.animals.length > 0 && (
                            <div className="space-y-1">
                              {location.animals.slice(0, 2).map((animal, idx) => (
                                <div key={idx} className="flex items-center justify-between text-xs bg-black/20 px-2 py-1 rounded">
                                  <span>{animal.breed}</span>
                                  <Badge variant="secondary" className="text-xs h-4 bg-white/20 text-white border-0">
                                    {animal.count}
                                  </Badge>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          {location.capacity && (
                            <div className="absolute bottom-3 left-3 right-3">
                              <div className="text-xs mb-1">Kapasite: {getOccupancyPercentage(location)}%</div>
                              <div className="w-full bg-black/20 rounded-full h-2">
                                <div 
                                  className="bg-white h-2 rounded-full transition-all"
                                  style={{ width: `${getOccupancyPercentage(location)}%` }}
                                />
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Edit Mode Controls */}
                        {isEditMode && selectedLocation?.id === location.id && (
                          <>
                            {/* Action Buttons */}
                            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 flex gap-1">
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-6 px-2 text-xs bg-white shadow-lg border"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditor(location);
                                }}
                              >
                                <Edit className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-6 px-2 text-xs bg-white shadow-lg border"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  duplicateLocation(location);
                                }}
                              >
                                <Copy className="h-3 w-3" />
                              </Button>
                              <Button
                                size="sm"
                                variant="secondary"
                                className="h-6 px-2 text-xs bg-white shadow-lg border text-red-600 hover:bg-red-50"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLocation(location.id);
                                }}
                              >
                                <Trash2 className="h-3 w-3" />
                              </Button>
                            </div>
                            
                            {/* Resize Handles */}
                            {['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'].map((handle) => {
                              const positionClass = {
                                'nw': '-top-2 -left-2 cursor-nw-resize',
                                'ne': '-top-2 -right-2 cursor-ne-resize',
                                'sw': '-bottom-2 -left-2 cursor-sw-resize',
                                'se': '-bottom-2 -right-2 cursor-se-resize',
                                'n': '-top-2 left-1/2 transform -translate-x-1/2 cursor-n-resize',
                                's': '-bottom-2 left-1/2 transform -translate-x-1/2 cursor-s-resize',
                                'e': '-right-2 top-1/2 transform -translate-y-1/2 cursor-e-resize',
                                'w': '-left-2 top-1/2 transform -translate-y-1/2 cursor-w-resize'
                              }[handle];
                              
                              return (
                                <div
                                  key={handle}
                                  className={`absolute w-4 h-4 bg-blue-500 border-2 border-white rounded-full hover:bg-blue-600 transition-colors shadow-lg ${positionClass}`}
                                  onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', handle)}
                                />
                              );
                            })}
                          </>
                        )}
                      </div>
                    </div>
                  ))}
                  
                  {/* Legend */}
                  <div className="absolute bottom-6 right-6 bg-white/95 backdrop-blur rounded-xl p-4 shadow-lg border">
                    <h4 className="font-semibold text-sm text-slate-700 mb-3">Lejant</h4>
                    <div className="space-y-2 text-xs">
                      {[
                        { type: 'Ahır', color: 'from-blue-500 to-blue-600' },
                        { type: 'Yem Deposu', color: 'from-amber-500 to-amber-600' },
                        { type: 'Su Deposu', color: 'from-cyan-500 to-cyan-600' },
                        { type: 'Mera', color: 'from-green-500 to-green-600' },
                        { type: 'Padok', color: 'from-emerald-500 to-emerald-600' }
                      ].map(({ type, color }) => (
                        <div key={type} className="flex items-center gap-2">
                          <div className={`w-4 h-3 rounded bg-gradient-to-r ${color}`} />
                          <span className="text-slate-600">{type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-6 space-y-4 max-h-[700px] overflow-y-auto">
                  {locations.map((location) => (
                    <Card 
                      key={location.id} 
                      className={`p-4 cursor-pointer hover:shadow-lg transition-all border-l-4 ${
                        selectedLocation?.id === location.id ? 'ring-2 ring-blue-200 bg-blue-50' : ''
                      }`}
                      style={{ borderLeftColor: location.type === 'Ahır' ? '#3b82f6' : location.type === 'Mera' ? '#10b981' : '#6b7280' }}
                      onClick={() => setSelectedLocation(location)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-4">
                          <div className={`p-3 rounded-lg bg-gradient-to-br ${getLocationColor(location.type)} text-white`}>
                            {getLocationIcon(location.type)}
                          </div>
                          <div>
                            <h3 className="font-semibold text-lg">{location.name}</h3>
                            <p className="text-sm text-muted-foreground mb-2">{location.description}</p>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline">{location.type}</Badge>
                              <div className={`w-2 h-2 rounded-full ${getStatusColor(location.status)}`} />
                              <span className="text-xs text-muted-foreground">{location.status}</span>
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          {location.capacity && (
                            <div className="text-sm font-medium">
                              {getOccupancyPercentage(location)}% dolu
                            </div>
                          )}
                          <div className="text-xs text-muted-foreground">
                            Son güncelleme: {new Date(location.lastUpdated).toLocaleDateString('tr-TR')}
                          </div>
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
          <Card className="shadow-xl border-0 bg-white sticky top-6">
            <CardHeader className="bg-gradient-to-r from-slate-50 to-slate-100 rounded-t-lg">
              <CardTitle className="text-xl text-slate-800">Konum Detayları</CardTitle>
              <CardDescription>
                {selectedLocation ? 'Seçili konumun detaylarını görüntüleyin' : 'Detayları görmek için bir konum seçin'}
              </CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              {selectedLocation ? (
                <div className="space-y-6">
                  <div className="flex items-center gap-4">
                    <div className={`p-4 rounded-xl bg-gradient-to-br ${getLocationColor(selectedLocation.type)} text-white shadow-lg`}>
                      {getLocationIcon(selectedLocation.type)}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-bold text-xl text-slate-800">{selectedLocation.name}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline">{selectedLocation.type}</Badge>
                        <div className={`w-2 h-2 rounded-full ${getStatusColor(selectedLocation.status)}`} />
                        <span className="text-sm text-slate-600">{selectedLocation.status}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-semibold text-slate-700">Açıklama:</label>
                      <p className="text-sm text-slate-600 mt-1">{selectedLocation.description}</p>
                    </div>
                    
                    {selectedLocation.animals && selectedLocation.animals.length > 0 && (
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Hayvan Bilgileri:</label>
                        <div className="mt-2 space-y-2">
                          {selectedLocation.animals.map((animal, idx) => (
                            <div key={idx} className="bg-slate-50 p-3 rounded-lg border">
                              <div className="flex justify-between items-start mb-2">
                                <div>
                                  <p className="font-medium text-sm">{animal.species} - {animal.breed}</p>
                                  <p className="text-xs text-muted-foreground">Sayı: {animal.count} baş</p>
                                </div>
                                <Badge variant="outline" className="text-xs">
                                  {animal.count}
                                </Badge>
                              </div>
                              {animal.feedType && (
                                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                  <Wheat className="h-3 w-3" />
                                  <span>Rasyon: {animal.feedType}</span>
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {selectedLocation.capacity && (
                      <div>
                        <label className="text-sm font-semibold text-slate-700">Kapasite:</label>
                        <div className="mt-2">
                          <div className="flex justify-between text-sm mb-1">
                            <span>{selectedLocation.currentOccupancy} / {selectedLocation.capacity}</span>
                            <span className="font-medium">{getOccupancyPercentage(selectedLocation)}%</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-3">
                            <div 
                              className="bg-gradient-to-r from-blue-500 to-blue-600 h-3 rounded-full transition-all"
                              style={{ width: `${getOccupancyPercentage(selectedLocation)}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Koordinatlar:</label>
                        <p className="text-xs text-slate-600">
                          X: {Math.round(selectedLocation.coordinates.x)}%, Y: {Math.round(selectedLocation.coordinates.y)}%
                        </p>
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-700">Boyut:</label>
                        <p className="text-xs text-slate-600">
                          {selectedLocation.size.width} x {selectedLocation.size.height}px
                        </p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 pt-4">
                    <Button size="sm" className="flex-1" onClick={() => openEditor(selectedLocation)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Düzenle
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
                <div className="text-center text-muted-foreground py-12">
                  <MapPin className="h-16 w-16 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium mb-2">Konum Seçin</p>
                  <p className="text-sm">Detayları görmek için haritadan veya listeden bir konum seçin</p>
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
