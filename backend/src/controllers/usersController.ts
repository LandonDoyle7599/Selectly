import { PrismaClient } from '@prisma/client'
import { RequestHandler } from 'express'
import { RequestWithJWTBody, LoginBody, CreateUserBody, UpdateUserBody } from '../dto/types'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { controller } from '../lib/controller'

const createUser =
    (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const { firstName, lastName, email, password } =
            req.body as CreateUserBody

        const existingUser = await client.user.findFirst({
            where: {
                email,
            },
        })

        if (existingUser) {
            // maybe there is a better response for this
            res.status(400).json({ message: 'Email already exists' })
            return
        }

        const passwordHash = await bcrypt.hash(password, 10)
        const user = await client.user.create({
            data: {
                firstName,
                lastName,
                email,
                passwordHash,
            },
        })
        if (process.env.ENCRYPTION_KEY) {
            const token = jwt.sign(
                {
                    userId: user.id,
                },
                process.env.ENCRYPTION_KEY,
                {
                    expiresIn: '7d',
                },
            )

            res.json({ user, token })
        }
    }

const updateUser =
    (client: PrismaClient): RequestHandler =>
        async (req, res) => {
            const { firstName, lastName, email, password } = req.body as UpdateUserBody
            // const userId = req.jwtBody?.userId
        }

const login =
    (client: PrismaClient): RequestHandler =>
    async (req, res) => {
        const { email, password } = req.body as LoginBody
        const user = await client.user.findFirst({
            where: {
                email: email.toLowerCase(),
            },
        })
        if (!user) {
            res.status(404).json({ message: 'Invalid email or password' })
            return
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
            res.status(404).json({ message: 'Invalid email or password' })
            return
        }

        const token = jwt.sign(
            {
                userId: user.id,
            },
            process.env.ENCRYPTION_KEY!,
            {
                expiresIn: '7d',
            },
        )

        res.json({
            user,
            token,
        })
    }

const getMe =
    (client: PrismaClient): RequestHandler =>
    async (req: RequestWithJWTBody, res) => {
        const userId = req.jwtBody?.userId

        const user = await client.user.findFirst({
            where: {
                id: userId,
            },
        })

        res.json({ user })
    }


export const usersController = controller('users', [
    { path: '/me', endpointBuilder: getMe, method: 'get' },
    { path: '/', method: 'post', endpointBuilder: createUser, skipAuth: true },
    { path: '/login', method: 'post', endpointBuilder: login, skipAuth: true },
])