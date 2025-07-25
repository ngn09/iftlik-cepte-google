
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/auth';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const { toast } = useToast();
    const { session } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (session) {
            navigate('/', { replace: true });
        }
    }, [session, navigate]);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: `Giriş yapılamadı: ${error.message}`,
            });
        } else {
            toast({
                title: "Giriş Başarılı",
                description: "Yönlendiriliyorsunuz...",
            });
            // Redirect is handled by AuthProvider
        }
        setLoading(false);
    };

    const handleSignUp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const { error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    full_name: fullName,
                },
                emailRedirectTo: `${window.location.origin}/`,
            },
        });

        if (error) {
            let errorMessage = error.message;
            
            // Handle specific error cases
            if (error.message.includes('upstream connect error') || error.message.includes('503')) {
                errorMessage = 'Sunucu geçici olarak erişilemez. Lütfen birkaç dakika sonra tekrar deneyin.';
            } else if (error.message.includes('User already registered')) {
                errorMessage = 'Bu e-posta adresi zaten kayıtlı. Giriş yapmayı deneyin.';
            } else if (error.message.includes('Invalid email')) {
                errorMessage = 'Geçersiz e-posta adresi.';
            } else if (error.message.includes('Password should be')) {
                errorMessage = 'Şifre en az 6 karakter olmalıdır.';
            }
            
            toast({
                variant: "destructive",
                title: "Kayıt Hatası",
                description: errorMessage,
            });
        } else {
            toast({
                title: "Kayıt Başarılı",
                description: "Lütfen e-postanızı kontrol ederek hesabınızı doğrulayın.",
            });
            setEmail('');
            setPassword('');
            setFullName('');
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Tabs defaultValue="login" className="w-full max-w-sm">
                <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="login">Giriş Yap</TabsTrigger>
                    <TabsTrigger value="signup">Kayıt Ol</TabsTrigger>
                </TabsList>
                <TabsContent value="login">
                    <Card>
                        <form onSubmit={handleLogin}>
                            <CardHeader>
                                <CardTitle>Giriş Yap</CardTitle>
                                <CardDescription>
                                    Hesabınıza erişmek için bilgilerinizi girin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="login-email">E-posta</label>
                                    <Input
                                        id="login-email"
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="login-password">Şifre</label>
                                    <Input
                                        id="login-password"
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Yükleniyor...' : 'Giriş Yap'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
                <TabsContent value="signup">
                     <Card>
                        <form onSubmit={handleSignUp}>
                            <CardHeader>
                                <CardTitle>Kayıt Ol</CardTitle>
                                <CardDescription>
                                    Yeni bir hesap oluşturmak için bilgilerinizi girin.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="space-y-2">
                                    <label htmlFor="signup-fullname">Ad Soyad</label>
                                    <Input
                                        id="signup-fullname"
                                        type="text"
                                        placeholder="Adınız Soyadınız"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="signup-email">E-posta</label>
                                    <Input
                                        id="signup-email"
                                        type="email"
                                        placeholder="ornek@mail.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="signup-password">Şifre</label>
                                    <Input
                                        id="signup-password"
                                        type="password"
                                        placeholder="••••••••"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={loading}
                                    />
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button type="submit" className="w-full" disabled={loading}>
                                    {loading ? 'Yükleniyor...' : 'Kayıt Ol'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    );
};

export default Auth;
