
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Message {
  id: number;
  user_id: string;
  message: string;
  created_at: string;
  profiles?: {
    full_name: string;
  };
}

interface User {
  id: string;
  full_name: string;
  status: string;
}

const Chat = () => {
  const [newMessage, setNewMessage] = useState("");
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch messages
  const { data: messages = [], isLoading: messagesLoading } = useQuery({
    queryKey: ['chat-messages'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('chat_messages')
        .select(`
          *,
          profiles:user_id (
            full_name
          )
        `)
        .order('created_at', { ascending: true });
      
      if (error) throw error;
      return data as Message[];
    },
  });

  // Fetch active users
  const { data: activeUsers = [] } = useQuery({
    queryKey: ['active-users'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, status')
        .eq('status', 'Aktif');
      
      if (error) throw error;
      return data as User[];
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (message: string) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Kullanıcı oturum açmamış');

      const { error } = await supabase
        .from('chat_messages')
        .insert({
          message,
          user_id: user.id,
          farm_id: 'default' // Bu değer gerçek farm_id ile değiştirilmeli
        });
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-messages'] });
      setNewMessage('');
      toast.success("Mesaj gönderildi");
    },
    onError: (error) => {
      toast.error("Mesaj gönderilemedi: " + error.message);
    }
  });

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() === '') return;
    sendMessageMutation.mutate(newMessage);
  };

  const handleArchiveChat = () => {
    if (messages.length === 0) {
      toast.info("Arşivlenecek mesaj bulunmuyor.");
      return;
    }
    
    // Bu fonksiyon gelecekte genişletilebilir
    toast.success("Sohbet arşivleme özelliği yakında eklenecek.");
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getAvatarColor = (name: string) => {
    const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500', 'bg-indigo-500'];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Sohbet</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={handleArchiveChat}>
            <Archive className="mr-2" /> Arşivi Görüntüle (0)
          </Button>

          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="h-4 w-4" />
            <span>{activeUsers.length} kişi çevrimiçi</span>
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
              {activeUsers.length > 0 ? (
                activeUsers.map((user) => (
                  <div key={user.id} className="flex items-center gap-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-sm">{user.full_name}</span>
                  </div>
                ))
              ) : (
                <p className="text-sm text-muted-foreground">Aktif kullanıcı bulunmuyor</p>
              )}
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
              {messagesLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Mesajlar yükleniyor...</p>
                </div>
              ) : messages.length === 0 ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-sm text-muted-foreground">Henüz mesaj bulunmuyor. İlk mesajı gönderin!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div key={msg.id} className="flex items-start gap-3">
                      <div className={`w-8 h-8 ${getAvatarColor(msg.profiles?.full_name || 'User')} rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0`}>
                        {getInitials(msg.profiles?.full_name || 'User')}
                      </div>
                      <div>
                        <p className="text-sm font-medium">{msg.profiles?.full_name || 'Kullanıcı'}</p>
                        <p className="text-sm text-gray-600 break-words">{msg.message}</p>
                        <p className="text-xs text-gray-400 mt-1">
                          {new Date(msg.created_at).toLocaleTimeString('tr-TR', { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <form onSubmit={handleSendMessage} className="flex gap-2">
              <Input
                type="text" 
                placeholder="Mesajınızı yazın..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                autoComplete="off"
                className="flex-grow"
                disabled={sendMessageMutation.isPending}
              />
              <Button 
                type="submit" 
                size="icon"
                disabled={sendMessageMutation.isPending}
              >
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
