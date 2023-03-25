import { PrismaClient } from '@prisma/client'
import { RequestHandler } from 'express'
import { RequestWithJWTBody } from '../dto/types'
import { controller } from '../lib/controller'

const getMovieList = 
    (client: PrismaClient): RequestHandler => 
    async (req : RequestWithJWTBody, res) => {


    }
