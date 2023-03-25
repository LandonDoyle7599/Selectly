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
        photoURL:
          "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Ftse1.mm.bing.net%2Fth%3Fid%3DOIP.nZWw7ANfTXh4bphyheZErwHaEA%26pid%3DApi&f=1&ipt=82efed2f4387c2ba2dbea01e0ec99de80c7b62040b3522b16ad143783427f535&ipo=images",
      },
      {
        id: 3,
        title: "Spiderman",
        content: "Stay spidey",
        photoURL: "https://r1.ilikewallpaper.net/ipad-pro-wallpapers/download/37917/Spiderman-hero-ipad-pro-wallpaper-ilikewallpaper_com.jpg,
      },
      {
        id: 4,
        title: "Interstellar",
        content: "Time",
        photoURL: "https://picfiles.alphacoders.com/101/101684.jpg",
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
