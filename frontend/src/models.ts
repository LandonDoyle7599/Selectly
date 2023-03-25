export interface VotingDeck {
  id: number;
  users: User[];
  cards: Card[];
  status: string;
  votes: Vote[];
  title: string;
  type: string;
  createdAt: Date;
  updatedAt: Date;
  queuePosition?: number;
}

export interface CustomDeck {
  id: number;
  user: User;
  cards: Card[];
  title: string;
  type: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  passwordHash: string;
  friends: User[];
  friendsOf: User[];
  createdAt: Date;
  updatedAt: Date;
  votingDeck: VotingDeck[];
  customDeck: CustomDeck[];
  votes: Vote[];
  sentFriendRequests: FriendRequest[];
  receivedFriendRequests: FriendRequest[];
}

export interface Card {
  id: number;
  title: string;
  content: string;
  photoURL: string | null;
  link: string | null;
  votingDeck: VotingDeck;
  customDeck: CustomDeck;
  createdAt: Date;
  updatedAt: Date;
  votes: Vote[];
}

export interface Vote {
  id: number;
  deck: VotingDeck;
  user: User;
  card: Card;
  createdAt: Date;
  updatedAt: Date;
}

export interface FriendRequest {
  id: number;
  status: string;
  sender: User;
  receiver: User;
  createdAt: Date;
  updatedAt: Date;
}
