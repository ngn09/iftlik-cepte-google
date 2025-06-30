
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Upload, Building2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/auth/useAuth';

interface FarmBrandingProps {
  farmName: string;
  farmLogo?: string;
  onUpdate: (name: string, logo?: string) => void;
}

export const FarmBranding = ({ farmName, farmLogo, onUpdate }: FarmBrandingProps) => {
  const [newFarmName, setNewFarmName] = useState(farmName);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const { profile } = useAuth();

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !profile?.farm_id) return;

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${profile.farm_id}-logo.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('farm-assets')
        .upload(fileName, file, {
          upsert: true
        });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('farm-assets')
        .getPublicUrl(fileName);

      onUpdate(newFarmName, data.publicUrl);
      
      toast({
        title: "Başarılı",
        description: "Logo başarıyla yüklendi."
      });
    } catch (error) {
      console.error('Logo yükleme hatası:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Logo yüklenirken bir hata oluştu."
      });
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!profile?.farm_id) return;

    setSaving(true);
    try {
      const { error } = await supabase
        .from('farms')
        .update({ name: newFarmName })
        .eq('id', profile.farm_id);

      if (error) throw error;

      onUpdate(newFarmName, farmLogo);
      
      toast({
        title: "Başarılı",
        description: "Çiftlik adı güncellendi."
      });
    } catch (error) {
      console.error('Çiftlik adı güncelleme hatası:', error);
      toast({
        variant: "destructive",
        title: "Hata",
        description: "Çiftlik adı güncellenirken bir hata oluştu."
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Çiftlik Markası
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="farm-name">Çiftlik Adı</Label>
          <Input
            id="farm-name"
            value={newFarmName}
            onChange={(e) => setNewFarmName(e.target.value)}
            placeholder="Çiftliğinizin adını girin"
          />
        </div>

        <div className="space-y-2">
          <Label>Çiftlik Logosu</Label>
          {farmLogo && (
            <div className="mb-2">
              <img 
                src={farmLogo} 
                alt="Çiftlik Logosu" 
                className="h-16 w-16 object-contain rounded border"
              />
            </div>
          )}
          <div className="flex items-center gap-2">
            <Input
              type="file"
              accept="image/*"
              onChange={handleLogoUpload}
              disabled={uploading}
              className="hidden"
              id="logo-upload"
            />
            <Button
              variant="outline"
              onClick={() => document.getElementById('logo-upload')?.click()}
              disabled={uploading}
            >
              <Upload className="h-4 w-4 mr-2" />
              {uploading ? 'Yükleniyor...' : 'Logo Yükle'}
            </Button>
          </div>
        </div>

        <Button 
          onClick={handleSave} 
          disabled={saving || newFarmName === farmName}
          className="w-full"
        >
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </CardContent>
    </Card>
  );
};
