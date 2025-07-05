import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MapPin, Home, Truck, Droplets, Zap, Plus, Grid3X3, Users, Wheat, Edit, Move, Square } from "lucide-react";
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
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [draggedLocation, setDraggedLocation] = useState<string | null>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeHandle, setResizeHandle] = useState<string | null>(null);
  const [resizedLocation, setResizedLocation] = useState<string | null>(null);
  const [originalSize, setOriginalSize] = useState({ width: 0, height: 0 });
  const [startPosition, setStartPosition] = useState({ x: 0, y: 0 });
  const mapRef = useRef<HTMLDivElement>(null);

  // Global mouse event listeners for drag and resize
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      if (!isEditMode || !mapRef.current) return;

      if (isDragging && draggedLocation) {
        const rect = mapRef.current.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;

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
                newWidth = Math.max(40, originalSize.width + deltaX);
                newHeight = Math.max(30, originalSize.height + deltaY);
                break;
              case 'sw':
                newWidth = Math.max(40, originalSize.width - deltaX);
                newHeight = Math.max(30, originalSize.height + deltaY);
                break;
              case 'ne':
                newWidth = Math.max(40, originalSize.width + deltaX);
                newHeight = Math.max(30, originalSize.height - deltaY);
                break;
              case 'nw':
                newWidth = Math.max(40, originalSize.width - deltaX);
                newHeight = Math.max(30, originalSize.height - deltaY);
                break;
              case 'e':
                newWidth = Math.max(40, originalSize.width + deltaX);
                break;
              case 'w':
                newWidth = Math.max(40, originalSize.width - deltaX);
                break;
              case 'n':
                newHeight = Math.max(30, originalSize.height - deltaY);
                break;
              case 's':
                newHeight = Math.max(30, originalSize.height + deltaY);
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
      }
    };

    if (isDragging || isResizing) {
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleGlobalMouseMove);
      document.removeEventListener('mouseup', handleGlobalMouseUp);
    };
  }, [isDragging, isResizing, draggedLocation, resizedLocation, resizeHandle, startPosition, originalSize, isEditMode]);

  // Sample farm locations - in real app this would come from database
  const [locations, setLocations] = useState<MapLocation[]>([
    {
      id: "1",
      name: "Ana Ahır",
      type: "Ahır",
      status: "Aktif",
      coordinates: { x: 40, y: 30 },
      size: { width: 120, height: 80 },
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
      coordinates: { x: 70, y: 20 },
      size: { width: 60, height: 40 },
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
      size: { width: 40, height: 40 },
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
      size: { width: 50, height: 30 },
      description: "Yönetim ofisi ve misafir evi",
      lastUpdated: "2024-01-15"
    },
    {
      id: "5",
      name: "Makine Parkı",
      type: "Makine Parkı",
      status: "Aktif",
      coordinates: { x: 60, y: 80 },
      size: { width: 80, height: 50 },
      description: "Traktör ve tarım makineleri park alanı",
      lastUpdated: "2024-01-15"
    },
    {
      id: "6",
      name: "Kuzey Mera",
      type: "Mera",
      status: "Aktif",
      coordinates: { x: 30, y: 10 },
      size: { width: 100, height: 60 },
      capacity: 50,
      currentOccupancy: 35,
      description: "Kuzey taraftaki otlatma alanı",
      lastUpdated: "2024-01-15",
      animals: [
        { species: "İnek", breed: "Angus", count: 35, feedType: "Doğal Otlak" }
      ]
    },
    {
      id: "7",
      name: "Padok A1",
      type: "Padok",
      status: "Aktif",
      coordinates: { x: 45, y: 40 },
      size: { width: 30, height: 25 },
      capacity: 20,
      currentOccupancy: 18,
      description: "Genç düveler için padok",
      lastUpdated: "2024-01-15",
      animals: [
        { species: "İnek", breed: "Holstein", count: 18, feedType: "Büyüme Rasyonu" }
      ]
    },
    {
      id: "8",
      name: "Padok A2",
      type: "Padok",
      status: "Aktif",
      coordinates: { x: 55, y: 40 },
      size: { width: 30, height: 25 },
      capacity: 15,
      currentOccupancy: 12,
      description: "Damızlık inekler için padok",
      lastUpdated: "2024-01-15",
      animals: [
        { species: "İnek", breed: "Jersey", count: 12, feedType: "Damızlık Rasyonu" }
      ]
    }
  ]);

  const getLocationIcon = (type: string) => {
    switch (type) {
      case 'Ahır': return <Home className="h-6 w-6" />;
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

  // Editor handlers
  const openEditor = (location?: MapLocation) => {
    setEditingLocation(location || null);
    setIsEditorOpen(true);
  };

  const handleSaveLocation = (location: MapLocation) => {
    if (editingLocation) {
      // Update existing location
      setLocations(prev => prev.map(loc => loc.id === location.id ? location : loc));
    } else {
      // Add new location
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
    
    // Create new location at click position
    const newLocation: MapLocation = {
      id: `loc_${Date.now()}`,
      name: "Yeni Konum",
      type: "Padok",
      status: "Aktif",
      coordinates: { x, y },
      size: { width: 80, height: 60 },
      description: "",
      lastUpdated: new Date().toISOString().split('T')[0],
      animals: []
    };
    
    openEditor(newLocation);
  };

  // Drag and resize handlers
  const handleMouseDown = (e: React.MouseEvent, locationId: string, type: 'drag' | 'resize', handle?: string) => {
    if (!isEditMode) return;
    
    e.preventDefault();
    e.stopPropagation();
    
    if (type === 'drag') {
      setIsDragging(true);
      setDraggedLocation(locationId);
      setSelectedLocation(locations.find(l => l.id === locationId) || null);
    } else if (type === 'resize') {
      setIsResizing(true);
      setResizedLocation(locationId);
      setResizeHandle(handle || '');
      const location = locations.find(l => l.id === locationId);
      if (location) {
        setOriginalSize(location.size);
        setStartPosition({ x: e.clientX, y: e.clientY });
        setSelectedLocation(location);
      }
    }
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
          {viewMode === 'map' && (
            <Button
              variant={isEditMode ? 'default' : 'outline'}
              onClick={() => setIsEditMode(!isEditMode)}
            >
              <Edit className="h-4 w-4 mr-1" />
              {isEditMode ? 'Düz. Modu' : 'Düzenle'}
            </Button>
          )}
          <Button onClick={() => openEditor()}>
            <Plus className="h-4 w-4 mr-1" />
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
            <Home className="h-4 w-4 text-blue-600" />
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
                <div 
                  ref={mapRef}
                  className={`relative bg-slate-900 rounded-lg overflow-hidden border-2 border-slate-600 ${
                    isEditMode ? 'cursor-crosshair' : ''
                  }`} 
                  style={{ height: '600px' }}
                  onClick={handleMapClick}
                >
                  {/* Edit Mode Indicator */}
                  {isEditMode && (
                    <div className="absolute top-2 left-2 bg-blue-600 text-white px-2 py-1 rounded text-xs font-mono z-20">
                      DÜZENLEME MODU - Tıklayarak konum ekleyin
                    </div>
                  )}
                  {/* Blueprint Grid Background */}
                  <div className="absolute inset-0">
                    {/* Major grid lines */}
                    <div className="absolute inset-0 opacity-40">
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={`major-h-${i}`} className="absolute border-t border-slate-500" style={{ top: `${i * 5}%`, width: '100%' }} />
                      ))}
                      {Array.from({ length: 20 }).map((_, i) => (
                        <div key={`major-v-${i}`} className="absolute border-l border-slate-500" style={{ left: `${i * 5}%`, height: '100%' }} />
                      ))}
                    </div>
                    {/* Minor grid lines */}
                    <div className="absolute inset-0 opacity-20">
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div key={`minor-h-${i}`} className="absolute border-t border-slate-600" style={{ top: `${i * 1}%`, width: '100%' }} />
                      ))}
                      {Array.from({ length: 100 }).map((_, i) => (
                        <div key={`minor-v-${i}`} className="absolute border-l border-slate-600" style={{ left: `${i * 1}%`, height: '100%' }} />
                      ))}
                    </div>
                  </div>
                  
                   {/* Location Buildings/Areas */}
                   {locations.map((location) => (
                      <div
                        key={location.id}
                        className={`absolute group transition-all duration-200 hover:scale-105 ${
                          isEditMode ? 'cursor-move' : 'cursor-pointer'
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
                        onMouseDown={(e) => handleMouseDown(e, location.id, 'drag')}
                      >
                       {/* Building Rectangle */}
                       <div className={`
                         w-full h-full border-2 border-slate-300 bg-slate-800/80 rounded-sm
                         ${selectedLocation?.id === location.id ? 'border-blue-400 bg-blue-900/40' : ''}
                         ${location.type === 'Ahır' ? 'border-blue-400' : ''}
                         ${location.type === 'Padok' ? 'border-green-400' : ''}
                         ${location.type === 'Yem Deposu' ? 'border-yellow-400' : ''}
                         ${location.type === 'Su Deposu' ? 'border-cyan-400' : ''}
                         ${location.type === 'Mera' ? 'border-emerald-400 bg-emerald-900/20' : ''}
                         relative overflow-hidden
                       `}>
                         {/* Location Name */}
                         <div className="absolute top-1 left-1 text-xs text-slate-200 font-mono">
                           {location.name}
                         </div>
                         
                         {/* Type Badge */}
                         <div className="absolute top-1 right-1">
                           <Badge variant="secondary" className="text-xs h-5">
                             {location.type}
                           </Badge>
                         </div>
                         
                         {/* Quick Edit Button - only in edit mode */}
                         {isEditMode && (
                           <div className="absolute top-1 left-1/2 transform -translate-x-1/2">
                             <Button
                               size="sm"
                               variant="outline"
                               className="h-5 px-1 text-xs bg-slate-700/90 border-slate-500 text-slate-200 hover:bg-slate-600"
                               onClick={(e) => {
                                 e.stopPropagation();
                                 openEditor(location);
                               }}
                             >
                               <Edit className="h-3 w-3" />
                             </Button>
                           </div>
                         )}
                         
                         {/* Animal Information */}
                         {location.animals && location.animals.length > 0 && (
                           <div className="absolute bottom-1 left-1 right-1 space-y-1">
                             {location.animals.map((animal, idx) => (
                               <div key={idx} className="flex items-center justify-between text-xs text-slate-300 bg-slate-700/80 px-1 py-0.5 rounded">
                                 <div className="flex items-center gap-1">
                                   <Users className="h-3 w-3" />
                                   <span>{animal.breed}</span>
                                 </div>
                                 <Badge variant="outline" className="text-xs h-4 text-slate-300 border-slate-500">
                                   {animal.count}
                                 </Badge>
                               </div>
                             ))}
                             {location.animals[0]?.feedType && (
                               <div className="flex items-center gap-1 text-xs text-slate-400">
                                 <Wheat className="h-3 w-3" />
                                 <span className="truncate">{location.animals[0].feedType}</span>
                               </div>
                             )}
                           </div>
                         )}
                         
                         {/* Capacity Info for Non-Animal Locations */}
                         {!location.animals && location.capacity && (
                           <div className="absolute bottom-1 left-1 right-1">
                             <div className="text-xs text-slate-300 bg-slate-700/80 px-1 py-0.5 rounded flex justify-between">
                               <span>Kapasite</span>
                               <span>{getOccupancyPercentage(location)}%</span>
                             </div>
                           </div>
                         )}
                         
                         {/* Status Indicator */}
                         <div className={`
                           absolute -top-1 -right-1 w-3 h-3 rounded-full border-2 border-slate-900
                           ${location.status === 'Aktif' ? 'bg-green-400' : ''}
                           ${location.status === 'Bakımda' ? 'bg-yellow-400' : ''}
                           ${location.status === 'Kapalı' ? 'bg-red-400' : ''}
                         `} />
                         
                         {/* Resize Handles - only in edit mode */}
                         {isEditMode && selectedLocation?.id === location.id && (
                           <>
                             {/* Corner handles */}
                             <div 
                               className="absolute -top-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-nw-resize hover:bg-blue-600"
                               onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', 'nw')}
                             />
                             <div 
                               className="absolute -top-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-ne-resize hover:bg-blue-600"
                               onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', 'ne')}
                             />
                             <div 
                               className="absolute -bottom-1 -left-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-sw-resize hover:bg-blue-600"
                               onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', 'sw')}
                             />
                             <div 
                               className="absolute -bottom-1 -right-1 w-3 h-3 bg-blue-500 border-2 border-white rounded-full cursor-se-resize hover:bg-blue-600"
                               onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', 'se')}
                             />
                             
                             {/* Edge handles */}
                             <div 
                               className="absolute -top-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white rounded cursor-n-resize hover:bg-blue-600"
                               onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', 'n')}
                             />
                             <div 
                               className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-3 h-2 bg-blue-500 border border-white rounded cursor-s-resize hover:bg-blue-600"
                               onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', 's')}
                             />
                             <div 
                               className="absolute -left-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white rounded cursor-w-resize hover:bg-blue-600"
                               onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', 'w')}
                             />
                             <div 
                               className="absolute -right-1 top-1/2 transform -translate-y-1/2 w-2 h-3 bg-blue-500 border border-white rounded cursor-e-resize hover:bg-blue-600"
                               onMouseDown={(e) => handleMouseDown(e, location.id, 'resize', 'e')}
                             />
                           </>
                         )}
                       </div>
                       
                       {/* Hover Info Tooltip */}
                       <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-slate-800 text-slate-200 px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap border border-slate-600 z-10">
                         {location.description}
                       </div>
                     </div>
                   ))}
                  
                  {/* Blueprint Title */}
                  <div className="absolute bottom-4 left-4 text-slate-300">
                    <div className="text-xs font-mono">ÇİFTLİK KROKI - {new Date().toLocaleDateString('tr-TR')}</div>
                    <div className="text-xs font-mono opacity-70">ÖLÇEK: 1:500</div>
                  </div>
                  
                  {/* Legend */}
                  <div className="absolute top-4 right-4 bg-slate-800/90 rounded-lg p-3 border border-slate-600">
                    <h4 className="font-mono text-sm text-slate-200 mb-2">LEJANt</h4>
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-3 h-3 border border-blue-400 bg-slate-800" />
                        <span>Ahır</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-3 h-3 border border-green-400 bg-slate-800" />
                        <span>Padok</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-3 h-3 border border-yellow-400 bg-slate-800" />
                        <span>Yem Deposu</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-3 h-3 border border-cyan-400 bg-slate-800" />
                        <span>Su Deposu</span>
                      </div>
                      <div className="flex items-center gap-2 text-slate-300">
                        <div className="w-3 h-3 border border-emerald-400 bg-emerald-900/20" />
                        <span>Mera</span>
                      </div>
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-slate-600 text-slate-400">
                        <div className="w-2 h-2 bg-green-400 rounded-full" />
                        <span className="text-xs">Aktif</span>
                      </div>
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
                     
                     {/* Animal Information Section */}
                     {selectedLocation.animals && selectedLocation.animals.length > 0 && (
                       <div>
                         <label className="text-sm font-medium">Hayvan Bilgileri:</label>
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
                     
                     <div>
                       <label className="text-sm font-medium">Boyut:</label>
                       <p className="text-sm">
                         {selectedLocation.size.width} x {selectedLocation.size.height} piksel
                       </p>
                     </div>
                   </div>
                  
                   <div className="flex gap-2 pt-4">
                     <Button size="sm" className="w-full" onClick={() => openEditor(selectedLocation)}>
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
