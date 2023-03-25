import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

async function main() {
  let bob = await client.user.create({
    data: {
      email: "bob.smith@rh.test",
      firstName: "Bob",
      lastName: "Smith",
      passwordHash:
        "$2b$10$swWTPoxKDklVyN1znSRauu7APtE.0V4NizI.d5iW4g9wKCQfIGNtK",
    },
  });
  let steve = await client.user.create({
    data: {
      email: "steve.smith@rh.test",
      firstName: "Steve",
      lastName: "Smith",
      passwordHash:
        "$2b$10$HubJmA7n5RvWeKb6eYUjXOWfNVBYnlJCBhUePiR39Vd6EkZxssT3W",
    },
  });
  await client.user.update({
    where: {
      id: bob.id,
    },
    data: {
      friends: {
        connect: {
          id: steve.id,
        },
      },
    },
  });
  await client.user.update({
    where: {
      id: steve.id,
    },
    data: {
      friends: {
        connect: {
          id: bob.id,
        },
      },
    },
  });
  let card1 = await client.card.create({
    data: {
      title: "Settlers of Catan",
      content: "Makes me want to die",
    },
  });
  let card2 = await client.card.create({
    data: {
      title: "Dice Forge",
      content: "Anvil not included",
    },
  });
  let card3 = await client.card.create({
    data: {
      title: "Monopoly",
      content: "I hate this game",
    },
  });
  let deck = await client.votingDeck.create({
    data: {
      title: "My Board Games",
      users: {
        connect: [{ id: bob.id }, { id: steve.id }],
      },
      cards: {
        connect: [{ id: card1.id }, { id: card2.id }, { id: card3.id }],
      },
      status: "active",
      type: "custom",
    },
  });
}

main()
  .then(async () => {
    await client.$disconnect();
  })
  .catch(async () => {
    await client.$disconnect();
  });
