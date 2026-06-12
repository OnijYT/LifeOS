import { Router } from "express";
import { AuthMiddleware } from "../../middleware/AuthMiddleware";
import { CreateHabit, GetHabits } from "../../controllers/HabitController";


const router = Router()

router.post('/create-habit', AuthMiddleware, CreateHabit)
router.get('/my-habits', AuthMiddleware, GetHabits)

export default router