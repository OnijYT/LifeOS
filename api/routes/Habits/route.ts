import { Router } from "express";
import { AuthMiddleware } from "../../middleware/AuthMiddleware";
import { CreateHabit, GetHabits, checkhabitday, deletehabit } from "../../controllers/HabitController";

const router = Router()

router.post('/create-habit', AuthMiddleware, CreateHabit)
router.get('/my-habits', AuthMiddleware, GetHabits)
router.post('/check-habit-day/:id', AuthMiddleware, checkhabitday)
router.delete('/delete-habit/:id', AuthMiddleware, deletehabit)

export default router
