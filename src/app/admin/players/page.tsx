
"use client";

import { useState, useEffect } from 'react';
import { getPlayers, addPlayer, updatePlayer, deletePlayer } from '@/lib/services/players';
import { Player } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { Plus, Trash2, Pencil, Loader2, User, Trophy, Shield, ImageIcon } from 'lucide-react';
import Link from 'next/link';

export default function AdminPlayersPage() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingPlayerId, setEditingPlayerId] = useState<string | null>(null);
  const { toast } = useToast();

  const [formState, setFormState] = useState<Omit<Player, 'id'>>({
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

  const handleSavePlayer = async () => {
    setIsSaving(true);
    try {
      if (editingPlayerId) {
        await updatePlayer(editingPlayerId, formState);
        toast({ title: "Player Updated", description: `${formState.name} has been updated successfully.` });
      } else {
        await addPlayer(formState);
        toast({ title: "Player Added", description: `${formState.name} has been added to the roster.` });
      }
      
      setDialogOpen(false);
      loadPlayers();
      resetForm();
    } catch (error) {
      toast({ title: "Error", description: `Failed to ${editingPlayerId ? 'update' : 'save'} player.`, variant: "destructive" });
    } finally {
      setIsSaving(false);
    }
  };

  const resetForm = () => {
    setFormState({
      name: '',
      team: '',
      position: 'Forward',
      age: 20,
      rating: 80,
      imageUrl: 'https://picsum.photos/seed/new/400/500',
      stats: { goals: 0, assists: 0, matches: 0 }
    });
    setEditingPlayerId(null);
  };

  const handleEditClick = (player: Player) => {
    setFormState({
      name: player.name,
      team: player.team,
      position: player.position,
      age: player.age,
      rating: player.rating,
      imageUrl: player.imageUrl,
      stats: { ...player.stats }
    });
    setEditingPlayerId(player.id);
    setDialogOpen(true);
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
           <Dialog open={dialogOpen} onOpenChange={(open) => {
             setDialogOpen(open);
             if (!open) resetForm();
           }}>
             <DialogTrigger asChild>
               <Button className="bg-primary hover:bg-primary/90">
                 <Plus className="w-4 h-4 mr-2" /> Add Player
               </Button>
             </DialogTrigger>
             <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                 <DialogTitle>{editingPlayerId ? 'Update Player Profile' : 'Register New Player'}</DialogTitle>
               </DialogHeader>
               <div className="grid gap-6 py-4">
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="name" className="text-right">Name</Label>
                   <Input id="name" value={formState.name} onChange={e => setFormState({...formState, name: e.target.value})} className="col-span-3" />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="team" className="text-right">Team</Label>
                   <Input id="team" value={formState.team} onChange={e => setFormState({...formState, team: e.target.value})} className="col-span-3" />
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="position" className="text-right">Position</Label>
                   <Select onValueChange={val => setFormState({...formState, position: val})} value={formState.position}>
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
                 <div className="grid grid-cols-2 gap-4">
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="rating" className="text-right">Rating</Label>
                        <Input id="rating" type="number" value={formState.rating} onChange={e => setFormState({...formState, rating: parseInt(e.target.value)})} />
                    </div>
                    <div className="grid grid-cols-2 items-center gap-4">
                        <Label htmlFor="age" className="text-right">Age</Label>
                        <Input id="age" type="number" value={formState.age} onChange={e => setFormState({...formState, age: parseInt(e.target.value)})} />
                    </div>
                 </div>
                 <div className="grid grid-cols-4 items-center gap-4">
                   <Label htmlFor="imageUrl" className="text-right">Image URL</Label>
                   <Input id="imageUrl" value={formState.imageUrl} onChange={e => setFormState({...formState, imageUrl: e.target.value})} className="col-span-3" />
                 </div>

                 <div className="border-t pt-4">
                    <h4 className="text-sm font-semibold mb-4 text-center">Performance Statistics</h4>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="matches">Matches</Label>
                            <Input id="matches" type="number" value={formState.stats.matches} onChange={e => setFormState({...formState, stats: {...formState.stats, matches: parseInt(e.target.value)}})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="goals">Goals</Label>
                            <Input id="goals" type="number" value={formState.stats.goals} onChange={e => setFormState({...formState, stats: {...formState.stats, goals: parseInt(e.target.value)}})} />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="assists">Assists</Label>
                            <Input id="assists" type="number" value={formState.stats.assists} onChange={e => setFormState({...formState, stats: {...formState.stats, assists: parseInt(e.target.value)}})} />
                        </div>
                    </div>
                 </div>
               </div>
               <DialogFooter>
                 <Button onClick={handleSavePlayer} disabled={isSaving || !formState.name}>
                   {isSaving ? "Saving..." : editingPlayerId ? "Update Player" : "Confirm Entry"}
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
                    <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleEditClick(player)}>
                            <Pencil className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10" onClick={() => handleDelete(player.id)}>
                            <Trash2 className="h-4 w-4" />
                        </Button>
                    </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
