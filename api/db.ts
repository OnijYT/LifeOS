import dotenv from 'dotenv'
import {Sequelize} from 'sequelize'

dotenv.config()

const sequelize = new Sequelize(
  process.env.DB_NAME || 'LifeOS',      // Имя базы данных
  process.env.DB_USER || 'postgres',    // Имя пользователя (у тебя это postgres)
  process.env.DB_PASSWORD,              // Пароль (Asadbek070)
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'postgres',
    logging: false, // Чтобы не забивать консоль лишними логами SQL-запросов
  }
);

export default sequelize