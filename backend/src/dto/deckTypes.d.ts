export type CreateVotingDeckProps = {
  client: PrismaClient;
  userId?: number;
  type: "custom" | "movie";
  title: string;
  friends: number[];
};

export type AddCardsToDeckProps = {
  client: PrismaClient;
  title: string;
  content: string;
  votingDeckId?: number | null;
  customDeckId?: number | null;
  photoURL?: string | "";
  link?: string | "";
};
