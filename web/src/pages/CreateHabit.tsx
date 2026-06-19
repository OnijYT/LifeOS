import { useForm } from "react-hook-form"
import { HabitForm } from "../interfaces"
import axios from "axios"
import { api } from "../api"
import { useNavigate } from "react-router-dom"




function CreateHabit () {
    const {handleSubmit, register, reset} = useForm<HabitForm>()
    const navigate = useNavigate()

    const habidleSubmitHabit = (data: HabitForm) => {
        try {
            await api.post('/api/habits/create-habit', data)
            reset()
            navigate('/')
        } catch (err) {
            console.error(err)
            if(axios.isAxiosError(err)){
                return alert(err.response?.data?.message || 'Error')
            }
        }
    }

    return (

    )
}

export default CreateHabit