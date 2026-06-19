import { createContext, use, useContext, useEffect, useState, type ReactNode } from "react";
import { User } from "../interfaces";

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    login: (token: string, UserData: User) => void
    logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthContextProvider = ({children}: {children: ReactNode}) => {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    useEffect(() => {
        const savedToken = localStorage.getItem('token')
        const savedUser = localStorage.getItem('user')

        if(savedToken && savedUser) {
            setToken(savedToken)
            setUser(JSON.parse(savedUser))
        }
        setIsLoading(false)
    }, [])

    const login = (newToken: string, UserData: User) => {
        setToken(newToken)
        setUser(UserData)
        localStorage.setItem('token', newToken)
        localStorage.setItem('user', JSON.stringify(UserData))
    }

    const logout = () => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }


    return(
        <AuthContext.Provider value={{ login, logout, user, token, isLoading}}>
            {children}
        </AuthContext.Provider>
    )
} 

export const useAuthContext = () => {
    const context = useContext(AuthContext) 

    if(context === undefined){
        throw new Error('useAuthContext должен использоваться строго внутри AuthContextProvider')
    }

    return context
}