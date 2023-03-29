import { PrismaClient } from "@prisma/client";
const client = new PrismaClient();

async function main() {
  let alice = await client.user.create({
    data: {
      email: "alice@doyle.com",
      firstName: "Alice",
      lastName: "Alice",
      passwordHash:
        "$2b$10$swWTPoxKDklVyN1znSRauu7APtE.0V4NizI.d5iW4g9wKCQfIGNtK",
    },
  });
  let megan = await client.user.create({
    data: {
      email: "megan@hansen.com",
      firstName: "Megan",
      lastName: "Hansen",
      passwordHash:
        "$2b$10$swWTPoxKDklVyN1znSRauu7APtE.0V4NizI.d5iW4g9wKCQfIGNtK",
    },
  });
  let jared = await client.user.create({
    data: {
      email: "jared@hansen.com",
      firstName: "Jared",
      lastName: "Hansen",
      passwordHash:
        "$2b$10$swWTPoxKDklVyN1znSRauu7APtE.0V4NizI.d5iW4g9wKCQfIGNtK",
    },
  });
  let aaron = await client.user.create({
    data: {
      email: "aaron@hanks.com",
      firstName: "Aaron",
      lastName: "Hanks",
      passwordHash:
        "$2b$10$swWTPoxKDklVyN1znSRauu7APtE.0V4NizI.d5iW4g9wKCQfIGNtK",
    },
  });
  let shalice = await client.user.create({
    data: {
      email: "shalice@hanks.com",
      firstName: "Shalice",
      lastName: "Hanks",
      passwordHash:
        "$2b$10$swWTPoxKDklVyN1znSRauu7APtE.0V4NizI.d5iW4g9wKCQfIGNtK",
    },
  });
  let landon = await client.user.create({
    data: {
      email: "landon@doyle.com",
      firstName: "Landon",
      lastName: "Doyle",
      passwordHash:
        "$2b$10$HubJmA7n5RvWeKb6eYUjXOWfNVBYnlJCBhUePiR39Vd6EkZxssT3W",
    },
  });
  await client.user.update({
    where: {
      id: alice.id,
    },
    data: {
      friends: {
        connect: [
          {id: megan.id},
          {id: jared.id},
          {id: aaron.id},
          {id: shalice.id},
          {id: landon.id},
        ]
      },
    },
  });
  await client.user.update({
    where: {
      id: megan.id,
    },
    data: {
      friends: {
        connect: [
         {id: alice.id},
         {id: jared.id},
          {id: aaron.id},
          {id: shalice.id},
          {id: landon.id},
        ],
      },
    },
  });
  await client.user.update({
    where: {
      id: jared.id,
    },
    data: {
      friends: {
        connect: [
          {id: alice.id},
          {id: megan.id},
          {id: aaron.id},
          {id: shalice.id},
          {id: landon.id},
        ],
      },
    },
  });
  await client.user.update({
    where: {
      id: aaron.id,
    },
    data: {
      friends: {
        connect: [
          {id: alice.id},
          {id: megan.id},
          {id: jared.id},
          {id: shalice.id},
          {id: landon.id},
        ],
      },
    },
  });
  await client.user.update({
    where: {
      id: shalice.id,
    },
    data: {
      friends: {
        connect: [
          {id: alice.id},
          {id: megan.id},
          {id: jared.id},
          {id: aaron.id},
          {id: landon.id},
        ],
      },
    },
  });
  await client.user.update({
    where: {
      id: landon.id,
    },
    data: {
      friends: {
        connect: [
          {id: alice.id},
          {id: megan.id},
          {id: jared.id},
          {id: aaron.id},
          {id: shalice.id},
        ],
      },
    },
  });
  let card1 = await client.card.create({
    data: {
      title: "Sushi Go",
      content: "",
    },
  });
  let card2 = await client.card.create({
    data: {
      title: "Camelot",
      content: "",
    },
  });
  let card3 = await client.card.create({
    data: {
      title: "7 wonders",
      content: "",
    },
  });
  let card4 = await client.card.create({
    data: {
      title: "Dominion",
      content: "",
    },
  });
  let card5 = await client.card.create({
    data: {
      title: "Uno",
      content: "",
    },
  });
  let card6 = await client.card.create({
    data: {
      title: "liars dice",
      content: "",
    },
  });
  let card7 = await client.card.create({
    data: {
      title: "nertz",
      content: "",
    },
  });
  let card8 = await client.card.create({
    data: {
      title: "ticket to ride",
      content: "",
    },
  });
  let card9 = await client.card.create({
    data: {
      title: "blood bath",
      content: "",
    },
  });
  let deck = await client.votingDeck.create({
    data: {
      title: "My Board Games",
      users: {
        connect: [{ id: alice.id }, { id: megan.id }, { id: jared.id }, { id: aaron.id }, { id: shalice.id }, { id: landon.id }],
      },
      cards: {
        connect: [{ id: card1.id }, { id: card2.id }, { id: card3.id }, { id: card4.id }, { id: card5.id }, { id: card6.id }, { id: card7.id }, { id: card8.id }, { id: card9.id }],
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
