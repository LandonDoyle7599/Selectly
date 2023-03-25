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
      title: "Card 1",
      content: "Card 1 description",
    },
  });
  let card2 = await client.card.create({
    data: {
      title: "Card 2",
      content: "Card 2 description",
    },
  });
  let deck = await client.votingDeck.create({
    data: {
      title: "Test Deck",
      users: {
        connect: [{ id: bob.id }, { id: steve.id }],
      },
      cards: {
        connect: [{ id: card1.id }, { id: card2.id }],
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
