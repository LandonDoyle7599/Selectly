import { RequestHandler } from 'express'
import { RequestWithJWTBody, JWTBody } from '../dto/types'
import jwt from 'jsonwebtoken'

export const authenticationMiddleware: RequestHandler = async (
    req: RequestWithJWTBody,
    res,
    next,
) => {
    const token = req.headers.authorization
    try {
        const jwtBody = jwt.verify(
            token || '',
            process.env.ENCRYPTION_KEY!,
        ) as JWTBody
        req.jwtBody = jwtBody
    } catch (error) {
        console.log('token failed validation')
    } finally {
        if (!req.jwtBody) {
            res.status(401).json({ message: 'Unauthorized' })
        } else {
            next()
        }
    }
}
