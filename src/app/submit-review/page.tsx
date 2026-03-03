
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { players } from '@/lib/mock-data';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { PenSquare, Info } from 'lucide-react';

const reviewSchema = z.object({
  playerId: z.string().min(1, "Please select a player"),
  rating: z.string().min(1, "Please provide a rating"),
  title: z.string().min(5, "Title must be at least 5 characters"),
  content: z.string().min(20, "Review content must be at least 20 characters"),
});

export default function SubmitReviewPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof reviewSchema>>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      playerId: "",
      rating: "5",
      title: "",
      content: "",
    },
  });

  async function onSubmit(values: z.infer<typeof reviewSchema>) {
    setSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    toast({
      title: "Review Submitted!",
      description: "Your review is pending administrator approval.",
    });
    
    setSubmitting(false);
    router.push('/');
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <PenSquare className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-4xl font-headline font-bold mb-2">Submit Analysis</h1>
        <p className="text-muted-foreground">Share your technical performance review for any player.</p>
      </div>

      <div className="bg-card p-8 rounded-2xl border border-border shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="playerId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Target Player</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a player to review" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {players.map(player => (
                        <SelectItem key={player.id} value={player.id}>{player.name} ({player.team})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating (1-5)</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {[1, 2, 3, 4, 5].map(v => (
                          <SelectItem key={v} value={v.toString()}>{v} Stars</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Article Headline</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g., Masterclass Performance" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Detailed Analysis</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="Discuss tactical positioning, technical execution, and impact on the match..." 
                      className="min-h-[200px]"
                      {...field} 
                    />
                  </FormControl>
                  <FormDescription>Minimum 20 characters of detailed insight required.</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-primary/10 border border-primary/20 p-4 rounded-xl flex items-start gap-3">
              <Info className="w-5 h-5 text-primary mt-0.5 shrink-0" />
              <p className="text-xs text-muted-foreground leading-relaxed">
                By submitting, you agree that your review will be moderated for quality and adherence to PitchRating guidelines. Professionalism is expected.
              </p>
            </div>

            <Button type="submit" className="w-full bg-primary py-6 text-lg font-bold" disabled={submitting}>
              {submitting ? "Publishing..." : "Publish Analysis"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
