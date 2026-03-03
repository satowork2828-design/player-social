
"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth } from '@/lib/firebase/config';
import { onAuthStateChanged, User } from '@/lib/services/auth';
import { getUserProfile, updateUserProfile, UserProfile } from '@/lib/services/users';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User as UserIcon, Mail, ShieldCheck, Save, Calendar } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

const profileSchema = z.object({
  displayName: z.string().min(2, "Name must be at least 2 characters").optional(),
  bio: z.string().max(200, "Bio must be under 200 characters").optional(),
});

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();

  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      displayName: "",
      bio: "",
    },
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (u) => {
      if (u) {
        setUser(u);
        const p = await getUserProfile(u.uid);
        if (p) {
          setProfile(p);
          form.reset({
            displayName: p.displayName || "",
            bio: p.bio || "",
          });
        }
      } else {
        router.push('/auth');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, form]);

  async function onSubmit(values: z.infer<typeof profileSchema>) {
    if (!user) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, values);
      setProfile(prev => prev ? { ...prev, ...values } : null);
      toast({ title: "Profile Updated", description: "Your analyst details have been saved." });
    } catch (err) {
      toast({ title: "Update Failed", description: "Could not save profile changes.", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <Card className="border-border/50 bg-card/50 shadow-xl overflow-hidden">
            <div className="h-24 bg-primary/10 w-full" />
            <div className="px-6 pb-6 -mt-12">
              <Avatar className="h-24 w-24 border-4 border-background mx-auto mb-4 ring-2 ring-primary/20">
                <AvatarFallback className="text-3xl font-bold bg-primary text-primary-foreground">
                  {user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="text-center space-y-1">
                <h2 className="text-xl font-bold font-headline">{profile?.displayName || 'Analyst'}</h2>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
                <div className="pt-4 flex justify-center gap-2">
                  {profile?.isAdmin && (
                    <Badge className="bg-primary text-primary-foreground">Administrator</Badge>
                  )}
                  {user?.emailVerified ? (
                    <Badge variant="secondary" className="bg-green-500/10 text-green-500 border-green-500/20">Verified</Badge>
                  ) : (
                    <Badge variant="outline" className="text-amber-500 border-amber-500/20">Pending Verification</Badge>
                  )}
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-border space-y-4">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4" />
                  Joined {profile ? new Date(profile.createdAt).toLocaleDateString() : 'N/A'}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <ShieldCheck className="w-4 h-4" />
                  PitchRating Analyst ID: {user?.uid.slice(0, 8)}
                </div>
              </div>
            </div>
          </Card>
        </div>

        <div className="lg:col-span-2">
          <Card className="border-border/50 bg-card/50 shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserIcon className="w-5 h-5 text-primary" /> Technical Analyst Settings
              </CardTitle>
              <CardDescription>Update your public profile and scouting credentials.</CardDescription>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="displayName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Public Display Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Scout Master / Technical Analyst" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Analyst Bio</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell the community about your tactical background..." 
                            className="min-h-[120px]"
                            {...field} 
                          />
                        </FormControl>
                        <FormDescription>Briefly describe your areas of expertise (max 200 chars).</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="flex justify-end pt-4">
                    <Button type="submit" disabled={saving} className="font-bold">
                      {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                      Save Analyst Profile
                    </Button>
                  </div>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
