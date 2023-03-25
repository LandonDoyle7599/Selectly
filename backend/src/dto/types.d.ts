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

export type ServiceID = {
    id: 203 | 157 | 26 | 387 | 372 | 371 | 444 | 389 | 307
}

export type MovieDeckCreationBody = {
    services: ServiceID[]
    quantity: number
    genres: number[]
}
