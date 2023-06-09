import express from 'express'
import { PrismaClient } from '@prisma/client'
import dotenv from 'dotenv'
import cors from "cors";
import { usersController } from './controllers/usersController';
import { friendController } from './controllers/friendController';

dotenv.config()
const client = new PrismaClient()
const app = express()

app.use(express.json())
app.use(cors())

usersController(app, client)
friendController(app, client)

app.get('/', (req, res) => {
    res.send(`<h1>Hello, world!</h1>`)
})

app.listen(parseInt(process.env.PORT || '3000', 10), () => {
    console.log(`App running on port ${process.env.PORT}`)
})

export default app