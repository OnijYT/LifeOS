import dotenv from 'dotenv'
import sequelize from './db'
import express from 'express'
import cors from 'cors'

// settings
dotenv.config()

const app = express()
app.use(cors())
app.use(express.json())

// app




// settings
const start = async (): Promise<void> => {
    try {
        await sequelize.authenticate()
        await sequelize.sync({ alter: true })
        app.listen(5000, () => console.log('server ok'))
    } catch (err) {
        console.error(err)
    }
}
