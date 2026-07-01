import { create } from "zustand";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
}

interface WorkspaceState {
  tasks: Task[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  tasks: [
    { id: "task-1", text: "Buy spicy tempeh for dinner", completed: false },
    { id: "task-2", text: "Review Andi's illustration designs", completed: true },
  ],
  addTask: (text) => set((state) => ({
    tasks: [...state.tasks, { id: `task-${Date.now()}`, text, completed: false }]
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((t) => t.id === id ? { ...t, completed: !t.completed } : t)
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
}));
