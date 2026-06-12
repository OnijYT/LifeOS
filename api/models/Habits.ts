import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../db';

type HabitsAtributs = {
    id: string
    title: string
    emodji: string
    streak: number
    userId: string
}

type HabitsCreateAtributs = Optional<HabitsAtributs, 'id' | 'emodji' | 'streak'>

export class Habit extends Model<HabitsAtributs, HabitsCreateAtributs>{
    declare id: string
    declare title: string
    declare userId: string
    declare emodji: string
    declare streak: number

    declare readonly createdAt: Date
    declare readonly updatedAt: Date
}

Habit.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
    },
    
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },

    emodji: {
        type: DataTypes.STRING,
        defaultValue: '📂'
    },

    streak: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    },

    userId: {
        type: DataTypes.UUID,
        allowNull: false
    },
},{
    sequelize,
    tableName: 'habits',
})