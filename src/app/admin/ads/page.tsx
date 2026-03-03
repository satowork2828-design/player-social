
"use client";

import { useState } from 'react';
import { ads as initialAds } from '@/lib/mock-data';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Trash2, Image as ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

export default function AdminAdsPage() {
  const [ads, setAds] = useState(initialAds);
  const { toast } = useToast();

  const handleStatus = (id: string, status: 'approved' | 'rejected') => {
    setAds(prev => prev.map(a => a.id === id ? { ...a, status } : a));
    toast({
      title: `Ad ${status.charAt(0).toUpperCase() + status.slice(1)}`,
      description: `The proposal has been marked as ${status}.`,
    });
  };

  const handleDelete = (id: string) => {
    setAds(prev => prev.filter(a => a.id !== id));
    toast({
      title: "Ad Removed",
      variant: "destructive",
    });
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="text-4xl font-headline font-bold">Partner Campaigns</h1>
          <p className="text-muted-foreground">Manage sponsored content and advertisements.</p>
        </div>
        <div className="flex gap-2">
           <Link href="/admin/reviews">
             <Button variant="outline">Manage Reviews</Button>
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
    </div>
  );
}
