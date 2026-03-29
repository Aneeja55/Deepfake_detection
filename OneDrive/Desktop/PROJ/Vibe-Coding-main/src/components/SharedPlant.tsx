import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Droplets, Leaf, Sun, Heart } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface SharedPlantProps {
  roomId: string;
  partner: string;
}

export const SharedPlant = ({ roomId, partner }: SharedPlantProps) => {
  const [plantHealth, setPlantHealth] = useState(75);
  const [waterLevel, setWaterLevel] = useState(60);
  const [lastWatered, setLastWatered] = useState<Date | null>(new Date(Date.now() - 43200000)); // 12 hours ago
  const [hasWateredToday, setHasWateredToday] = useState(false);
  const [partnerWateredToday, setPartnerWateredToday] = useState(true);
  const { toast } = useToast();

  // Simulate plant declining over time
  useEffect(() => {
    const interval = setInterval(() => {
      setWaterLevel(prev => Math.max(0, prev - 0.5));
      setPlantHealth(prev => {
        if (waterLevel < 20) return Math.max(0, prev - 1);
        if (waterLevel > 80) return Math.min(100, prev + 0.5);
        return prev;
      });
    }, 30000); // Every 30 seconds for demo purposes

    return () => clearInterval(interval);
  }, [waterLevel]);

  const waterPlant = () => {
    if (hasWateredToday) {
      toast({
        title: "Already watered today",
        description: "The plant appreciates your care, but wait for tomorrow",
      });
      return;
    }

    setWaterLevel(prev => Math.min(100, prev + 25));
    setLastWatered(new Date());
    setHasWateredToday(true);
    
    toast({
      title: "Plant watered! 💧",
      description: "Your love helps it grow. Wait for your partner to water it too!",
    });

    // Reset daily watering at midnight (for demo, reset after 1 minute)
    setTimeout(() => {
      setHasWateredToday(false);
    }, 60000);
  };

  const getPlantStage = () => {
    if (plantHealth >= 80) return "blooming";
    if (plantHealth >= 60) return "healthy";
    if (plantHealth >= 40) return "growing";
    if (plantHealth >= 20) return "struggling";
    return "wilting";
  };

  const getPlantEmoji = () => {
    const stage = getPlantStage();
    switch (stage) {
      case "blooming": return "🌸";
      case "healthy": return "🌿";
      case "growing": return "🌱";
      case "struggling": return "🥀";
      case "wilting": return "💔";
      default: return "🌱";
    }
  };

  const getPlantMessage = () => {
    const stage = getPlantStage();
    switch (stage) {
      case "blooming": return "Your plant is flourishing with love from both of you!";
      case "healthy": return "Your plant is thriving thanks to your shared care";
      case "growing": return "Your plant is growing steadily with your attention";
      case "struggling": return "Your plant needs more consistent care from both of you";
      case "wilting": return "Your plant is suffering from neglect - show it some love!";
      default: return "Your plant awaits your care";
    }
  };

  return (
    <div className="space-y-6">
      {/* Plant Display */}
      <Card className="p-8 warm-glow text-center">
        <div className="space-y-6">
          {/* Plant Visual */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="text-8xl animate-float">
                {getPlantEmoji()}
              </div>
              {plantHealth > 80 && (
                <div className="absolute -top-2 -right-2 text-2xl animate-pulse-soft">
                  ✨
                </div>
              )}
            </div>
          </div>

          {/* Plant Status */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Your Shared Plant
            </h2>
            <p className="text-muted-foreground mb-4">
              {getPlantMessage()}
            </p>
          </div>

          {/* Health Metrics */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto">
            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Heart className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium">Health</span>
              </div>
              <Progress 
                value={plantHealth} 
                className="h-2"
              />
              <span className="text-xs text-muted-foreground">{plantHealth}%</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-center space-x-2">
                <Droplets className="w-4 h-4 text-blue-400" />
                <span className="text-sm font-medium">Water</span>
              </div>
              <Progress 
                value={waterLevel} 
                className="h-2"
              />
              <span className="text-xs text-muted-foreground">{waterLevel}%</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Care Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card className="p-6 warm-glow">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full nature-gradient">
                <Droplets className="w-6 h-6 text-background" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2">Water the Plant</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Both souls must water daily for optimal growth
              </p>
            </div>

            <Button
              onClick={waterPlant}
              disabled={hasWateredToday}
              className="w-full nature-gradient hover:scale-105 soul-transition text-background"
            >
              {hasWateredToday ? "Watered Today ✓" : "Water Plant"}
            </Button>

            <div className="text-xs text-muted-foreground space-y-1">
              <div className="flex justify-between">
                <span>You:</span>
                <span>{hasWateredToday ? "Watered ✓" : "Not watered"}</span>
              </div>
              <div className="flex justify-between">
                <span>{partner}:</span>
                <span>{partnerWateredToday ? "Watered ✓" : "Not watered"}</span>
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-6 warm-glow">
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <div className="p-3 rounded-full candle-gradient">
                <Sun className="w-6 h-6 text-background" />
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold text-foreground mb-2">Plant Care Tips</h3>
              <div className="text-sm text-muted-foreground space-y-2">
                <p>🌱 Daily watering keeps it healthy</p>
                <p>💕 Both partners must care for growth</p>
                <p>⏰ Miss too many days and it wilts</p>
                <p>✨ Consistent love makes it bloom</p>
              </div>
            </div>

            {lastWatered && (
              <div className="text-xs text-muted-foreground pt-2 border-t border-border/20">
                Last watered: {lastWatered.toLocaleString()}
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Plant History */}
      <Card className="p-6 warm-glow">
        <h3 className="font-semibold text-foreground mb-4 flex items-center">
          <Leaf className="w-4 h-4 mr-2 text-secondary" />
          Growth Journey
        </h3>
        <div className="space-y-3 text-sm">
          <div className="flex justify-between items-center p-2 rounded bg-card/30">
            <span>Started growing together</span>
            <span className="text-muted-foreground">3 days ago</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-card/30">
            <span>Reached healthy stage</span>
            <span className="text-muted-foreground">2 days ago</span>
          </div>
          <div className="flex justify-between items-center p-2 rounded bg-card/30">
            <span>Both watered consistently</span>
            <span className="text-muted-foreground">Yesterday</span>
          </div>
        </div>
      </Card>
    </div>
  );
};