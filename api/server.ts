import dotenv from 'dotenv'
import sequelize from './db'
import express from 'express'
import cors from 'cors'
import Auth from './routes/Auth/route'
import HabitRoute from './routes/Habits/route'
import { User } from './models/User'
import { Habit } from './models/Habits'
import { HabitLog } from './models/HabitsLog'

// settings
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// app

app.use('/api/auth', Auth)
app.use('/api/habits', HabitRoute)


// settings

User.hasMany(Habit, {foreignKey: 'userId', as: 'habits'})
Habit.belongsTo(User, { foreignKey: 'userId' })

Habit.hasMany(HabitLog, {foreignKey: 'habitId', as: 'log', onDelete: 'CASCADE'})
HabitLog.belongsTo(Habit, {foreignKey: 'habitId'})

const start = async (): Promise<void> => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        app.listen(5000, () => console.log('server ok'))
    } catch (err) {
        console.error(err)
    }
}

start()