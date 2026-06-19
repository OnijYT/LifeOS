export interface User {
    id: string
    email: string
    username: string
}

export interface LoginForm {
    email: string
    password: string
    rememberMe?: boolean
}

export interface registerForm {
    email: string
    password: string
    username: string
    rememberMe?: boolean
}

export interface ApiResponse<T> {
    user: T,
    token: string
    message?: string
}

// interface Habit

export interface HabitForm {
    title: string
    emodji: string
}