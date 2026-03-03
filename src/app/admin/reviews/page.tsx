
"use client";

import { useState, useEffect } from 'react';
import { getAllReviews, updateReviewStatus, deleteReview } from '@/lib/services/reviews';
import { getPlayers } from '@/lib/services/players';
import { Review, Player } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2, ExternalLink, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function loadData() {
      try {
        const [reviewsData, playersData] = await Promise.all([
          getAllReviews(),
          getPlayers()
        ]);
        setReviews(reviewsData);
        setPlayers(playersData);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      await updateReviewStatus(id, status);
      setReviews(prev => prev.map(r => r.id === id ? { ...r, status } : r));
      toast({
        title: `Review ${status.charAt(0).toUpperCase() + status.slice(1)}`,
        description: `The article has been ${status}.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update status.",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteReview(id);
      setReviews(prev => prev.filter(r => r.id !== id));
      toast({
        title: "Review Deleted",
        variant: "destructive",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete review.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-20 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-primary mb-4" />
        <p className="text-muted-foreground">Loading reviews...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold">Review Management</h1>
          <p className="text-muted-foreground">Approve, moderate, and manage player analysis articles.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/admin/ads">
             <Button variant="outline">Manage Advertisements</Button>
           </Link>
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Player</TableHead>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => {
              const player = players.find(p => p.id === review.playerId);
              return (
                <TableRow key={review.id} className="hover:bg-muted/20 transition-colors">
                  <TableCell className="font-medium">
                    <div className="flex flex-col">
                      <span>{player?.name || 'Unknown Player'}</span>
                      <span className="text-xs text-muted-foreground">{player?.team}</span>
                    </div>
                  </TableCell>
                  <TableCell className="max-w-[200px] truncate">{review.title}</TableCell>
                  <TableCell>{review.author}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <span className="font-bold">{review.rating}</span>
                      <span className="text-muted-foreground text-xs">/ 5</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={review.status === 'approved' ? 'default' : review.status === 'rejected' ? 'destructive' : 'secondary'}>
                      {review.status.toUpperCase()}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      {review.status === 'pending' && (
                        <>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-green-500 hover:text-green-600 hover:bg-green-500/10" onClick={() => handleStatus(review.id, 'approved')}>
                            <Check className="h-4 w-4" />
                          </Button>
                          <Button size="icon" variant="ghost" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => handleStatus(review.id, 'rejected')}>
                            <X className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                      <Button size="icon" variant="ghost" className="h-8 w-8" asChild>
                         <Link href={`/players/${review.playerId}`} target="_blank">
                            <ExternalLink className="h-4 w-4" />
                         </Link>
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8" onClick={() => handleDelete(review.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
