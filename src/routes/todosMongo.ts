// src/routes/todosMongo.ts (ตัวอย่าง GET ทั้งหมด)
import { Router, Request, Response } from 'express';
import Todo from '../models/Todo';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ message: error });
  }
});

export default router;
