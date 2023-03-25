import { PrismaClient } from '@prisma/client'
import { RequestHandler } from 'express'
import { RequestWithJWTBody, FriendRequestBody } from '../dto/types'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { controller } from '../lib/controller'

const addFriend =
    (client: PrismaClient): RequestHandler =>
        async (req: RequestWithJWTBody, res) => {
            const { friendEmail } =
                req.body as FriendRequestBody

            const userId = req.jwtBody?.userId

            const friend = await client.user.findFirst({
                where: {
                    email: friendEmail
                }
            })

            if (!friend || friend.id === userId) {
                res.status(404).json({ message: "Friend's email not found. Please verify the email is correct and your friend has an account with us." })
                return
            }
            const friendRequest = await client.friendRequest.create({
                data: {
                    status: "pending",
                    sender: {
                        connect: { id: userId }
                    },
                    receiver: {
                        connect: { id: friend.id }
                    }
                }
            })

            res.json({ friendRequest })
        }

const outgoingRequests =
    (client: PrismaClient): RequestHandler =>
        async (req: RequestWithJWTBody, res) => {
            const userId = req.jwtBody?.userId

            const friendRequests = await client.friendRequest.findMany({
                where: {
                    sender: {
                        id: userId
                    }
                }
            })

            res.json({ friendRequests })
        }


export const friendController = controller('friends', [
    { path: '/invite', endpointBuilder: addFriend, method: 'post' },
    { path: '/outgoing', endpointBuilder: outgoingRequests, method: 'get' },
    { path: '/incoming', endpointBuilder: addFriend, method: 'get' },
])