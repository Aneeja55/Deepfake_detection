import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Flame, Wind } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const DigitalCandle = () => {
  const [isLit, setIsLit] = useState(true);
  const [flameIntensity, setFlameIntensity] = useState(1);
  const { toast } = useToast();

  // Animate flame flicker
  useEffect(() => {
    if (!isLit) return;

    const interval = setInterval(() => {
      setFlameIntensity(0.7 + Math.random() * 0.6);
    }, 200);

    return () => clearInterval(interval);
  }, [isLit]);

  const lightCandle = () => {
    setIsLit(true);
    toast({
      title: "Candle lit 🕯️",
      description: "The session glows with warmth while both souls are present",
    });
  };

  const blowOutCandle = () => {
    setIsLit(false);
    toast({
      title: "Session ending... 💨",
      description: "The candle has been blown out. Your connection will close soon.",
    });
  };

  return (
    <div className="flex items-center space-x-3">
      {/* Candle Visual */}
      <div className="relative">
        <div className="w-6 h-8 bg-amber-100 rounded-sm border border-amber-200">
          {isLit && (
            <div 
              className="absolute -top-3 left-1/2 transform -translate-x-1/2 text-orange-500 animate-pulse-soft"
              style={{ 
                opacity: flameIntensity,
                transform: `translateX(-50%) scale(${flameIntensity})` 
              }}
            >
              <Flame className="w-3 h-4" />
            </div>
          )}
        </div>
      </div>

      {/* Candle Controls */}
      <div className="flex items-center space-x-2">
        {isLit ? (
          <Button
            variant="ghost"
            size="sm"
            onClick={blowOutCandle}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            <Wind className="w-3 h-3 mr-1" />
            End Session
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="sm"
            onClick={lightCandle}
            className="text-muted-foreground hover:text-foreground text-xs"
          >
            <Flame className="w-3 h-3 mr-1" />
            Light Candle
          </Button>
        )}
      </div>

      {/* Session Status */}
      <div className="text-xs text-muted-foreground">
        {isLit ? "Session active" : "Session ended"}
      </div>
    </div>
  );
};