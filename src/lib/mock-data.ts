
export interface Player {
  id: string;
  name: string;
  team: string;
  position: 'Forward' | 'Midfielder' | 'Defender' | 'Goalkeeper';
  age: number;
  rating: number;
  imageUrl: string;
  stats: {
    goals: number;
    assists: number;
    cleanSheets?: number;
    matches: number;
  };
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
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
    stats: { goals: 28, assists: 12, matches: 34 },
    attributes: { pace: 97, shooting: 90, passing: 80, dribbling: 92, defending: 36, physical: 78 }
  },
  {
    id: '2',
    name: 'Erling Haaland',
    team: 'Manchester City',
    position: 'Forward',
    age: 23,
    rating: 91,
    imageUrl: 'https://picsum.photos/seed/haaland/400/500',
    stats: { goals: 32, assists: 5, matches: 30 },
    attributes: { pace: 89, shooting: 93, passing: 66, dribbling: 80, defending: 45, physical: 88 }
  }
];
