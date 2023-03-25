import { PrismaClient } from '@prisma/client'
import { json, RequestHandler } from 'express'
import { MovieDeckCreationBody, RequestWithJWTBody } from '../dto/types'
import { controller } from '../lib/controller'

const makeMovieDeck = 
    (client: PrismaClient): RequestHandler => 
    async (req : RequestWithJWTBody, res) => {
        const { services, quantity, genres } = req.body as MovieDeckCreationBody
        // make request to api for sources
        const url = "https://api.watchmode.com/v1/"
        const tailParams = "sort_by=popularity_desc&limit=100&regions=US&types=movie"
        let servicesQuery = "";
        for (let i = 0; i < services.length; i++) {
            servicesQuery += services[i].id + ","
        }
        let genresQuery = "";
        for (let i = 0; i < genres.length; i++) {
            if (genres[i] < 42 && genres[i] > 0){
                genresQuery += genres[i] + ","
            }
        }
        fetch(url + `list-titles/?apiKey=${process.env.WATCHMODE_API_KEY}${servicesQuery == "" ? "" : "&source_ids="+servicesQuery}${genresQuery == "" ? "" : "&genres="+genresQuery}` + tailParams, {
            method : 'GET'
        })
        .then(response => response.json())
        .then((json) => {
            res.json(json)
        });

        
        // get list of source ids that match the request services
        // make request to api for movies that match the source ids, and other request parameters
        // create a deck of cards from the movie information
    }

export const decksController = controller('decks', [
    { path: '/movies', endpointBuilder: makeMovieDeck, method: 'post' },
])