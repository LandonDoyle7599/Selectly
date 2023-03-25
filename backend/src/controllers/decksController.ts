import { Card, PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import {
  AddCardsToDeckProps,
  CreateVotingDeckProps,
  CustomDeckProps,
  CustomStartBody,
} from "../dto/deckTypes";
import { MovieData, MovieDeckCreationBody } from "../dto/movieDeckTypes";
import {
  RestaurantData,
  RestaurantDeckCreationBody,
} from "../dto/restaurantDeckTypes";
import { RequestWithJWTBody } from "../dto/types";
import { controller } from "../lib/controller";

const createNewVotingDeck = async ({
  client,
  userId,
  type,
  title,
  friends,
}: CreateVotingDeckProps) => {
  if (!userId) return null;
  if (friends.length < 1) return null;
  if (!title) return null;
  const newDeck = await client.votingDeck.create({
    data: {
      status: "active",
      title,
      type,
      users: { connect: { id: userId } },
    },
  });
  for (let i = 0; i < friends.length; i++) {
    await client.votingDeck.update({
      where: {
        id: newDeck.id,
      },
      data: {
        users: {
          connect: {
            id: friends[i],
          },
        },
      },
    });
  }
  return newDeck;
};

const addCardToDeck = async ({
  client,
  title,
  content,
  votingDeckId,
  customDeckId,
  photoURL,
  link,
}: AddCardsToDeckProps) => {
  if (!title || !content) return null;
  if (!votingDeckId && !customDeckId) return null;
  const card = await client.card.create({
    data: {
      title,
      photoURL,
      link,
      content,
    },
  });
  let deckId: number;
  let func: any;
  if (votingDeckId) {
    deckId = votingDeckId;
    func = client.votingDeck.update;
  } else if (customDeckId) {
    deckId = customDeckId;
    func = client.customDeck.update;
  } else {
    return null;
  }
  let dbParams = {
    where: {
      id: deckId,
    },
    data: {
      cards: {
        connect: {
          id: card.id,
        },
      },
    },
  };

  await func(dbParams);
  return card;
};

const makeMovieDeck =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const ALLOWED_SERVICES = [203, 157, 26, 387, 372, 371, 444, 389, 307];
    const userId = req.jwtBody?.userId;

    // Create a new Deck
    const { services, quantity, genres, title, friends } =
      req.body as MovieDeckCreationBody;

    // build url to request to api for list of titles
    const url = "https://api.watchmode.com/v1/";
    const tailParams =
      "sort_by=popularity_desc&limit=100&regions=US&types=movie";
    let servicesQuery = "";
    if (services) {
      for (let i = 0; i < services.length; i++) {
        if (ALLOWED_SERVICES.includes(services[i])) {
          servicesQuery += services[i] + ",";
        }
      }
    }
    let genresQuery = "";
    if (genres) {
      for (let i = 0; i < genres.length; i++) {
        if (genres[i] < 42 && genres[i] > 0) {
          genresQuery += genres[i] + ",";
        }
      }
    }

    // send request to api for list of titles
    let movieIds: number[] = [];
    await fetch(
      url +
        `list-titles/?apiKey=${process.env.WATCHMODE_API_KEY}${
          servicesQuery == "" ? "" : "&source_ids=" + servicesQuery
        }${genresQuery == "" ? "" : "&genres=" + genresQuery}` +
        tailParams,
      {
        method: "GET",
      }
    )
      .then((response) => response.json())
      .then((json) => {
        let movieIndeces: number[] = [];
        for (let i = 0; i < quantity; i++) {
          if (i >= json.titles.length) {
            break;
          }
          let index = Math.floor(Math.random() * json.titles.length);
          while (movieIndeces.includes(index)) {
            index = Math.floor(Math.random() * json.titles.length);
          }
          movieIndeces.push(index);
        }
        for (let i = 0; i < movieIndeces.length; i++) {
          movieIds.push(json.titles[movieIndeces[i]].id);
        }
      });
    if (movieIds.length < 1) {
      res.status(404).json({ message: "No movies found" });
      return;
    }

    const newDeck = await createNewVotingDeck({
      client,
      userId,
      type: "movie",
      title,
      friends,
    });
    if (!newDeck) {
      res.status(500).json({ message: "Internal Server Error" });
      await client.votingDeck.delete({
        where: {
          id: newDeck.id,
        },
      });
      return;
    }

    // get details for each movie
    let error = false;
    for (let i = 0; i < movieIds.length; i++) {
      if (error) {
        break;
      }
      let jsonMovieData = {} as MovieData;
      await fetch(
        url +
          `title/${movieIds[i]}/details/?apiKey=${process.env.WATCHMODE_API_KEY}`,
        {
          method: "GET",
        }
      )
        .then((response) => response.json())
        .then((json) => {
          jsonMovieData = json;
        })
        .catch((err) => {
          error = true;
        });
      const { title, year, us_rating, imdb_id, poster } = jsonMovieData;
      let content = "Year: " + year + "\nRating: " + us_rating;
      let link = "https://www.imdb.com/title/" + imdb_id;
      await addCardToDeck({
        client,
        title,
        content,
        votingDeckId: newDeck.id,
        photoURL: poster,
        link,
      });
    }
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
      return;
    }

    let newMovieDeck = await client.votingDeck.findFirst({
      where: {
        id: newDeck.id,
      },
      include: {
        users: true,
        cards: true,
      },
    });

    // create a deck of cards from the movie information
    res.json(newMovieDeck);
  };

const makeRestaurantDeck =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    const { zipcode, quantity, title, friends } =
      req.body as RestaurantDeckCreationBody;

    if (!zipcode) {
      res.status(404).json({ message: "No zipcode found" });
      return;
    }
    if (!quantity) {
      res.status(404).json({ message: "No quantity found" });
      return;
    }

    const geoUrl = `https://maps.google.com/maps/api/geocode/json?components=country:US|postal_code:${zipcode}&key=${process.env.GOOGLE_API_KEY}`;

    let lat = 0;
    let lng = 0;
    await fetch(geoUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        let location = json.results[0].geometry.location;
        lat = location.lat;
        lng = location.lng;
      });
    let foodUrl = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=restaurant&location=${lat},${lng}&radius=50000&key=${process.env.GOOGLE_API_KEY}`;
    let allRestaurants: RestaurantData[] = [];
    await fetch(foodUrl, {
      method: "GET",
    })
      .then((response) => response.json())
      .then((json) => {
        if (json.status === "OK") {
          let foodIndeces: number[] = [];
          for (let i = 0; i < quantity; i++) {
            if (i >= json.results.length) {
              break;
            }
            let index = Math.floor(Math.random() * json.results.length);
            while (foodIndeces.includes(index)) {
              index = Math.floor(Math.random() * json.results.length);
            }
            foodIndeces.push(index);
          }
          for (let i = 0; i < foodIndeces.length; i++) {
            allRestaurants.push(json.results[foodIndeces[i]]);
          }
        }
      });
    if (allRestaurants.length < 1) {
      res.status(404).json({ message: "No restaurants found" });
      return;
    }

    const newDeck = await createNewVotingDeck({
      client,
      userId,
      type: "restaurant",
      title,
      friends,
    });
    if (!newDeck) {
      res.status(404).json({ message: "Invalid Input" });
      return;
    }

    let error = false;
    for (let i = 0; i < allRestaurants.length; i++) {
      const { name, price_level, rating, user_ratings_total, vicinity } =
        allRestaurants[i];
      let title = name;
      let content =
        "Price Level: " +
        "$".repeat(price_level) +
        "\nRating: " +
        rating +
        " Stars\n" +
        "Number of Ratings: " +
        user_ratings_total +
        "\n" +
        "Address: " +
        vicinity;
      let card = await addCardToDeck({
        client,
        title,
        content,
        votingDeckId: newDeck.id,
      });
      if (!card) {
        error = true;
        break;
      }
    }
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
      await client.votingDeck.delete({
        where: {
          id: newDeck.id,
        },
      });
      return;
    }

    let newFoodDeck = await client.votingDeck.findFirst({
      where: {
        id: newDeck.id,
      },
      include: {
        users: true,
        cards: true,
      },
    });
    res.json(newFoodDeck);
  };

const makeVotingFromCustom =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    const { id, friends } = req.body as CustomStartBody;
    const customDeck = await client.customDeck.findFirst({
      where: {
        id,
        userId,
      },
      include: {
        cards: true,
      },
    });
    if (!customDeck) {
      res.status(404).json({ message: "Custom Deck not found" });
      return;
    }
    const newDeck = await createNewVotingDeck({
      client,
      userId,
      friends,
      type: "custom",
      title: customDeck.title,
    });
    if (!newDeck) {
      res.status(404).json({ message: "Invalid Input" });
      return;
    }
    let error = false;
    for (let i = 0; i < customDeck.cards.length; i++) {
      const { title, content } = customDeck.cards[i];
      let card = await addCardToDeck({
        client,
        title,
        content,
        votingDeckId: newDeck.id,
      });
      if (!card) {
        error = true;
        break;
      }
    }
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
      await client.votingDeck.delete({
        where: {
          id: newDeck.id,
        },
      });
      return;
    }
    let newCustomDeck = await client.votingDeck.findFirst({
        where: {
            id: newDeck.id,
        },
        include: {
            users: true,
            cards: true,
        },
    });
    res.json(newCustomDeck);
  };

const getDeckById =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const deckId = parseInt(req.params.id);
    const userId = req.jwtBody?.userId;
    const deck = await client.votingDeck.findFirst({
      where: {
        id: deckId,
      },
      include: {
        users: true,
        cards: true,
        votes: true,
      },
    });
    if (!deck) {
      res.status(404).json({ message: "Deck not found" });
      return;
    }
    if (deck.users.find((user) => user.id === userId)) {
      res.json(deck);
      return;
    }
    res.status(403).json({ message: "Forbidden" });
  };

const getHistory =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    const decks = await client.votingDeck.findMany({
      where: {
        finishedUsers: {
          some: {
            id: userId,
          },
        },
        status: "finished",
      },
      include: {
        users: true,
        cards: true,
      },
    });
    res.json(decks);
  };

const getMyIncompleteDecks =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    
    const decks = await client.votingDeck.findMany({
      where: {
        users: {
          some: {
            id: userId,
          },
        },
        finishedUsers: {
          none: {
            id: userId,
          },
        },
        status: "active",
      },
      include: {
        users: true,
        cards: true,
      },
    });
    res.json(decks);
  };

const getOtherIncompleteDecks =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    const decks = await client.votingDeck.findMany({
      where: {
        finishedUsers: {
          some: {
            id: userId,
          },
        },
        status: "active",
      },
      include: {
        users: true,
        cards: true,
      },
    });    
    res.json(decks);
  };

const makeCustomDeck =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const { cards, title, type } = req.body as CustomDeckProps;
    const userId = req.jwtBody?.userId;
    const newDeck = await client.customDeck.create({
      data: {
        title,
        type,
        user: { connect: { id: userId } },
      },
    });
    let error = false;
    for (let i = 0; i < cards.length; i++) {
      const card = await addCardToDeck({
        client,
        title: cards[i].title,
        content: cards[i].content,
        customDeckId: newDeck.id,
      });
      if (!card) {
        error = true;
        break;
      }
    }
    if (error) {
      res.status(500).json({ message: "Internal Server Error" });
      await client.customDeck.delete({
        where: {
          id: newDeck.id,
        },
      });
      return;
    }

    const deck = await client.customDeck.findUnique({
      where: {
        id: newDeck.id,
      },
      include: {
        cards: true,
      },
    });
    res.json({ deck });
  };

const getAllCustom =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const userId = req.jwtBody?.userId;
    const decks = await client.customDeck.findMany({
      where: {
        userId,
      },
      include: {
        cards: true,
      },
    });
    res.json(decks);
  };

export const decksController = controller("decks", [
  { path: "/movies", endpointBuilder: makeMovieDeck, method: "post" },
  { path: "/restaurants", endpointBuilder: makeRestaurantDeck, method: "post" },
  { path: "/:id", endpointBuilder: getDeckById, method: "get" },
  { path: "/history", endpointBuilder: getHistory, method: "get" },
  { path: "/waiting/me", endpointBuilder: getMyIncompleteDecks, method: "get" },
  {
    path: "/waiting/others",
    endpointBuilder: getOtherIncompleteDecks,
    method: "get",
  },
  { path: "/custom", endpointBuilder: makeCustomDeck, method: "post" },
  {
    path: "/custom/start",
    endpointBuilder: makeVotingFromCustom,
    method: "post",
  },
  { path: "/custom/all", endpointBuilder: getAllCustom, method: "get" },
]);
