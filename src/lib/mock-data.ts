
export interface Player {
  id: string;
  name: string;
  team: string;
  position: string;
  age: number;
  rating: number;
  imageUrl: string;
  stats: {
    goals: number;
    assists: number;
    cleanSheets?: number;
    matches: number;
  };
}

export interface Review {
  id: string;
  playerId: string;
  author: string;
  rating: number;
  title: string;
  content: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface AdSubmission {
  id: string;
  company: string;
  title: string;
  content: string;
  imageUrl: string;
  status: 'pending' | 'approved' | 'rejected';
}

export const players: Player[] = [
  {
    id: '1',
    name: 'Kylian Mbappé',
    team: 'Real Madrid',
    position: 'Forward',
    age: 25,
    rating: 92,
    imageUrl: 'https://picsum.photos/seed/mbappe/400/500',
    stats: { goals: 28, assists: 12, matches: 34 }
  },
  {
    id: '2',
    name: 'Erling Haaland',
    team: 'Manchester City',
    position: 'Forward',
    age: 23,
    rating: 91,
    imageUrl: 'https://picsum.photos/seed/haaland/400/500',
    stats: { goals: 32, assists: 5, matches: 30 }
  },
  {
    id: '3',
    name: 'Jude Bellingham',
    team: 'Real Madrid',
    position: 'Midfielder',
    age: 20,
    rating: 89,
    imageUrl: 'https://picsum.photos/seed/bellingham/400/500',
    stats: { goals: 18, assists: 15, matches: 36 }
  },
  {
    id: '4',
    name: 'Alisson Becker',
    team: 'Liverpool',
    position: 'Goalkeeper',
    age: 31,
    rating: 88,
    imageUrl: 'https://picsum.photos/seed/alisson/400/500',
    stats: { goals: 0, assists: 1, cleanSheets: 14, matches: 32 }
  }
];

export const reviews: Review[] = [
  {
    id: 'r1',
    playerId: '1',
    author: 'Tactical Analyst',
    rating: 5,
    title: 'Unstoppable Force',
    content: 'Mbappé\'s explosive pace and clinical finishing are unmatched. His movement off the ball creates chaos in any defensive line.',
    status: 'approved',
    createdAt: '2024-03-01'
  },
  {
    id: 'r2',
    playerId: '1',
    author: 'Football Guru',
    rating: 4,
    title: 'Elite but expensive',
    content: 'Great individual skill, but sometimes holds onto the ball too long. Still the best forward in the world right now.',
    status: 'approved',
    createdAt: '2024-03-05'
  },
  {
    id: 'r3',
    playerId: '2',
    author: 'Scout Master',
    rating: 5,
    title: 'The Ultimate Goal Machine',
    content: 'Haaland is a physical specimen. If he gets a touch in the box, it is almost certainly a goal.',
    status: 'approved',
    createdAt: '2024-02-15'
  }
];

export const ads: AdSubmission[] = [
  {
    id: 'a1',
    company: 'Nike',
    title: 'Just Do It',
    content: 'Get the latest Mercurial boots today.',
    imageUrl: 'https://picsum.photos/seed/nike/400/300',
    status: 'approved'
  }
];
