import { Schema, model } from 'mongoose';

interface ITodo {
  task: string;
  completed: boolean;
  createdAt: Date;
}

const todoSchema = new Schema<ITodo>({
  task: { type: String, required: true },
  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const Todo = model<ITodo>('Todo', todoSchema);

export default Todo;
