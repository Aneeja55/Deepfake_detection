import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, MessageCircle, Sparkles, Leaf, Heart } from "lucide-react";
import { ChatInterface } from "@/components/ChatInterface";
import { ThoughtExchange } from "@/components/ThoughtExchange";
import { SharedPlant } from "@/components/SharedPlant";
import { DigitalCandle } from "@/components/DigitalCandle";

interface SoulRoomProps {
  roomId: string;
  partner: string;
  onLeave: () => void;
}

export const SoulRoom = ({ roomId, partner, onLeave }: SoulRoomProps) => {
  const [activeTab, setActiveTab] = useState("chat");

  return (
    <div className="min-h-screen soul-gradient">
      {/* Header */}
      <div className="border-b border-border/20 bg-card/10 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button
            variant="ghost"
            onClick={onLeave}
            className="text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Leave SoulRoom
          </Button>

          <div className="flex items-center space-x-3">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-secondary rounded-full animate-pulse-soft" />
              <span className="text-sm text-muted-foreground">Connected with</span>
              <span className="font-semibold text-foreground">{partner}</span>
            </div>
          </div>

          <DigitalCandle />
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6 bg-card/20 backdrop-blur-sm">
            <TabsTrigger value="chat" className="flex items-center space-x-2">
              <MessageCircle className="w-4 h-4" />
              <span>Chat</span>
            </TabsTrigger>
            <TabsTrigger value="thoughts" className="flex items-center space-x-2">
              <Sparkles className="w-4 h-4" />
              <span>Thoughts</span>
            </TabsTrigger>
            <TabsTrigger value="plant" className="flex items-center space-x-2">
              <Leaf className="w-4 h-4" />
              <span>Our Plant</span>
            </TabsTrigger>
            <TabsTrigger value="rituals" className="flex items-center space-x-2">
              <Heart className="w-4 h-4" />
              <span>Rituals</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chat" className="space-y-6">
            <ChatInterface roomId={roomId} partner={partner} />
          </TabsContent>

          <TabsContent value="thoughts" className="space-y-6">
            <ThoughtExchange roomId={roomId} partner={partner} />
          </TabsContent>

          <TabsContent value="plant" className="space-y-6">
            <SharedPlant roomId={roomId} partner={partner} />
          </TabsContent>

          <TabsContent value="rituals" className="space-y-6">
            <Card className="p-8 warm-glow text-center">
              <h3 className="text-2xl font-bold text-foreground mb-4">
                Sacred Rituals
              </h3>
              <p className="text-muted-foreground">
                Coming soon: Meditation sessions, gratitude sharing, and more intimate connection rituals
              </p>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};