import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Send, Heart, Smile } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

interface ChatInterfaceProps {
  roomId: string;
  partner: string;
}

interface Message {
  id: string;
  content: string;
  sender: string;
  timestamp: string;
  reaction?: string;
}

export const ChatInterface = ({ roomId, partner }: ChatInterfaceProps) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  useEffect(() => {
    const getCurrentUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setCurrentUserId(user?.id ?? null);
    };
    getCurrentUser();

    const fetchMessages = async () => {
    const {data , error} = await supabase.from("messages")
        .select("*")
        .eq("room_id", roomId)
        .order("timestamp", { ascending: true });

      if (!error && data) {
        setMessages(data as Message[]);
      } else {
        console.error("Fetch error:", error?.message);
      }
    };

    fetchMessages();

    const channel = supabase
      .channel(`room-${roomId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `room_id=eq.${roomId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [roomId]);

  const sendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      console.error("User is not authenticated.");
      return; // Exit if user is not found
    }

    const { error } = await supabase.from("messages").insert([
      {
        room_id: roomId,
        user_id: user.id, // <-- Add this line
        content: newMessage,
        sender: user.id,  // Optionally keep this for display
      }
    ]);

    if (error) {
      console.error("Error inserting message:", error.message);
    } else {
      setNewMessage("");
    }
  };

  const addReaction = async (messageId: string, reaction: string) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, reaction } : msg))
    );

    await supabase.from("messages").update({ reaction }).eq("id", messageId);
  };

  return (
    <Card className="flex flex-col h-[600px] warm-glow">
      <div className="p-4 border-b border-border/20">
        <div className="flex items-center space-x-3">
          <div className="w-3 h-3 bg-secondary rounded-full animate-pulse-soft" />
          <span className="font-medium text-foreground">Chatting with {partner}</span>
        </div>
      </div>

      <div className="flex-1 p-4 space-y-4 overflow-y-auto">
        {messages.map((message) => {
          const isMe = currentUserId && message.user_id === currentUserId;
          return (
            <div
              key={message.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div className="max-w-[70%] group">
                <div
                  className={`p-3 rounded-2xl soul-transition ${
                    isMe
                      ? "sunset-gradient text-background ml-4"
                      : "bg-card text-foreground mr-4"
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                  <span className="block text-xs text-muted-foreground mt-1">
                    {message.timestamp ? new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                  </span>
                </div>
                {message.reaction ? (
                  <span className="text-xs ml-2">{message.reaction}</span>
                ) : (
                  <div className="flex space-x-2 mt-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" onClick={() => addReaction(message.id, "❤️")}>
                      <Heart className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => addReaction(message.id, "😊")}>
                      <Smile className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      <div className="p-4 border-t border-border/20">
        <form
          className="flex space-x-2"
          onSubmit={(e) => {
            e.preventDefault();
            sendMessage();
          }}
        >
          <Input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type a message..."
          />
          <Button type="submit" variant="default" size="icon">
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </Card>
  );
};
