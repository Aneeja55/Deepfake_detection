import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Heart, Users, Sparkles, Leaf, LogIn, LogOut } from "lucide-react";
import { SoulRoom } from "@/components/SoulRoom";
import { EntryGate } from "@/components/EntryGate";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const [currentView, setCurrentView] = useState<'landing' | 'entry' | 'room'>('landing');
  const [partner, setPartner] = useState<string>('');
  const [roomId, setRoomId] = useState<string>('');
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleEnterSoulRoom = () => {
    if (!user) {
      navigate('/auth');
      return;
    }
    setCurrentView('entry');
  };

  const handleSuccessfulEntry = (roomId: string, partnerName: string) => {
    setRoomId(roomId);
    setPartner(partnerName);
    setCurrentView('room');
  };

  if (currentView === 'room') {
    return <SoulRoom roomId={roomId} partner={partner} onLeave={() => setCurrentView('landing')} />;
  }

  if (currentView === 'entry') {
    return <EntryGate onSuccess={handleSuccessfulEntry} onBack={() => setCurrentView('landing')} />;
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 soul-gradient">
      {/* Floating particles for ambiance */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-20 w-2 h-2 bg-primary/30 rounded-full animate-float" />
        <div className="absolute top-40 right-32 w-1 h-1 bg-accent/40 rounded-full animate-pulse-soft" />
        <div className="absolute bottom-32 left-1/4 w-3 h-3 bg-secondary/20 rounded-full animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-primary-glow/50 rounded-full animate-pulse-soft" style={{ animationDelay: '2s' }} />
      </div>

      <div className="max-w-4xl mx-auto text-center space-y-8 z-10">
        {/* Auth Button */}
        <div className="absolute top-6 right-6">
          {user ? (
            <Button
              variant="ghost"
              onClick={signOut}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Sign Out
            </Button>
          ) : (
            <Button
              variant="ghost"
              onClick={() => navigate('/auth')}
              className="text-muted-foreground hover:text-foreground"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Sign In
            </Button>
          )}
        </div>

        {/* Logo and Title */}
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-3 animate-float">
            <div className="p-4 rounded-full candle-gradient candle-glow">
              <Heart className="w-8 h-8 text-background" />
            </div>
            <h1 className="text-6xl font-bold bg-gradient-to-r from-primary via-accent to-primary-glow bg-clip-text text-transparent">
              SoulRoom
            </h1>
          </div>
          <p className="text-2xl text-muted-foreground font-light">
            A Private Universe for Two
          </p>
          {user && (
            <p className="text-sm text-muted-foreground/70">
              Welcome back, {user.user_metadata?.display_name || 'Soul'}
            </p>
          )}
        </div>

        {/* Main Description */}
        <Card className="p-8 warm-glow soul-transition hover:scale-105">
          <p className="text-lg text-foreground/90 leading-relaxed mb-6">
            Enter a sacred digital space where exactly two souls can connect, share, and grow together. 
            No one enters alone—both must be present to unlock this intimate sanctuary.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="flex items-start space-x-3">
              <Users className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Double Consent Entry</h3>
                <p className="text-sm text-muted-foreground">Both hearts must beat together to enter</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Sparkles className="w-6 h-6 text-accent mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Thought Exchange</h3>
                <p className="text-sm text-muted-foreground">Share anonymous thoughts and feelings</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Leaf className="w-6 h-6 text-secondary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Shared Rituals</h3>
                <p className="text-sm text-muted-foreground">Water plants, light candles together</p>
              </div>
            </div>
            
            <div className="flex items-start space-x-3">
              <Heart className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground">Emotional Bond</h3>
                <p className="text-sm text-muted-foreground">Watch your connection grow and flourish</p>
              </div>
            </div>
          </div>

          <Button 
            onClick={handleEnterSoulRoom}
            size="lg"
            className="sunset-gradient hover:scale-105 soul-transition candle-glow text-background font-semibold px-8 py-6 text-lg"
          >
            Enter Your SoulRoom
          </Button>
        </Card>

        {/* Footer */}
        <p className="text-sm text-muted-foreground/70">
          "Two souls with but a single thought, two hearts that beat as one"
        </p>
      </div>
    </div>
  );
};

export default Index;
