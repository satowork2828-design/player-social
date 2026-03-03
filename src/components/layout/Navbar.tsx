
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Trophy, ShieldCheck, PenSquare, LayoutDashboard, Megaphone } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Players', href: '/', icon: Trophy },
  { name: 'Review', href: '/submit-review', icon: PenSquare },
  { name: 'Advertise', href: '/submit-ad', icon: Megaphone },
  { name: 'Admin', href: '/admin/reviews', icon: ShieldCheck },
];

export function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center transition-transform group-hover:scale-105">
            <Trophy className="text-primary-foreground h-6 w-6" />
          </div>
          <span className="font-headline text-2xl font-bold tracking-tight text-primary">PitchRating</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground"
              )}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          ))}
        </div>

        <div className="flex items-center gap-4">
          <Link href="/submit-review">
             <button className="bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 rounded-md text-sm font-semibold transition-all">
                Submit Review
             </button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
