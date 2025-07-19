import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Sparkles, Send, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ThoughtExchangeProps {
  roomId: string;
  partner: string;
}

interface AnonymousThought {
  id: string;
  text: string;
  timestamp: Date;
  revealed?: boolean;
  isPartner?: boolean;
}

export const ThoughtExchange = ({ roomId, partner }: ThoughtExchangeProps) => {
  const [myThought, setMyThought] = useState("");
  const [thoughts, setThoughts] = useState<AnonymousThought[]>([
    {
      id: '1',
      text: "I've been thinking about how grateful I am to have someone who truly understands me. This space feels like home.",
      timestamp: new Date(Date.now() - 300000),
    },
    {
      id: '2',
      text: "Sometimes I wonder if you know how much your presence means to me, even in silence.",
      timestamp: new Date(Date.now() - 180000),
      isPartner: true,
    },
  ]);
  const [showRevealed, setShowRevealed] = useState(false);
  const { toast } = useToast();

  const submitThought = () => {
    if (!myThought.trim()) {
      toast({
        title: "Empty thoughts float away",
        description: "Share something from your heart",
        variant: "destructive"
      });
      return;
    }

    const newThought: AnonymousThought = {
      id: Date.now().toString(),
      text: myThought,
      timestamp: new Date(),
    };

    setThoughts(prev => [...prev, newThought]);
    setMyThought("");
    
    toast({
      title: "Thought shared ✨",
      description: "Your anonymous thought has been added to the exchange",
    });

    // Simulate partner adding a thought
    setTimeout(() => {
      const partnerThoughts = [
        "I love how we can be completely honest in this safe space",
        "Your energy today feels different - more peaceful somehow",
        "I've been carrying this feeling all day and needed to share it with you",
        "Sometimes I write things here I couldn't say out loud yet",
      ];
      
      const partnerThought: AnonymousThought = {
        id: (Date.now() + 1).toString(),
        text: partnerThoughts[Math.floor(Math.random() * partnerThoughts.length)],
        timestamp: new Date(),
        isPartner: true,
      };
      
      setThoughts(prev => [...prev, partnerThought]);
    }, 2000 + Math.random() * 3000);
  };

  const revealSources = () => {
    setThoughts(prev => prev.map(thought => ({ ...thought, revealed: true })));
    setShowRevealed(true);
    toast({
      title: "Sources revealed 👁️",
      description: "Now you can see who shared each thought",
    });
  };

  const hideRevealed = () => {
    setThoughts(prev => prev.map(thought => ({ ...thought, revealed: false })));
    setShowRevealed(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 warm-glow text-center">
        <div className="flex justify-center mb-4">
          <div className="p-3 rounded-full candle-gradient candle-glow animate-glow">
            <Sparkles className="w-6 h-6 text-background" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-foreground mb-2">
          Anonymous Thought Exchange
        </h2>
        <p className="text-muted-foreground">
          Share your deepest thoughts without attribution. Even though you know each other, 
          anonymity encourages raw honesty and vulnerability.
        </p>
      </Card>

      {/* Thought Input */}
      <Card className="p-6 warm-glow">
        <div className="space-y-4">
          <label className="block text-sm font-medium text-foreground">
            Drop an anonymous thought:
          </label>
          <Textarea
            value={myThought}
            onChange={(e) => setMyThought(e.target.value)}
            placeholder="What's on your heart right now? Share without fear of judgment..."
            className="min-h-[100px] resize-none"
            maxLength={500}
          />
          <div className="flex justify-between items-center">
            <span className="text-xs text-muted-foreground">
              {myThought.length}/500 characters
            </span>
            <Button
              onClick={submitThought}
              className="sunset-gradient hover:scale-105 soul-transition text-background"
            >
              <Send className="w-4 h-4 mr-2" />
              Share Anonymously
            </Button>
          </div>
        </div>
      </Card>

      {/* Thoughts Display */}
      <Card className="p-6 warm-glow">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-foreground">
            Shared Thoughts
          </h3>
          <Button
            variant="outline"
            onClick={showRevealed ? hideRevealed : revealSources}
            className="text-sm"
          >
            {showRevealed ? (
              <>
                <EyeOff className="w-4 h-4 mr-2" />
                Hide Sources
              </>
            ) : (
              <>
                <Eye className="w-4 h-4 mr-2" />
                Reveal Sources
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {thoughts.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">
              No thoughts shared yet. Be the first to open your heart...
            </p>
          ) : (
            thoughts.map((thought) => (
              <div
                key={thought.id}
                className="p-4 rounded-lg bg-card/50 border border-border/20 thought-appear soul-transition hover:bg-card/70"
              >
                <p className="text-foreground/90 mb-2 leading-relaxed">
                  "{thought.text}"
                </p>
                <div className="flex justify-between items-center text-xs text-muted-foreground">
                  <span>
                    {thought.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </span>
                  {thought.revealed && (
                    <span className="font-medium">
                      {thought.isPartner ? `from ${partner}` : 'from You'}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </Card>
    </div>
  );
};