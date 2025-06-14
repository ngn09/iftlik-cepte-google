
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/auth/useAuth';

const FarmSetup = () => {
    const { user, fetchProfile } = useAuth();
    const { toast } = useToast();
    const [loading, setLoading] = useState(false);
    const [farmName, setFarmName] = useState('');
    const [farmId, setFarmId] = useState('');

    const handleCreateFarm = async (e: React.FormEvent) => {
        e.preventDefault();
        console.log("Çiftlik oluşturma isteği, mevcut kullanıcı (useAuth):", user);
        if (!farmName.trim()) return;

        setLoading(true);

        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !currentUser) {
            toast({ variant: "destructive", title: "Hata", description: "Kullanıcı oturumu doğrulanamadı. Lütfen tekrar giriş yapın." });
            setLoading(false);
            return;
        }
        
        console.log("İşlem için kullanıcı doğrulaması (supabase.auth.getUser):", currentUser);

        const { data: farmData, error: farmError } = await supabase
            .from('farms')
            // Veritabanı türleri henüz güncellenmediği için 'as any' kullanarak tip kontrolünü atlıyoruz.
            // Veritabanı, 'owner_id'yi varsayılan değerle doğru şekilde atayacaktır.
            .insert({ name: farmName } as any)
            .select()
            .single();

        if (farmError || !farmData) {
            toast({ variant: "destructive", title: "Hata", description: `Çiftlik oluşturulamadı: ${farmError?.message}` });
            setLoading(false);
            return;
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ farm_id: farmData.id })
            .eq('id', currentUser.id);

        if (profileError) {
            toast({ variant: "destructive", title: "Hata", description: `Profil güncellenemedi: ${profileError.message}` });
        } else {
            toast({ title: "Başarılı", description: `${farmName} çiftliği oluşturuldu.` });
            await fetchProfile();
        }
        setLoading(false);
    };

    const handleJoinFarm = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!farmId.trim()) return;

        setLoading(true);
        
        const { data: { user: currentUser }, error: authError } = await supabase.auth.getUser();

        if (authError || !currentUser) {
            toast({ variant: "destructive", title: "Hata", description: "Kullanıcı oturumu doğrulanamadı. Lütfen tekrar giriş yapın." });
            setLoading(false);
            return;
        }

        const { data: farmData, error: farmError } = await supabase
            .from('farms')
            .select('id')
            .eq('id', farmId.toUpperCase())
            .maybeSingle();

        if (farmError || !farmData) {
            toast({ variant: "destructive", title: "Hata", description: "Geçersiz çiftlik ID'si veya bir hata oluştu." });
            setLoading(false);
            return;
        }

        const { error: profileError } = await supabase
            .from('profiles')
            .update({ farm_id: farmData.id })
            .eq('id', currentUser.id);

        if (profileError) {
            toast({ variant: "destructive", title: "Hata", description: `Gruba katılırken hata: ${profileError.message}` });
        } else {
            toast({ title: "Başarılı", description: "Gruba katıldınız." });
            await fetchProfile();
        }
        setLoading(false);
    };


    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Tabs defaultValue="create" className="w-full max-w-md">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="create">Yeni Çiftlik Oluştur</TabsTrigger>
                    <TabsTrigger value="join">Gruba Katıl</TabsTrigger>
                </TabsList>
                <TabsContent value="create">
                    <Card>
                        <form onSubmit={handleCreateFarm}>
                            <CardHeader>
                                <CardTitle>Yeni Çiftlik Oluştur</CardTitle>
                                <CardDescription>
                                    Yeni bir çiftlik oluşturarak başlayın. Daha sonra ekip arkadaşlarınızı davet edebilirsiniz.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <label htmlFor="farm-name">Çiftlik Adı</label>
                                <Input
                                    id="farm-name"
                                    placeholder="Örn: Güneşli Çiftlik"
                                    value={farmName}
                                    onChange={(e) => setFarmName(e.target.value)}
                                    disabled={loading}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Oluşturuluyor...' : 'Oluştur'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
                <TabsContent value="join">
                    <Card>
                        <form onSubmit={handleJoinFarm}>
                            <CardHeader>
                                <CardTitle>Mevcut Gruba Katıl</CardTitle>
                                <CardDescription>
                                    Ekip arkadaşınızın paylaştığı 6 haneli grup ID'sini girin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-2">
                                <label htmlFor="farm-id">Grup ID</label>
                                <Input
                                    id="farm-id"
                                    placeholder="ÖRNEKID"
                                    value={farmId}
                                    onChange={(e) => setFarmId(e.target.value.toUpperCase())}
                                    disabled={loading}
                                    maxLength={6}
                                />
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" disabled={loading} className="w-full">
                                    {loading ? 'Katılıyor...' : 'Katıl'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default FarmSetup;
