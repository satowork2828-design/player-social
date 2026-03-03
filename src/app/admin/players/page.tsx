
"use client";

import { useState, useEffect } from 'react';
import { getPlayers, addPlayer, deletePlayer } from '@/lib/services/players';
import { Player } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Loader2, User, Trophy, Shield } from 'lucide-react';
import Link from 'next/link';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const [newPlayer, setNewPlayer] = useState<Omit<Player, 'id'>>({
    name: '',
    team: '',
    position: 'Forward',
    age: 20,
    rating: 80,
    imageUrl: 'https://picsum.photos/seed/new/400/500',
    stats: { goals: 0, assists: 0, matches: 0 }
  });

  useEffect(() => {
    loadPlayers();
  }, []);

  async function loadPlayers() {
    setLoading(true);
    try {
      const data = await getPlayers();
      setPlayers(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleAddPlayer = async () => {
    setIsAdding(true);
    try {
      await addPlayer(newPlayer);
      toast({ title: "Player Added", description: `${newPlayer.name} has been added to the roster.` });
      setDialogOpen(false);
      loadPlayers();
      setNewPlayer({
        name: '',
        team: '',
        position: 'Forward',
        age: 20,
        rating: 80,
        imageUrl: 'https://picsum.photos/seed/new/400/500',
        stats: { goals: 0, assists: 0, matches: 0 }
      });
    } catch (error) {
      toast({ title: "Error", description: "Failed to add player.", variant: "destructive" });
    } finally {
      setIsAdding(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this player?")) return;
    try {
      await deletePlayer(id);
      setPlayers(prev => prev.filter(p => p.id !== id));
      toast({ title: "Player Removed", variant: "destructive" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete player.", variant: "destructive" });
    }
  };

  if (loading && players.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading roster...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold">Roster Management</h1>
          <p className="text-muted-foreground">Add and manage elite soccer talents.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/admin/reviews">
             <Button variant="outline">Reviews</Button>
           </Link>
           <Link href="/admin/ads">
             <Button variant="outline">Campaigns</Button>
           </Link>
           <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
             <DialogTrigger asChild>
               <Button className="bg-primary hover:bg-primary/90">
                 <Plus className="w-4 h-4 mr-2" /> Add Player
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[500px]">
               <DialogHeader>
                 <DialogTitle>Register New Player</DialogTitle>
               </DialogHeader>
               <div className="grid gap-4 py-4">
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="name" className="text-right">Name</Label>
                   <Input id="name" value={newPlayer.name} onChange={e => setNewPlayer({...newPlayer, name: e.target.value})} className="col-span-3" />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="team" className="text-right">Team</Label>
                   <Input id="team" value={newPlayer.team} onChange={e => setNewPlayer({...newPlayer, team: e.target.value})} className="col-span-3" />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="position" className="text-right">Position</Label>
                   <Select onValueChange={val => setNewPlayer({...newPlayer, position: val})} defaultValue={newPlayer.position}>
                     <SelectTrigger className="col-span-3">
                       <SelectValue placeholder="Position" />
                     </SelectTrigger>
                     <SelectContent>
                       <SelectItem value="Forward">Forward</SelectItem>
                       <SelectItem value="Midfielder">Midfielder</SelectItem>
                       <SelectItem value="Defender">Defender</SelectItem>
                       <SelectItem value="Goalkeeper">Goalkeeper</SelectItem>
                     </SelectContent>
                   </Select>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="rating" className="text-right">Rating</Label>
                   <Input id="rating" type="number" value={newPlayer.rating} onChange={e => setNewPlayer({...newPlayer, rating: parseInt(e.target.value)})} className="col-span-3" />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="image" className="text-right">Image URL</Label>
                   <Input id="image" value={newPlayer.imageUrl} onChange={e => setNewPlayer({...newPlayer, imageUrl: e.target.value})} className="col-span-3" />
                 </div>
               </div>
               <DialogFooter>
                 <Button onClick={handleAddPlayer} disabled={isAdding || !newPlayer.name}>
                   {isAdding ? "Adding..." : "Confirm Entry"}
                 </Button>
               </DialogFooter>
             </DialogContent>
           </Dialog>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Team</TableHead>
              <TableHead>Position</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {players.map((player) => (
              <TableRow key={player.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded-full overflow-hidden shrink-0 border border-border">
                       <img src={player.imageUrl} alt={player.name} className="w-full h-full object-cover" />
                    </div>
                    <span>{player.name}</span>
                  </div>
                </TableCell>
                <TableCell>{player.team}</TableCell>
                <TableCell>{player.position}</TableCell>
                <TableCell>
                   <div className="flex items-center gap-1">
                      <Shield className="w-3 h-3 text-primary" />
                      <span className="font-bold">{player.rating}</span>
                   </div>
                </TableCell>
                <TableCell className="text-right">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(player.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
