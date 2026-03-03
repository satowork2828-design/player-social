
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getPlayerById } from '@/lib/services/players';
import { getApprovedReviewsByPlayer } from '@/lib/services/reviews';
import { getApprovedAds } from '@/lib/services/ads';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, Quote, Trophy, Info } from 'lucide-react';
import { ReviewSummary } from '@/components/players/ReviewSummary';

export default async function PlayerPage({ params }: { params: { id: string } }) {
  const { id } = await params;
  const player = await getPlayerById(id);
  
  if (!player) notFound();

  const [playerReviews, approvedAds] = await Promise.all([
    getApprovedReviewsByPlayer(id),
    getApprovedAds()
  ]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16">
        <div className="lg:col-span-1">
          <div className="relative aspect-[4/5] rounded-2xl overflow-hidden shadow-2xl border border-border">
            <Image
              src={player.imageUrl}
              alt={player.name}
              fill
              className="object-cover"
              data-ai-hint="soccer player portrait"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6">
              <Badge className="bg-primary text-primary-foreground mb-2">{player.position}</Badge>
              <h1 className="text-4xl font-headline font-bold">{player.name}</h1>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 flex flex-col justify-center">
          <div className="flex items-center gap-4 mb-6">
            <div className="bg-card p-4 rounded-xl border border-border">
              <span className="block text-xs text-muted-foreground uppercase font-bold mb-1">Overall Rating</span>
              <div className="flex items-center gap-2">
                <Star className="w-8 h-8 text-primary fill-primary" />
                <span className="text-5xl font-headline font-bold">{player.rating}</span>
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-headline font-semibold mb-1">{player.team}</h2>
              <p className="text-muted-foreground">Age: {player.age} • Premier Athlete</p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-card/50 p-6 rounded-xl border border-border text-center">
              <Trophy className="w-6 h-6 text-primary mx-auto mb-2" />
              <span className="block text-2xl font-bold">{player.stats.matches}</span>
              <span className="text-xs text-muted-foreground uppercase">Matches</span>
            </div>
            <div className="bg-card/50 p-6 rounded-xl border border-border text-center">
              <Star className="w-6 h-6 text-accent mx-auto mb-2" />
              <span className="block text-2xl font-bold">{player.stats.goals}</span>
              <span className="text-xs text-muted-foreground uppercase">Goals</span>
            </div>
            <div className="bg-card/50 p-6 rounded-xl border border-border text-center">
              <MessageSquare className="w-6 h-6 text-primary mx-auto mb-2" />
              <span className="block text-2xl font-bold">{player.stats.assists}</span>
              <span className="text-xs text-muted-foreground uppercase">Assists</span>
            </div>
            {player.stats.cleanSheets !== undefined && (
              <div className="bg-card/50 p-6 rounded-xl border border-border text-center">
                <ShieldCheck className="w-6 h-6 text-accent mx-auto mb-2" />
                <span className="block text-2xl font-bold">{player.stats.cleanSheets}</span>
                <span className="text-xs text-muted-foreground uppercase">Clean Sheets</span>
              </div>
            )}
          </div>

          <ReviewSummary reviews={playerReviews.map(r => r.content)} />
        </div>
      </div>

      {/* Main Content: Reviews & Ads */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <MessageSquare className="w-6 h-6 text-primary" />
            <h3 className="text-2xl font-headline font-bold">Player Reviews</h3>
          </div>

          {playerReviews.length > 0 ? (
            playerReviews.map((review) => (
              <Card key={review.id} className="bg-card/30 border-border/50 overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <div>
                    <CardTitle className="text-lg text-primary">{review.title}</CardTitle>
                    <p className="text-sm text-muted-foreground">By {review.author} • {review.createdAt}</p>
                  </div>
                  <div className="flex items-center gap-1 bg-background px-3 py-1 rounded-full border border-border">
                    <Star className="w-3 h-3 text-primary fill-primary" />
                    <span className="text-sm font-bold">{review.rating}/5</span>
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <Quote className="absolute -top-2 -left-2 w-8 h-8 text-primary/10 -z-10" />
                  <p className="text-muted-foreground leading-relaxed italic">
                    "{review.content}"
                  </p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-20 bg-card/10 rounded-xl border border-dashed border-border">
              <p className="text-muted-foreground">No reviews yet for this player. Be the first!</p>
            </div>
          )}
        </div>

        {/* Sidebar: Ads */}
        <div className="lg:col-span-1 space-y-6">
          <div className="flex items-center gap-3 border-b border-border pb-4">
            <Info className="w-6 h-6 text-accent" />
            <h3 className="text-2xl font-headline font-bold">Sponsored</h3>
          </div>
          
          {approvedAds.length > 0 ? (
            approvedAds.map((ad) => (
              <Card key={ad.id} className="overflow-hidden bg-accent/5 border-accent/20 group cursor-pointer hover:border-accent/50 transition-all">
                <div className="relative h-48">
                  <Image
                    src={ad.imageUrl}
                    alt={ad.title}
                    fill
                    className="object-cover"
                    data-ai-hint="advertisement banner"
                  />
                  <Badge className="absolute top-2 right-2 bg-accent text-accent-foreground font-bold text-[10px]">SPONSORED</Badge>
                </div>
                <CardContent className="p-4">
                  <p className="text-xs text-accent font-bold uppercase mb-1">{ad.company}</p>
                  <h4 className="font-headline font-bold mb-2 group-hover:text-accent transition-colors">{ad.title}</h4>
                  <p className="text-sm text-muted-foreground">{ad.content}</p>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="p-8 text-center bg-card/20 rounded-xl border border-dashed border-border">
              <p className="text-sm text-muted-foreground italic">Partner with PitchRating to see your brand here!</p>
              <Link href="/submit-ad" className="text-xs text-accent hover:underline mt-2 inline-block">Learn More</Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function ShieldCheck(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}
