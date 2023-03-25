import { Request } from 'express'

export type JWTBody = {
    userId: number
}

export type RequestWithJWTBody = Request & {
    jwtBody?: JWTBody
}

export type LoginBody = {
    email: string
    password: string
}

export type CreateUserBody = {
    firstName: string
    lastName: string
    email: string
    password: string
}

export type FriendRequestBody = {
    friendEmail: string
}