import { Vote } from "../components/Vote";
import { CustomDeck, User, VotingDeck } from "../models";

export const Demo = () => {
  const demoDeck = {
    id: 1,
    cards: [
      {
        id: 1,
        title: "Card 1",
        content: "This is the first card",
        photoURL: "https://picsum.photos/200/300",
      },
      {
        id: 2,
        title: "Avengers",
        content: "Hammer time",
        photoURL: "https://unsplash.com/photos/TnXsLbvP2Qs",
      },
      {
        id: 3,
        title: "Spiderman",
        content: "Stay spidey",
        photoURL: "https://unsplash.com/photos/kL4coQHVj_A",
      },
      {
        id: 4,
        title: "Interstellar",
        content: "Time",
        photoURL: "https://unsplash.com/photos/-Bq3TeSBRdE",
      },
    ],
  } as VotingDeck;

  const demoUser = {
    firstName: "demo",
    lastName: "bird",
    passwordHash: "123",
    friends: [] as User[],
    friendsOf: [] as User[],
    createdAt: "",
    updatedAt: "",
    votingDeck: [] as VotingDeck[],
    customDeck: [] as CustomDeck[],
    sentFriendRequests: [] as User[],
    receivedFriendRequests: [] as User[],
    id: 1,
    email: "abc@gmail.com",
  } as unknown as User;

  return <Vote deck={demoDeck} user={demoUser}></Vote>;
};
