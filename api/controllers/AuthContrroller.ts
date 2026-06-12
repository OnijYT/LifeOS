import { Response, Request } from "express";
import { User } from "../models/User";
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const Register = async(req: Request, res: Response) => {
    try {
        const {email, username, password} = req.body
        if(!email || !username || !password) {
            return res
                .status(400)
                .json({message: 'все поля должны быть заполнены!!'})
        }

        const testusername = await User.findOne({where: {username}})
        if(testusername) {
            return res
                .status(400)
                .json({message: 'такой имя уже сушествует'})
        }

        const testemail = await User.findOne({where: {email}})
        if(testemail) {
            return res
                .status(400)
                .json({message: 'такой email уже сушествует'})
        }

        const hashedpassword = await bcrypt.hash(password, 10)

        const user = await User.create({
            email,
            password: hashedpassword,
            username,
        });

        const token = jwt.sign(
            {id: user.id},
            'secret_keys_from_asadbek_hihi',
            {expiresIn: '24h'}
        )

        return res
        .status(201)
        .json({ 
            message: 'Регистрация прошла успешно', 
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
            }
        })
        
    } catch (err) {
        console.error(err);
        return res
        .status(500)
        .json({message: 'Ошибка что-то пошло не так. Попробуйте снова'})
    }
}

export const Login = async (req: Request, res: Response) => {
    try {
        const {email, password} = req.body
        if(!email || !password) {
            return res
                .status(400)
                .json({message: 'Заполниет все поля'})
        }

        const testemail = await User.findOne({where: {email}})
        if(!testemail) {
            return res
                .status(401)
                .json({message: 'Неверный email или пароль'})
        }

        const correctpassword = await bcrypt.compare(password, testemail.password)
        if(!correctpassword) {
            return res
                .status(401)
                .json({message: 'Неверный email или пароль'})
        }

        const token = jwt.sign(
            {id: testemail.id},
            'secret_keys_from_asadbek_hihi',
            {expiresIn: '24h'}
        )

        return res
            .status(200)
            .json({
                message: 'Все прошла успешно',
                token,
                user: {
                    id: testemail.id,
                    email: testemail.email,
                    username: testemail.username
                }
            })

    } catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({message: 'Ошибка что-то пошло не так. Попробуйте снова'})
    }
}