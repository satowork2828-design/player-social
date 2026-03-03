
"use client";

import { useState } from 'react';
import { generatePlayerReviewSummary } from '@/ai/flows/player-review-summary-flow';
import { Button } from '@/components/ui/button';
import { Sparkles, Loader2, MessageSquareText } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function ReviewSummary({ reviews }: { reviews: string[] }) {
  const [summary, setSummary] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    if (reviews.length === 0) return;
    setLoading(true);
    try {
      const result = await generatePlayerReviewSummary({ reviews });
      setSummary(result.summary);
    } catch (error) {
      console.error("Failed to generate summary", error);
    } finally {
      setLoading(false);
    }
  };

  if (reviews.length === 0) return null;

  return (
    <div className="mt-8">
      {!summary ? (
        <Button 
          onClick={handleSummarize} 
          disabled={loading}
          className="bg-accent hover:bg-accent/90 text-accent-foreground font-bold py-6 px-8 rounded-xl shadow-lg transition-all group"
        >
          {loading ? (
            <Loader2 className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <Sparkles className="w-5 h-5 mr-2 group-hover:scale-125 transition-transform" />
          )}
          {loading ? "Analyzing Reviews..." : "Generate AI Performance Summary"}
        </Button>
      ) : (
        <Card className="border-accent/30 bg-accent/5 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-700">
          <CardHeader className="bg-accent/10 border-b border-accent/20 py-3">
            <CardTitle className="text-sm font-headline flex items-center gap-2 text-accent">
              <Sparkles className="w-4 h-4" />
              AI Performance Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex gap-4">
              <div className="mt-1">
                <MessageSquareText className="w-6 h-6 text-accent opacity-50" />
              </div>
              <div className="space-y-4">
                {summary.split('\n\n').map((paragraph, i) => (
                  <p key={i} className="text-muted-foreground leading-relaxed text-sm">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
            <Button 
              variant="ghost" 
              size="sm" 
              className="mt-4 text-accent hover:text-accent hover:bg-accent/10 h-auto p-0"
              onClick={() => setSummary(null)}
            >
              Regenerate
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
