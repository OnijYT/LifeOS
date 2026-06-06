import { Response, Request } from "express";

export const CreateHabit = async (req: Request, res: Response) => {
    try {
        const {title} = req.body
        

    } catch (err){
        console.error(err);
        return res
        .status(500)
        .json({message: 'Ошибка, что-то пошло не так'})
    }
}