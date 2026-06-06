import {DataTypes, Model, Optional} from 'sequelize'
import sequelize from '../db'

type UserAttributes = {
    id: string
    username: string
    email: string
    password: string
}

type UserCreateAtributs = Optional<UserAttributes, 'id'>

export class User extends Model<UserAttributes, UserCreateAtributs> {
    declare id: string
    declare username: string
    declare email: string
    declare password: string

    declare readonly createdAt: Date
    declare readonly updateAt: Date
}

User.init({
    id: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        validate: {
            isEmail: true
        },
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    tableName: 'users'
})