
import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { Link } from "react-router-dom";

interface Message {
  user: string;
  text: string;
  time: string;
  avatar: string;
  avatarBg: string;
}

const initialMessages: Message[] = [
    {
        user: 'Veteriner Dr. Ahmet',
        text: '3 numaralı sığırın muayenesi iyi.',
        time: '10:30',
        avatar: 'V',
        avatarBg: 'bg-blue-500',
    },
    {
        user: 'Bakıcı Mehmet',
        text: 'Teşekkürler doktor.',
        time: '10:35',
        avatar: 'B',
        avatarBg: 'bg-green-500',
    },
];

const MiniChat = () => {
    const [messages, setMessages] = useState<Message[]>(initialMessages);
    const [newMessage, setNewMessage] = useState("");
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

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hızlı Sohbet</CardTitle>
                <Link to="/chat" className="text-sm text-muted-foreground hover:text-primary">
                    Tümünü Gör
                </Link>
            </CardHeader>
            <CardContent className="flex-grow flex flex-col p-4 pt-0">
                <div ref={chatContainerRef} className="flex-grow overflow-y-auto space-y-2 mb-2 pr-2 -mr-2 text-xs">
                    {messages.map((msg, index) => (
                         <div key={index} className="flex items-start gap-2">
                             <div className={`w-6 h-6 ${msg.avatarBg} rounded-full flex items-center justify-center text-white text-[10px] font-bold shrink-0`}>
                                 {msg.avatar}
                             </div>
                             <div className="flex-1">
                                 <p className="text-xs font-medium leading-tight">{msg.user}</p>
                                 <p className="text-xs text-gray-600 break-words leading-tight">{msg.text}</p>
                             </div>
                         </div>
                    ))}
                </div>
                <form onSubmit={handleSendMessage} className="flex gap-2 mt-auto">
                    <Input
                        placeholder="Mesaj..."
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        className="h-8 text-xs"
                    />
                    <Button type="submit" size="icon" className="h-8 w-8">
                        <Send className="h-3 w-3" />
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

export default MiniChat;
