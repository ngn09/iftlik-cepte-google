
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

const Auth = () => {
    const [loading, setLoading] = useState(false);
    const [phone, setPhone] = useState('');
    const [otp, setOtp] = useState('');
    const [otpSent, setOtpSent] = useState(false);
    const { toast } = useToast();

    const handleSendOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formattedPhone = phone.startsWith('+') ? phone : `+90${phone.replace(/\D/g, '')}`;

        const { error } = await supabase.auth.signInWithOtp({
            phone: formattedPhone,
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: error.message,
            });
        } else {
            setOtpSent(true);
            toast({
                title: "Başarılı",
                description: "Telefonunuza bir OTP kodu gönderildi.",
            });
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formattedPhone = phone.startsWith('+') ? phone : `+90${phone.replace(/\D/g, '')}`;

        const { data, error } = await supabase.auth.verifyOtp({
            phone: formattedPhone,
            token: otp,
            type: 'sms',
        });

        if (error) {
            toast({
                variant: "destructive",
                title: "Hata",
                description: `OTP doğrulanırken hata: ${error.message}`,
            });
        } else if (data.session) {
            toast({
                title: "Giriş Başarılı",
                description: "Yönlendiriliyorsunuz...",
            });
        } else {
            toast({
                variant: "destructive",
                title: "Hata",
                description: "Geçersiz OTP kodu veya oturum oluşturulamadı.",
            });
        }
        setLoading(false);
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50">
            <Card className="w-full max-w-sm">
                <CardHeader>
                    <CardTitle>{otpSent ? 'OTP Kodu' : 'Giriş Yap / Kayıt Ol'}</CardTitle>
                    <CardDescription>
                        {otpSent ? 'Telefonunuza gelen kodu girin.' : 'Devam etmek için telefon numaranızı girin.'}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={otpSent ? handleVerifyOtp : handleSendOtp}>
                    <CardContent className="space-y-4">
                        {!otpSent ? (
                            <div className="space-y-2">
                                <label htmlFor="phone">Telefon Numarası</label>
                                <Input
                                    id="phone"
                                    type="tel"
                                    placeholder="555 123 4567"
                                    value={phone}
                                    onChange={(e) => setPhone(e.target.value)}
                                    disabled={loading}
                                />
                            </div>
                        ) : (
                            <div className="space-y-2">
                                <label htmlFor="otp">OTP Kodu</label>
                                <Input
                                    id="otp"
                                    type="text"
                                    placeholder="123456"
                                    value={otp}
                                    onChange={(e) => setOtp(e.target.value)}
                                    disabled={loading}
                                    maxLength={6}
                                />
                            </div>
                        )}
                    </CardContent>
                    <CardFooter>
                        <Button type="submit" className="w-full" disabled={loading}>
                            {loading ? 'Yükleniyor...' : (otpSent ? 'Doğrula & Giriş Yap' : 'OTP Gönder')}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
};

export default Auth;
