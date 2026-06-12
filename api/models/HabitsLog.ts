import { DataTypes, Model, Optional } from "sequelize"
import sequelize from "../db"

type HabitLogAtributes = {
    id: string
    habitId: string
    date: string
}

type HabitLogCreateAtributes = Optional<HabitLogAtributes, 'id'>

export class HabitLog extends Model<HabitLogAtributes, HabitLogCreateAtributes> {
    declare id: string
    declare habitId: string
    declare date: string
}

HabitLog.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    habitId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    date: {
        type: DataTypes.STRING(10),
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'habit_log',
    indexes: [{unique: true, fields: ['habitId', 'date'] }]
})