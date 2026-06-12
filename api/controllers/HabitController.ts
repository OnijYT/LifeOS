import { Response } from "express";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { Habit } from "../models/Habits";
import { HabitLog } from "../models/HabitsLog";

export const CreateHabit = async (req: AuthRequest, res: Response) => {
    try {
        const {title, emodji} = req.body
        const userId = req.user?.id

        if(!userId) {
            return res
                .status(401)
                .json({message: 'Пользователь не авторизован'})
        }

        if(!title || !emodji) {
            return res
                .status(400)
                .json({message: 'Все поля должны быть заполнены'})
        }

        const newhabit = await Habit.create({
            title,
            userId,
            emodji,
        })
        return res
            .status(201).json(newhabit)
    } catch (err){
        console.error(err);
        return res
        .status(500)
        .json({message: 'Ошибка, что-то пошло не так'})
    }
}

export const GetHabits = async (req: AuthRequest, res: Response) => {
    try {
        const userId = req.user?.id

        if(!userId) {
            return res
                .status(401)
                .json({message: 'Пользователь не авторизован'})
        }

        const habits = await Habit.findAll({
            where: {userId},
            include: [{model: HabitLog, as: 'log', attributes: ['date'] }],
            order: ['createdAt', 'ASC']
        })
        return res
            .status(200).json(habits)
    } catch (err){
        console.error(err);
        return res
        .status(500)
        .json({message: 'Ошибка, что-то пошло не так'})
    }
}

export const checkhabitday = async (req: AuthRequest, res: Response) => {
    
}