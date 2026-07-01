import { create } from "zustand";

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  status: "todo" | "in_progress" | "completed";
}

export interface Note {
  id: string;
  title: string;
  content: string;
  isPinned: boolean;
  lastModified: string;
}

interface WorkspaceState {
  tasks: Task[];
  notes: Note[];
  addTask: (text: string) => void;
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
  updateTaskStatus: (id: string, status: Task["status"]) => void;
  addNote: (title: string, content: string) => void;
  updateNote: (id: string, title: string, content: string) => void;
  togglePinNote: (id: string) => void;
  deleteNote: (id: string) => void;
}

export const useWorkspaceStore = create<WorkspaceState>((set) => ({
  tasks: [
    { id: "task-1", text: "Buy spicy tempeh for dinner", completed: false, status: "todo" },
    { id: "task-2", text: "Review Andi's illustration designs", completed: true, status: "completed" },
    { id: "task-3", text: "Configure merchant inventory keys", completed: false, status: "in_progress" }
  ],
  notes: [
    {
      id: "note-1",
      title: "NusaHub MVP Notes",
      content: "# NusaHub Super-App Plan\n\nWe are building a unified app integrating commerce and chat using a warm minimalist theme in Indonesia.\n\n- Primary color: Pandan Green\n- Secondary color: Terracotta Accent",
      isPinned: true,
      lastModified: "01/07/2026, 09:30"
    },
    {
      id: "note-2",
      title: " MSME Suppliers List",
      content: "### Bandung Food Suppliers\n\n1. Ibu Sri - Keripik Tempe, Brownies\n2. Toko Dago - Telur, Beras, Minyak",
      isPinned: false,
      lastModified: "30/06/2026, 17:15"
    }
  ],
  addTask: (text) => set((state) => ({
    tasks: [...state.tasks, { id: `task-${Date.now()}`, text, completed: false, status: "todo" }]
  })),
  toggleTask: (id) => set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === id
        ? {
            ...t,
            completed: !t.completed,
            status: !t.completed ? "completed" : "todo"
          }
        : t
    )
  })),
  updateTaskStatus: (id, status) => set((state) => ({
    tasks: state.tasks.map((t) =>
      t.id === id ? { ...t, status, completed: status === "completed" } : t
    )
  })),
  deleteTask: (id) => set((state) => ({
    tasks: state.tasks.filter((t) => t.id !== id)
  })),
  addNote: (title, content) => set((state) => ({
    notes: [
      {
        id: `note-${Date.now()}`,
        title,
        content,
        isPinned: false,
        lastModified: new Date().toLocaleString("id-ID")
      },
      ...state.notes
    ]
  })),
  updateNote: (id, title, content) => set((state) => ({
    notes: state.notes.map((n) =>
      n.id === id
        ? { ...n, title, content, lastModified: new Date().toLocaleString("id-ID") }
        : n
    )
  })),
  togglePinNote: (id) => set((state) => ({
    notes: state.notes.map((n) => n.id === id ? { ...n, isPinned: !n.isPinned } : n)
  })),
  deleteNote: (id) => set((state) => ({
    notes: state.notes.filter((n) => n.id !== id)
  }))
}));
