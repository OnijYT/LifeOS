import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../db';

type HabitsAtributs = {
    id: string
    title: string
    userId: string
}

type HabitsCreateAtributs = Optional<HabitsAtributs, 'id'>

class Habit extends Model<HabitsAtributs, HabitsCreateAtributs>{
    declare id: string;
    declare title: string;
    declare userId: string
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

    userId: {
        type: DataTypes.UUID,
        allowNull: false
    }
},{
    sequelize,
    tableName: 'habits',
})