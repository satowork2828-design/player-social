
"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Trophy, ShieldCheck, PenSquare, Megaphone, LogOut, User as UserIcon, GitCompare, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { onAuthStateChanged, signOut, User } from '@/lib/services/auth';
import { getUserProfile } from '@/lib/services/users';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/firebase/config";

const navItems = [
  { name: 'Players', href: '/', icon: Trophy },
  { name: 'Compare', href: '/compare', icon: GitCompare },
  { name: 'Review', href: '/submit-review', icon: PenSquare },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        const profile = await getUserProfile(user.uid);
        setIsAdmin(profile?.isAdmin || false);
      } else {
        setIsAdmin(false);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push('/auth');
  };

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
          {isAdmin && (
            <Link
              href="/admin/players"
              className={cn(
                "flex items-center gap-2 text-sm font-medium transition-colors hover:text-primary",
                pathname.startsWith('/admin') ? "text-primary" : "text-muted-foreground"
              )}
            >
              <ShieldCheck className="h-4 w-4" />
              Admin
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {!loading && (
            user ? (
              <div className="flex items-center gap-4">
                <Link href="/submit-review" className="hidden sm:block">
                  <Button variant="default" size="sm" className="font-semibold">
                    Submit Review
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                      <Avatar className="h-10 w-10 border border-border">
                        <AvatarFallback className="bg-primary/10 text-primary">
                          {user.email?.charAt(0).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{isAdmin ? 'Admin Analyst' : 'Analyst'}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="cursor-pointer">
                        <UserCircle className="mr-2 h-4 w-4" />
                        <span>My Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    {isAdmin && (
                      <DropdownMenuItem asChild>
                        <Link href="/admin/players" className="cursor-pointer">
                          <ShieldCheck className="mr-2 h-4 w-4" />
                          <span>Management</span>
                        </Link>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive focus:text-destructive cursor-pointer">
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <Link href="/auth">
                <Button variant="default" size="sm" className="font-semibold px-6">
                  Sign In
                </Button>
              </Link>
            )
          )}
        </div>
      </div>
    </nav>
  );
}
