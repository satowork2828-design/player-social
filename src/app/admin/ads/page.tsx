"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAllAds, updateAdStatus, deleteAd, updateAd } from '@/lib/services/ads';
import { getUserProfile } from '@/lib/services/users';
import { onAuthStateChanged } from '@/lib/services/auth';
import { auth } from '@/lib/firebase/config';
import { AdSubmission } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Check, X, Trash2, Pencil, Image as ImageIcon, Loader2, Users, ShieldAlert } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminAdsPage() {
  const [ads, setAds] = useState<AdSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);
  const [editingAdId, setEditingAdId] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const [formState, setFormState] = useState<Omit<AdSubmission, 'id' | 'status'>>({
    company: '',
    title: '',
    content: '',
    imageUrl: ''
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const profile = await getUserProfile(user.uid);
        if (profile?.isAdmin) {
          setIsAuthorized(true);
          loadAds();
        } else {
          setIsAuthorized(false);
        }
      } else {
        setIsAuthorized(false);
      }
    });
    return () => unsubscribe();
  }, []);

  async function loadAds() {
    setLoading(true);
    try {
      const data = await getAllAds();
      setAds(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateAdStatus(id, status);
      setAds(prev => prev.map(a => a.id === id ? { ...a, status } : a));
      toast({
        title: `Ad ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `The proposal has been marked as ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleEditClick = (ad: AdSubmission) => {
    setFormState({
      company: ad.company,
      title: ad.title,
      content: ad.content,
      imageUrl: ad.imageUrl
    });
    setEditingAdId(ad.id);
    setDialogOpen(true);
  };

  const handleSaveAd = async () => {
    if (!editingAdId) return;
    setIsSaving(true);
    try {
      await updateAd(editingAdId, formState);
      setAds(prev => prev.map(a => a.id === editingAdId ? { ...a, ...formState } : a));
      toast({
        title: "Ad Updated",
        description: "The campaign details have been modified.",
      });
      setDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update advertisement.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to remove this campaign?")) return;
    try {
      await deleteAd(id);
      setAds(prev => prev.filter(a => a.id !== id));
      toast({
        title: "Ad Removed",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete ad.",
        variant: "destructive",
      });
    }
  };

  if (isAuthorized === false) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <ShieldAlert className="w-16 h-16 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Access Denied</h1>
        <p className="text-muted-foreground mb-6">You do not have administrative privileges.</p>
        <Link href="/">
          <Button>Return to Home</Button>
        </Link>
      </div>
    );
  }

  if (isAuthorized === null || loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Verifying permissions...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold">Partner Campaigns</h1>
          <p className="text-muted-foreground">Manage sponsored content and advertisements.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/admin/players">
             <Button variant="outline"><Users className="w-4 h-4 mr-2" /> Players</Button>
           </Link>
           <Link href="/admin/reviews">
             <Button variant="outline">Reviews</Button>
           </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Company</TableHead>
              <TableHead>Campaign Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {ads.map((ad) => (
              <TableRow key={ad.id} className="hover:bg-muted/20 transition-colors">
                <TableCell className="font-medium">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-muted rounded overflow-hidden flex items-center justify-center shrink-0">
                      {ad.imageUrl ? (
                        <img src={ad.imageUrl} alt={ad.company} className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="w-5 h-5 opacity-20" />
                      )}
                    </div>
                    <span>{ad.company}</span>
                  </div>
                </TableCell>
                <TableCell>{ad.title}</TableCell>
                <TableCell>
                  <Badge variant={ad.status === 'approved' ? 'default' : ad.status === 'rejected' ? 'destructive' : 'secondary'}>
                    {ad.status.toUpperCase()}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button size="icon" variant="ghost" className="h-8 w-8 text-primary hover:text-primary hover:bg-primary/10" onClick={() => handleEditClick(ad)}>
                      <Pencil className="h-4 w-4" />
                    </Button>
                    {ad.status !== 'approved' && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={() => handleStatus(ad.id, 'approved')}>
                        <Check className="h-4 w-4" />
                      </Button>
                    )}
                    {ad.status !== 'rejected' && (
                      <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleStatus(ad.id, 'rejected')}>
                        <X className="h-4 w-4" />
                      </Button>
                    )}
                    <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(ad.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Edit Advertisement</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="company">Company</Label>
              <Input id="company" value={formState.company} onChange={e => setFormState({...formState, company: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="title">Campaign Title</Label>
              <Input id="title" value={formState.title} onChange={e => setFormState({...formState, title: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="content">Description</Label>
              <Textarea id="content" value={formState.content} onChange={e => setFormState({...formState, content: e.target.value})} />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="imageUrl">Banner Image URL</Label>
              <Input id="imageUrl" value={formState.imageUrl} onChange={e => setFormState({...formState, imageUrl: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSaveAd} disabled={isSaving || !formState.company || !formState.title}>
              {isSaving ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
