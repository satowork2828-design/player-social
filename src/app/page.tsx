
import Image from 'next/image';
import Link from 'next/link';
import { getPlayers } from '@/lib/services/players';
import { getApprovedAds } from '@/lib/services/ads';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp, Info, Megaphone } from 'lucide-react';

export default async function Home() {
  const [players, approvedAds] = await Promise.all([
    getPlayers(),
    getApprovedAds()
  ]);

  return (
    <div className="min-h-screen pb-20">
      {/* Hero Section */}
      <section className="relative h-[400px] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <Image
            src="https://picsum.photos/seed/pitch/1920/800"
            alt="Soccer pitch"
            fill
            className="object-cover opacity-20"
            priority
            data-ai-hint="soccer field"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        </div>
        
        <div className="container relative z-10 text-center px-4">
          <h1 className="text-5xl md:text-7xl font-headline font-bold mb-6 tracking-tight">
            Elite <span className="text-primary">Performance</span> Insights
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-8 font-body">
            Deep technical reviews and expert analysis of the world's finest soccer talents.
          </p>
          <div className="flex justify-center gap-4">
            <Badge variant="secondary" className="px-4 py-1 text-sm bg-accent/10 text-accent border-accent/20">
              <TrendingUp className="w-4 h-4 mr-2" /> Live Analytics
            </Badge>
          </div>
        </div>
      </section>

      {/* Main Content Layout */}
      <section className="container mx-auto px-4 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Player Grid (3/4 width) */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
              <h2 className="text-3xl font-headline font-bold">Featured Players</h2>
              <div className="flex gap-2">
                <span className="text-muted-foreground text-sm">Sort by: </span>
                <button className="text-primary font-medium text-sm">Rating</button>
              </div>
            </div>

            {players.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {players.map((player) => (
                  <Link key={player.id} href={`/players/${player.id}`}>
                    <Card className="group overflow-hidden bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all duration-300">
                      <div className="relative h-64 overflow-hidden">
                        <Image
                          src={player.imageUrl}
                          alt={player.name}
                          fill
                          className="object-cover transition-transform duration-500 group-hover:scale-110"
                          data-ai-hint="soccer player portrait"
                        />
                        <div className="absolute top-3 right-3 bg-background/80 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1">
                          <Star className="w-4 h-4 text-primary fill-primary" />
                          <span className="font-bold">{player.rating}</span>
                        </div>
                      </div>
                      <CardHeader className="p-4">
                        <CardTitle className="text-xl group-hover:text-primary transition-colors">{player.name}</CardTitle>
                        <div className="flex items-center justify-between">
                          <p className="text-sm text-muted-foreground">{player.team}</p>
                          <Badge variant="outline" className="text-[10px] uppercase font-bold tracking-wider">{player.position}</Badge>
                        </div>
                      </CardHeader>
                      <CardFooter className="p-4 pt-0 flex justify-between text-xs text-muted-foreground">
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-foreground">{player.stats.matches}</span>
                          <span>Apps</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-foreground">{player.stats.goals}</span>
                          <span>Goals</span>
                        </div>
                        <div className="flex flex-col items-center">
                          <span className="font-bold text-foreground">{player.stats.assists}</span>
                          <span>Assists</span>
                        </div>
                      </CardFooter>
                    </Card>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-card/10 rounded-xl border border-dashed border-border">
                <p className="text-muted-foreground">No players found. Please add players to the "players" collection in Firestore.</p>
              </div>
            )}
          </div>

          {/* Sidebar Ads (1/4 width) */}
          <div className="lg:col-span-1 space-y-6">
            <div className="flex items-center gap-3 border-b border-border pb-4 mb-4">
              <Megaphone className="w-5 h-5 text-accent" />
              <h3 className="text-xl font-headline font-bold">Partner Spotlights</h3>
            </div>

            {approvedAds.length > 0 ? (
              approvedAds.map((ad) => (
                <Card key={ad.id} className="overflow-hidden bg-accent/5 border-accent/20 group cursor-pointer hover:border-accent/50 transition-all">
                  <div className="relative h-40">
                    <Image
                      src={ad.imageUrl}
                      alt={ad.title}
                      fill
                      className="object-cover"
                      data-ai-hint="advertisement banner"
                    />
                    <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground font-bold text-[10px]">AD</Badge>
                  </div>
                  <CardContent className="p-4">
                    <p className="text-[10px] text-accent font-bold uppercase mb-1">{ad.company}</p>
                    <h4 className="text-sm font-headline font-bold mb-2 group-hover:text-accent transition-colors leading-tight">{ad.title}</h4>
                    <p className="text-xs text-muted-foreground line-clamp-2">{ad.content}</p>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="p-6 text-center bg-card/20 rounded-xl border border-dashed border-border">
                <Info className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground italic">Partner with PitchRating!</p>
                <Link href="/submit-ad" className="text-xs text-accent hover:underline mt-2 inline-block">Submit Campaign</Link>
              </div>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
