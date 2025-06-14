
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageSquare, Users, Send } from "lucide-react";

const Chat = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sohbet</h1>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Users className="h-4 w-4" />
          <span>5 kişi çevrimiçi</span>
        </div>
      </div>
      
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Aktif Kullanıcılar</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {['Yönetici', 'Veteriner Dr. Ahmet', 'Bakıcı Mehmet', 'Bakıcı Ayşe', 'Veteriner Dr. Zeynep'].map((user, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-sm">{user}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Genel Sohbet</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">
                    V
                  </div>
                  <div>
                    <p className="text-sm font-medium">Veteriner Dr. Ahmet</p>
                    <p className="text-sm text-gray-600">Bugün 3 numaralı sığırın muayenesini yaptım, durumu iyi.</p>
                    <p className="text-xs text-gray-400">10:30</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">
                    B
                  </div>
                  <div>
                    <p className="text-sm font-medium">Bakıcı Mehmet</p>
                    <p className="text-sm text-gray-600">Teşekkürler doktor, notlarını aldım.</p>
                    <p className="text-xs text-gray-400">10:35</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <input 
                type="text" 
                placeholder="Mesajınızı yazın..." 
                className="flex-1 px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90">
                <Send className="h-4 w-4" />
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
