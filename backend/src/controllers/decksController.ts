import { Card, PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { MovieData, MovieDeckCreationBody } from "../dto/movieDeckTypes";
import { RequestWithJWTBody } from "../dto/types";
import { controller } from "../lib/controller";

const makeMovieDeck =
  (client: PrismaClient): RequestHandler =>
  async (req: RequestWithJWTBody, res) => {
    const ALLOWED_SERVICES = [203, 157, 26, 387, 372, 371, 444, 389, 307];

    const userId = req.jwtBody?.userId;

    // Create a new Deck
    const { services, quantity, genres, title, friends } =
      req.body as MovieDeckCreationBody;
    const movieDeck = await client.votingDeck.create({
      data: {
        status: "in progress",
        title,
        type: "movie",
        users: { connect: { id: userId } },
      },
    });
    for (let i = 0; i < friends.length; i++) {
      await client.votingDeck.update({
        where: {
          id: movieDeck.id,
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
        if (movieIndeces.length === 0) {
          res.status(400).json({ message: "No movies found" });
          return;
        }
        for (let i = 0; i < movieIndeces.length; i++) {
          movieIds.push(json.titles[movieIndeces[i]].id);
        }
      });

    // get details for each movie
    const movieCards: Card[] = [];
    for (let i = 0; i < movieIds.length; i++) {
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
        });
        const { title, year, us_rating, imdb_id, poster } = jsonMovieData;
        const movie = await client.card.create({
            data: {
                title,
                photoURL: poster,
                link: "https://www.imdb.com/title/" + imdb_id,
                content: "Year: " + year + " Rating: " + us_rating,
            },
        });
        movieCards.push(movie);
    }

    for (let i = 0; i < movieCards.length; i++) {
        await client.votingDeck.update({
          where: {
            id: movieDeck.id,
          },
          data: {
            cards: {
              connect: {
                id: movieCards[i].id,
              },
            },
          },
        });
      }

    let newMovieDeck = await client.votingDeck.findFirst({
        where: {
            id: movieDeck.id,
        },
        include: {
            users: true,
            cards: true,
        },
    });

      // create a deck of cards from the movie information
    res.json({ newMovieDeck });
  };

export const decksController = controller("decks", [
  { path: "/movies", endpointBuilder: makeMovieDeck, method: "post" },
]);
