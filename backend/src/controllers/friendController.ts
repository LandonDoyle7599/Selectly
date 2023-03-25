import { PrismaClient } from '@prisma/client'
import { RequestHandler } from 'express'
import { RequestWithJWTBody, FriendRequestBody, FriendRequestReponseBody } from '../dto/types'
import { controller } from '../lib/controller'

const seeFriends =
    (client: PrismaClient): RequestHandler =>
        async (req: RequestWithJWTBody, res) => {
            const userId = req.jwtBody?.userId
            const user = await client.user.findFirst({
                where: {
                    id: userId
                },
            })
            const friends = user?.friends;
        }

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
            const reverseRequest = await client.friendRequest.findFirst({
                where: {
                    senderId: friend?.id,
                    receiverId: userId,
                    status: "pending"
                }
            })
            // If the other person has already sent the current user a request, accept it
            if (reverseRequest) {
                makeFriends(userId, friend?.id, client)
                await client.friendRequest.findFirst({
                    where: {
                        senderId: friend?.id,
                        receiverId: userId,
                        status: "accepted"
                    }
                })
                res.json({})
            } else {
                //Don't allow a user to send a friend request to themselves or make repeat requests
                const friendRequests = await client.friendRequest.findMany({
                    where: { 
                        senderId: userId,
                        receiverId: friend?.id,
                        status: "pending" || "accepted"
                    }
                })
    
                if (friendRequests.length > 0) {
                    res.status(404).json({ message: "You have already sent a friend request to this user. Please wait for them to respond." })
                    return
                }
    
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
                },
                include: {
                    receiver: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            })

            res.json({ friendRequests })
        }

const incomingRequests =
    (client: PrismaClient): RequestHandler =>
        async (req: RequestWithJWTBody, res) => {
            const userId = req.jwtBody?.userId

            const friendRequests = await client.friendRequest.findMany({
                where: {
                    receiver: {
                        id: userId
                    }
                },
                include: {
                    sender: {
                        select: {
                            firstName: true,
                            lastName: true,
                            email: true
                        }
                    }
                }
            })

            res.json({ friendRequests })
        }

const respondToRequest =
    (client: PrismaClient): RequestHandler =>
        async (req: RequestWithJWTBody, res) => {
            const userId = req.jwtBody?.userId
            const { friendRequestId, response } = req.body as FriendRequestReponseBody
            const friendRequest = await client.friendRequest.update({
                where: {
                    id: friendRequestId,
                },
                data: {
                    status: response
                }
            })
            if (response === "accepted" && friendRequest) {
                const friendId = friendRequest.senderId;
                makeFriends(userId, friendId, client)              
            }
            res.json({ friendRequest })
        }

const unfriend =
    (client: PrismaClient): RequestHandler =>
        async (req: RequestWithJWTBody, res) => {
        }

async function makeFriends(userId: number | undefined, friendId: number | undefined, client: PrismaClient) {
    await client.user.update({
        where: {
            id: userId
        },
        data: {
            friends: {
                connect: { id: friendId }
            },
            friendsOf: {
                connect: { id: friendId }
            },
        }
    })
    await client.user.update({
        where: {
            id: friendId
        },
        data: {
            friends: {
                connect: { id: userId }
            },
            friendsOf: {
                connect: { id: userId }
            },
        }
    })

}

export const friendController = controller('friends', [
    { path: '/', endpointBuilder: seeFriends, method: 'get'},
    { path: '/invite', endpointBuilder: addFriend, method: 'post' },
    { path: '/outgoing', endpointBuilder: outgoingRequests, method: 'get' },
    { path: '/incoming', endpointBuilder: incomingRequests, method: 'get' },
    { path: '/respond', endpointBuilder: respondToRequest, method: 'post' },
    { path: '/unfriend', endpointBuilder: unfriend, method: 'post' },
])