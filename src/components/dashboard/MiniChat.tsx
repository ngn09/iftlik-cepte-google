
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";
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

interface MiniChatProps {
    className?: string;
}

const MiniChat = ({ className }: MiniChatProps) => {
    const [newMessage, setNewMessage] = useState("");
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const queryClient = useQueryClient();

    // Fetch messages
    const { data: messages = [], isLoading } = useQuery({
        queryKey: ['chat-messages-mini'],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('chat_messages')
                .select(`
                    *,
                    profiles:user_id (
                        full_name
                    )
                `)
                .order('created_at', { ascending: true })
                .limit(5);
            
            if (error) throw error;
            return data as Message[];
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
            queryClient.invalidateQueries({ queryKey: ['chat-messages-mini'] });
            setNewMessage('');
        },
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

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').toUpperCase();
    };

    const getAvatarColor = (name: string) => {
        const colors = ['bg-blue-500', 'bg-green-500', 'bg-purple-500', 'bg-red-500', 'bg-yellow-500'];
        const index = name.length % colors.length;
        return colors[index];
    };

    if (isLoading) {
        return (
            <Card className={cn("h-full flex flex-col", className)}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Hızlı Sohbet</CardTitle>
                    <Link to="/chat" className="text-sm text-muted-foreground hover:text-primary">
                        Tümünü Gör
                    </Link>
                </CardHeader>
                <CardContent className="flex-grow flex flex-col p-4 pt-0">
                    <div className="flex-grow flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Yükleniyor...</p>
                    </div>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className={cn("h-full flex flex-col", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hızlı Sohbet</CardTitle>
                <Link to="/chat" className="text-sm text-muted-foreground hover:text-primary">
                    Tümünü Gör
                </Link>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-4 pt-0">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-2 mb-2 pr-2 -mr-2 text-xs">
                    {messages.length === 0 ? (
                        <div className="flex items-center justify-center h-full">
                            <p className="text-xs text-muted-foreground">Henüz mesaj bulunmuyor</p>
                        </div>
                    ) : (
                        messages.map((msg) => (
                            <div key={msg.id} className="flex items-start gap-2">
                                <div className={`w-6 h-6 ${getAvatarColor(msg.profiles?.full_name || 'User')} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                                    {getInitials(msg.profiles?.full_name || 'User')}
                                </div>
                                <div className="flex-1">
                                    <p className="text-xs font-medium leading-tight">{msg.profiles?.full_name || 'Kullanıcı'}</p>
                                    <p className="text-xs text-gray-600 break-words leading-tight">{msg.message}</p>
                                </div>
                            </div>
                        ))
                    )}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
                    <Input
                        placeholder="Mesaj..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="h-8 text-xs"
                        disabled={sendMessageMutation.isPending}
                    />
                    <Button 
                        type="submit" 
                        size="icon" 
                        className="h-8 w-8"
                        disabled={sendMessageMutation.isPending}
                    >
                        <Send className="h-3 w-3" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default MiniChat;
