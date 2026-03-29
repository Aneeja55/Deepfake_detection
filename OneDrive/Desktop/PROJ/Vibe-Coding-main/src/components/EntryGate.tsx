import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Users, Plus, LogIn } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

interface EntryGateProps {
  onSuccess: (roomId: string, partnerName: string) => void;
  onBack: () => void;
}

export const EntryGate = ({ onSuccess, onBack }: EntryGateProps) => {
  const [mode, setMode] = useState<'choose' | 'create' | 'join'>('choose');
  const [roomCode, setRoomCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [createdRoom, setCreatedRoom] = useState<any>(null);
  const [waitingForPartner, setWaitingForPartner] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  // Listen for room updates when waiting for partner
  useEffect(() => {
    if (!waitingForPartner || !createdRoom) return;

    const channel = supabase
      .channel('room-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'soul_rooms',
          filter: `id=eq.${createdRoom.id}`
        },
        (payload) => {
          const updatedRoom = payload.new;
          if (updatedRoom.partner_id && updatedRoom.is_active) {
            // Partner joined! Fetch partner profile
            fetchPartnerAndEnter(updatedRoom);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [waitingForPartner, createdRoom]);

  const fetchPartnerAndEnter = async (room: any) => {
    try {
      const partnerId = room.partner_id === user?.id ? room.creator_id : room.partner_id;
      const { data: partnerProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', partnerId)
        .single();

      onSuccess(room.id, partnerProfile?.display_name || 'Your Partner');
    } catch (error) {
      console.error('Error fetching partner:', error);
      toast({
        title: "Error",
        description: "Failed to connect with partner",
        variant: "destructive"
      });
    }
  };

  const createRoom = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      // Generate room code
      const { data: roomCodeData } = await supabase.rpc('generate_room_code');
      
      // Create room
      const { data: room, error } = await supabase
        .from('soul_rooms')
        .insert({
          room_code: roomCodeData,
          creator_id: user.id,
          is_active: false
        })
        .select()
        .single();

      if (error) throw error;

      setCreatedRoom(room);
      setRoomCode(room.room_code);
      setWaitingForPartner(true);
      setMode('create');
      
      toast({
        title: "Room Created!",
        description: `Share this code with your partner: ${room.room_code}`
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const joinRoom = async () => {
    if (!user || !roomCode.trim()) return;
    
    setLoading(true);
    try {
      // Find room by code
      const { data: room, error: findError } = await supabase
        .from('soul_rooms')
        .select('*')
        .eq('room_code', roomCode.trim().toUpperCase())
        .single();

      if (findError || !room) {
        throw new Error('Room not found with that code');
      }

      if (room.creator_id === user.id) {
        throw new Error('You cannot join your own room');
      }

      if (room.partner_id && room.partner_id !== user.id) {
        throw new Error('This room is already full');
      }

      // Join the room
      const { error: updateError } = await supabase
        .from('soul_rooms')
        .update({
          partner_id: user.id,
          is_active: true
        })
        .eq('id', room.id);

      if (updateError) throw updateError;

      // Fetch creator profile
      const { data: creatorProfile } = await supabase
        .from('profiles')
        .select('display_name')
        .eq('user_id', room.creator_id)
        .single();

      onSuccess(room.id, creatorProfile?.display_name || 'Your Partner');
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (mode === 'choose') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 soul-gradient">
        <div className="max-w-md w-full space-y-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="p-6 warm-glow text-center space-y-6">
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Double Consent Entry
            </h2>
            <p className="text-muted-foreground mb-6">
              Choose how you want to connect with your partner
            </p>

            <div className="space-y-4">
              <Button
                onClick={createRoom}
                disabled={loading}
                className="w-full sunset-gradient hover:scale-105 soul-transition candle-glow text-background font-semibold"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create New Room
              </Button>

              <Button
                onClick={() => setMode('join')}
                variant="outline"
                className="w-full"
              >
                <LogIn className="w-4 h-4 mr-2" />
                Join Existing Room
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  if (mode === 'create') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 soul-gradient">
        <div className="max-w-md w-full space-y-6">
          <Button
            variant="ghost"
            onClick={onBack}
            className="text-muted-foreground hover:text-foreground mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Button>

          <Card className="p-6 warm-glow text-center space-y-6">
            <div className="space-y-4">
              <Users className="w-12 h-12 text-primary mx-auto animate-pulse-soft" />
              <h2 className="text-2xl font-bold text-foreground">
                Room Created!
              </h2>
              <p className="text-muted-foreground">
                Share this code with your partner
              </p>
            </div>

            <div className="p-4 bg-background/20 rounded-lg border border-border/20">
              <p className="text-3xl font-mono font-bold text-primary tracking-wider">
                {roomCode}
              </p>
            </div>

            {waitingForPartner && (
              <div className="space-y-2">
                <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-muted-foreground">
                  Waiting for your partner to join...
                </p>
              </div>
            )}

            <Button
              variant="outline"
              onClick={() => {
                setMode('choose');
                setWaitingForPartner(false);
                setCreatedRoom(null);
              }}
            >
              Cancel
            </Button>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 soul-gradient">
      <div className="max-w-md w-full space-y-6">
        <Button
          variant="ghost"
          onClick={() => setMode('choose')}
          className="text-muted-foreground hover:text-foreground mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <Card className="p-6 warm-glow space-y-6">
          <div className="text-center space-y-4">
            <Users className="w-12 h-12 text-primary mx-auto" />
            <h2 className="text-2xl font-bold text-foreground">
              Join Room
            </h2>
            <p className="text-muted-foreground">
              Enter the room code your partner shared
            </p>
          </div>

          <div className="space-y-4">
            <Input
              type="text"
              value={roomCode}
              onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
              placeholder="Enter 6-letter code"
              maxLength={6}
              className="text-center text-xl font-mono tracking-wider"
            />

            <Button
              onClick={joinRoom}
              disabled={loading || roomCode.length !== 6}
              className="w-full sunset-gradient hover:scale-105 soul-transition candle-glow text-background font-semibold"
            >
              {loading ? "Joining..." : "Join Room"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};