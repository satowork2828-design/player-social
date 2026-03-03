
"use client";

import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer, Tooltip } from "recharts";
import { Player } from "@/lib/mock-data";

export function PlayerStatsChart({ player }: { player: Player }) {
  const data = [
    { subject: 'Pace', A: player.attributes.pace, fullMark: 100 },
    { subject: 'Shooting', A: player.attributes.shooting, fullMark: 100 },
    { subject: 'Passing', A: player.attributes.passing, fullMark: 100 },
    { subject: 'Dribbling', A: player.attributes.dribbling, fullMark: 100 },
    { subject: 'Defense', A: player.attributes.defending, fullMark: 100 },
    { subject: 'Physical', A: player.attributes.physical, fullMark: 100 },
  ];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="80%" data={data}>
          <PolarGrid stroke="hsl(var(--border))" />
          <PolarAngleAxis 
            dataKey="subject" 
            tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
          />
          <Radar
            name={player.name}
            dataKey="A"
            stroke="hsl(var(--primary))"
            fill="hsl(var(--primary))"
            fillOpacity={0.4}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: 'hsl(var(--card))', border: '1px solid hsl(var(--border))', borderRadius: '8px' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
