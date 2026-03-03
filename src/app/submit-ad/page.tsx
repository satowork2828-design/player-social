
"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { submitAd } from '@/lib/services/ads';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, CreditCard } from 'lucide-react';

const adSchema = z.object({
  company: z.string().min(2, "Company name is required"),
  title: z.string().min(5, "Ad title is required"),
  content: z.string().min(10, "Ad content is required"),
  imageUrl: z.string().url("Please provide a valid image URL for the banner"),
});

export default function SubmitAdPage() {
  const { toast } = useToast();
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<z.infer<typeof adSchema>>({
    resolver: zodResolver(adSchema),
    defaultValues: {
      company: "",
      title: "",
      content: "",
      imageUrl: "",
    },
  });

  async function onSubmit(values: z.infer<typeof adSchema>) {
    setSubmitting(true);
    try {
      await submitAd(values);
      
      toast({
        title: "Proposal Received!",
        description: "Our marketing team will review your content for approval.",
      });
      
      router.push('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit proposal. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }

  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-2xl">
      <div className="mb-10 text-center">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <Megaphone className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl font-headline font-bold mb-2">Partner with PitchRating</h1>
        <p className="text-muted-foreground">Promote your brand to our community of elite football analysts.</p>
      </div>

      <div className="bg-card p-8 rounded-2xl border border-border shadow-xl">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Organization Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Elite Sports Wear" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Campaign Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Summer Boot Collection 2024" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Short Description / Tagline</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Experience peak performance with our new range..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Banner Image URL</FormLabel>
                  <FormControl>
                    <Input placeholder="https://..." {...field} />
                  </FormControl>
                  <FormDescription>Ideal size: 800x400px</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="bg-accent/10 border border-accent/20 p-6 rounded-xl">
              <div className="flex items-center gap-3 mb-4">
                <CreditCard className="w-6 h-6 text-accent" />
                <h3 className="font-headline font-bold text-accent">Payment Details</h3>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Sponsored placements are currently handled via invoice. Once your ad is approved, our team will contact you with pricing options and scheduling.
              </p>
            </div>

            <Button type="submit" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground py-6 text-lg font-bold" disabled={submitting}>
              {submitting ? "Processing Submission..." : "Submit Ad Proposal"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
