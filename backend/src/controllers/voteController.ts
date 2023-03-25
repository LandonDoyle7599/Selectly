import { Card, PrismaClient } from "@prisma/client";
import { RequestHandler } from "express";
import { MovieData, MovieDeckCreationBody } from "../dto/movieDeckTypes";
import { RequestWithJWTBody } from "../dto/types";
import { controller } from "../lib/controller";

const makeMovieDeck =
  (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {

    const userId = req.jwtBody?.userId;
  };

export const decksController = controller("vote", [
  { path: "/", endpointBuilder: makeMovieDeck, method: "post" },
]);
