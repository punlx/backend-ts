import { Router, Request, Response, NextFunction } from 'express';
import prisma from '../lib/prisma';
import { authMiddleware } from '../middleware/authMiddleware';

const router = Router();

// Get all todos
router.get('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const todos = await prisma.todo.findMany();
    res.json(todos);
  } catch (error) {
    next(error);
  }
});

// Get single todo
router.get('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const todo = await prisma.todo.findUnique({
      where: { id },
    });

    if (!todo) {
      res.status(404);
      throw new Error('Todo not found');
    }

    res.json(todo);
  } catch (error) {
    next(error);
  }
});

// Create new todo
router.post('/', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { task } = req.body;
    const newTodo = await prisma.todo.create({
      data: {
        task,
        completed: false,
      },
    });

    res.status(201).json(newTodo);
  } catch (error) {
    next(error);
  }
});

// Update todo
router.put('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const { task, completed } = req.body;

    const todo = await prisma.todo.update({
      where: { id },
      data: { task, completed },
    });

    res.json(todo);
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      next(error);
    }
  }
});

// Delete todo
router.delete('/:id', authMiddleware, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    await prisma.todo.delete({
      where: { id },
    });

    res.status(204).end();
  } catch (error: any) {
    if (error.code === 'P2025') {
      res.status(404).json({ message: 'Todo not found' });
    } else {
      next(error);
    }
  }
});

export default router;
