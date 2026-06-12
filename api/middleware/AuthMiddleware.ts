import { NextFunction, Request, Response } from "express"
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request{
    user?: {
        id: string
        email: string
    }
}

export const AuthMiddleware = async (req: AuthRequest, res: Response, next: NextFunction) => {
    const authheader = req.headers.authorization

    if (!authheader || !authheader.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({message: 'Доступ запрещен. Нету Токена'})
    }
    const token = authheader.split(' ')[1]

    try {
        const decoded = jwt.verify(token, 'secret_keys_from_asadbek_hihi') as {id: string, email: string}
        req.user = {
            id: decoded.id,
            email: decoded.email
        }

        next()
    } catch(err) {
        return res
            .status(401)
            .json({message: 'токен просрочен или неверный'})
    }
}