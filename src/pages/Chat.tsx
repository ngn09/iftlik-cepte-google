
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Send, Archive, Clock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { toast } from "sonner";

interface Message {
  user: string;
  text: string;
  time: string;
  avatar: string;
  avatarBg: string;
}

interface ArchivedChat {
  date: string;
  messages: Message[];
}

const initialMessages: Message[] = [
  {
    user: 'Veteriner Dr. Ahmet',
    text: 'Bugün 3 numaralı sığırın muayenesini yaptım, durumu iyi.',
    time: '10:30',
    avatar: 'V',
    avatarBg: 'bg-blue-500',
  },
  {
    user: 'Bakıcı Mehmet',
    text: 'Teşekkürler doktor, notlarını aldım.',
    time: '10:35',
    avatar: 'B',
    avatarBg: 'bg-green-500',
  },
];

const Chat = () => {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [newMessage, setNewMessage] = useState("");
  const [archivedChats, setArchivedChats] = useState<ArchivedChat[]>([]);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;

    const newMsg: Message = {
      user: 'Siz',
      text: newMessage,
      time: new Date().toLocaleTimeString('tr-TR', { hour: '2-digit', minute: '2-digit' }),
      avatar: 'S',
      avatarBg: 'bg-purple-500',
    };

    setMessages([...messages, newMsg]);
    setNewMessage('');
  };

  const handleArchiveChat = () => {
    if (messages.every(msg => initialMessages.includes(msg)) && messages.length === initialMessages.length) {
      toast.info("Arşivlenecek yeni mesaj bulunmuyor.");
      return;
    }
    
    const newArchive: ArchivedChat = {
      date: new Date().toLocaleString('tr-TR', { dateStyle: 'medium', timeStyle: 'short' }),
      messages: [...messages],
    };

    setArchivedChats(prev => [newArchive, ...prev]);
    setMessages(initialMessages);
    toast.success("Sohbet başarıyla arşivlendi.");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sohbet</h1>
        <div className="flex items-center gap-4">
          <Dialog>
            <DialogTrigger asChild>
              <Button variant="outline">
                <Archive className="mr-2" /> Arşivi Görüntüle ({archivedChats.length})
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl h-[80vh] flex flex-col">
              <DialogHeader>
                <DialogTitle>Arşivlenmiş Sohbetler</DialogTitle>
                <DialogDescription>
                  Geçmiş sohbet kayıtlarınızı buradan görüntüleyebilirsiniz.
                </DialogDescription>
              </DialogHeader>
              <div className="flex-grow overflow-y-auto pr-4 -mr-4">
                {archivedChats.length > 0 ? (
                  <div className="space-y-6">
                    {archivedChats.map((archive, archiveIndex) => (
                      <Card key={archiveIndex}>
                        <CardHeader>
                          <CardTitle className="text-base flex items-center gap-2 text-muted-foreground font-medium">
                            <Clock className="h-4 w-4" />
                            <span>Arşivlenme Tarihi: {archive.date}</span>
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 max-h-[20rem] overflow-y-auto">
                           {archive.messages.map((msg, msgIndex) => (
                            <div key={msgIndex} className="flex items-start gap-3">
                                <div className={`w-8 h-8 ${msg.avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                                {msg.avatar}
                                </div>
                                <div>
                                <p className="text-sm font-medium">{msg.user}</p>
                                <p className="text-sm text-gray-600 break-words">{msg.text}</p>
                                <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                                </div>
                            </div>
                           ))}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-full">
                    <p className="text-muted-foreground">Henüz arşivlenmiş sohbet yok.</p>
                  </div>
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>5 kişi çevrimiçi</span>
          </div>
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
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Genel Sohbet</CardTitle>
            <Button variant="ghost" size="sm" onClick={handleArchiveChat}>
                <Archive className="mr-2" />
                Sohbeti Arşivle
            </Button>
          </CardHeader>
          <CardContent className="flex flex-col h-[30rem]">
            <div ref={chatContainerRef} className="flex-grow bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto">
              <div className="space-y-4">
                {messages.map((msg, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className={`w-8 h-8 ${msg.avatarBg} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                      {msg.avatar}
                    </div>
                    <div>
                      <p className="text-sm font-medium">{msg.user}</p>
                      <p className="text-sm text-gray-600 break-words">{msg.text}</p>
                      <p className="text-xs text-gray-400 mt-1">{msg.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text" 
                placeholder="Mesajınızı yazın..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                autoComplete="off"
              />
              <Button type="submit" size="icon">
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Chat;
