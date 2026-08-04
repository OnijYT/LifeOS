import { Response } from "express";
import { AuthRequest } from "../middleware/AuthMiddleware";
import { Habit } from "../models/Habits";
import { HabitLog } from "../models/HabitsLog";
import sequelize from "../db";

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
            order: [['createdAt', 'ASC']]
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
    const id = req.params.id as string
    const {targetDate} = req.body
    const userId = req.user?.id

    if(!targetDate || !/^\d{4}-\d{2}-\d{2}$/.test(targetDate)) {
        return res
            .status(400)
            .json({message: 'Дата обязательна и должна быть в формате YYYY-MM-DD'})
    }

    const transaction = await sequelize.transaction()

    try {
        const item = await Habit.findOne({ where: { id, userId }, transaction })

        if(!item) {
            await transaction.rollback()
            return res
                .status(404)
                .json({message: 'Привычка не найдена'})
        }

        const existingLog = await HabitLog.findOne({
            where: {habitId: id, date: targetDate},
            transaction
        })

        if(existingLog) {
            await existingLog.destroy({ transaction })
        } else {
            await HabitLog.create({
                habitId: id,
                date: targetDate,
            }, { transaction })
        }

        const allLogs = await HabitLog.findAll({
            where: {habitId: id},
            attributes: ['date'],
            order: [['date', 'ASC']],
            transaction
        })

        if (allLogs.length === 0) {
            item.streak = 0
            await item.save({ transaction })
            await transaction.commit()
            return res.status(200)
                .json({
                    message: 'Успешно',
                    streak: 0
                })
        }

        const dateStrs = allLogs.map(l => l.date)

        const today = new Date()
        const todayStr = String(today.getFullYear()).padStart(4, '0') +
            '-' + String(today.getMonth() + 1).padStart(2, '0') +
            '-' + String(today.getDate()).padStart(2, '0')

        const mostRecentDate = dateStrs[dateStrs.length - 1]
        const mostRecentParts = mostRecentDate.split('-').map(Number)
        const mostRecentLocal = new Date(mostRecentParts[0], mostRecentParts[1] - 1, mostRecentParts[2])
        const todayLocal = new Date(today.getFullYear(), today.getMonth(), today.getDate())
        const msPerDay = 1000 * 60 * 60 * 24
        const daysSinceLastLog = Math.round((todayLocal.getTime() - mostRecentLocal.getTime()) / msPerDay)

        let activeStreak = 0
        if (daysSinceLastLog === 0 || daysSinceLastLog === 1) {
            activeStreak = 1
            for (let i = dateStrs.length - 1; i > 0; i--) {
                const currParts = dateStrs[i].split('-').map(Number)
                const prevParts = dateStrs[i - 1].split('-').map(Number)
                const currLocal = new Date(currParts[0], currParts[1] - 1, currParts[2])
                const prevLocal = new Date(prevParts[0], prevParts[1] - 1, prevParts[2])
                const diff = Math.round((currLocal.getTime() - prevLocal.getTime()) / msPerDay)
                if (diff === 1) {
                    activeStreak++
                } else {
                    break
                }
            }
        }

        item.streak = activeStreak
        await item.save({transaction})

        await transaction.commit()

        return res.status(200)
            .json({
                message: 'Успешно',
                streak: item.streak
            })
    } catch (err) {
        await transaction.rollback()
        return res
            .status(500)
            .json({message: 'Ошибка сервера'})
    }
}

export const deletehabit = async (req: AuthRequest, res: Response) => {
    try {
        const {id} = req.params
        const userId = req.user?.id

        const remove = await Habit.destroy({where: {userId, id}})

        if(remove === 0) {
            return res
                .status(404)
                .json({message: 'Не найдено привычка'})
        }

        return res
            .status(200)
            .json({message: 'Удалено'})
    } catch (err) {
        return res
            .status(500)
            .json({message: 'ошибка сервера'})
    }
}
