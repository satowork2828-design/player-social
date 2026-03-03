
"use client";

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { getPlayers, getPlayerById } from '@/lib/services/players';
import { Player } from '@/lib/mock-data';
import { generatePlayerComparison, ComparisonOutput } from '@/ai/flows/player-comparison-flow';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, Loader2, GitCompare, Trophy, ArrowRightLeft } from 'lucide-react';
import Image from 'next/image';

function CompareContent() {
  const searchParams = useSearchParams();
  const [players, setPlayers] = useState<Player[]>([]);
  const [p1, setP1] = useState<Player | null>(null);
  const [p2, setP2] = useState<Player | null>(null);
  const [comparison, setComparison] = useState<ComparisonOutput | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      const all = await getPlayers();
      setPlayers(all);
      
      const p1Id = searchParams.get('p1');
      if (p1Id) {
        const found = all.find(p => p.id === p1Id);
        if (found) setP1(found);
      }
    }
    load();
  }, [searchParams]);

  const handleCompare = async () => {
    if (!p1 || !p2) return;
    setLoading(true);
    try {
      const result = await generatePlayerComparison({ player1: p1, player2: p2 });
      setComparison(result);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <div className="text-center mb-12">
        <div className="w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
          <GitCompare className="w-8 h-8 text-accent" />
        </div>
        <h1 className="text-4xl font-headline font-bold mb-2">AI Scouting Comparison</h1>
        <p className="text-muted-foreground">Select two elite talents for a technical head-to-head analysis.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-8 mb-12">
        {/* Player 1 Selection */}
        <div className="space-y-4">
          <Select value={p1?.id || ""} onValueChange={(val) => setP1(players.find(p => p.id === val) || null)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Player 1" />
            </SelectTrigger>
            <SelectContent>
              {players.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name} ({p.team})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {p1 && (
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="relative w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden border-2 border-primary">
                <Image src={p1.imageUrl} alt={p1.name} fill className="object-cover" />
              </div>
              <h3 className="font-bold text-lg">{p1.name}</h3>
              <p className="text-xs text-muted-foreground uppercase">{p1.position}</p>
            </div>
          )}
        </div>

        <div className="flex justify-center">
          <ArrowRightLeft className="w-10 h-10 text-muted-foreground opacity-20" />
        </div>

        {/* Player 2 Selection */}
        <div className="space-y-4">
          <Select value={p2?.id || ""} onValueChange={(val) => setP2(players.find(p => p.id === val) || null)}>
            <SelectTrigger className="h-12">
              <SelectValue placeholder="Select Player 2" />
            </SelectTrigger>
            <SelectContent>
              {players.map(p => (
                <SelectItem key={p.id} value={p.id}>{p.name} ({p.team})</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {p2 && (
            <div className="bg-card rounded-xl border border-border p-4 text-center">
              <div className="relative w-32 h-32 mx-auto mb-3 rounded-full overflow-hidden border-2 border-accent">
                <Image src={p2.imageUrl} alt={p2.name} fill className="object-cover" />
              </div>
              <h3 className="font-bold text-lg">{p2.name}</h3>
              <p className="text-xs text-muted-foreground uppercase">{p2.position}</p>
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-center mb-16">
        <Button 
          disabled={!p1 || !p2 || loading} 
          onClick={handleCompare}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-8 px-12 rounded-2xl text-xl shadow-xl shadow-primary/20 group"
        >
          {loading ? <Loader2 className="w-6 h-6 mr-3 animate-spin" /> : <Sparkles className="w-6 h-6 mr-3 group-hover:scale-125 transition-all" />}
          {loading ? "Analyzing Technical Profiles..." : "Generate AI Scouting Report"}
        </Button>
      </div>

      {comparison && (
        <Card className="border-primary/30 bg-primary/5 animate-in fade-in slide-in-from-bottom-8 duration-700">
          <CardHeader className="bg-primary/10 border-b border-primary/20 flex flex-row items-center justify-between">
            <CardTitle className="text-xl font-headline flex items-center gap-2 text-primary">
              <Trophy className="w-6 h-6" />
              Technical Scouting Report
            </CardTitle>
            <Badge variant="default" className="bg-primary text-primary-foreground">
              Edge: {comparison.winner}
            </Badge>
          </CardHeader>
          <CardContent className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              <div className="lg:col-span-2">
                <div className="space-y-6">
                  {comparison.analysis.split('\n\n').map((paragraph, i) => (
                    <p key={i} className="text-muted-foreground leading-relaxed italic">
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-1">
                <div className="bg-background/50 p-6 rounded-xl border border-border">
                  <h4 className="font-bold mb-4 text-primary uppercase text-sm tracking-widest">Key Performance Divergence</h4>
                  <ul className="space-y-4">
                    {comparison.keyDifferences.map((diff, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                        {diff}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center"><Loader2 className="w-8 h-8 animate-spin" /></div>}>
      <CompareContent />
    </Suspense>
  );
}
