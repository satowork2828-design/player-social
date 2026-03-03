
import Image from 'next/image';
import Link from 'next/link';
import { players } from '@/lib/mock-data';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, TrendingUp } from 'lucide-react';

export default function Home() {
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

      {/* Player Grid */}
      <section className="container mx-auto px-4 mt-12">
        <div className="flex items-center justify-between mb-8 border-b border-border pb-4">
          <h2 className="text-3xl font-headline font-bold">Featured Players</h2>
          <div className="flex gap-2">
            <span className="text-muted-foreground text-sm">Sort by: </span>
            <button className="text-primary font-medium text-sm">Rating</button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
      </section>
    </div>
  );
}
