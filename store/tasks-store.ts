"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Task = {
  id: string;
  projectName: string;
  title: string;
  status: "Todo" | "In Progress" | "Done";
};

type TasksState = {
  tasks: Task[];
  addTask: (task: Task) => void;
  updateTask: (id: string, updated: Partial<Task>) => void;
  bulkUpdateTasks: (ids: string[], updated: Partial<Task>) => void;
};

export const useTasksStore = create(
  persist<TasksState>(
    (set, get) => ({
      tasks: [
        { id: "1", projectName: "Project A", title: "Task 1", status: "Todo" },
        { id: "2", projectName: "Project A", title: "Task 2", status: "In Progress" },
        { id: "3", projectName: "Project B", title: "Task 1", status: "Done" },
      ],
      addTask: (task) => set({ tasks: [...get().tasks, task] }),
      updateTask: (id, updated) =>
        set({
          tasks: get().tasks.map((t) => (t.id === id ? { ...t, ...updated } : t)),
        }),
      bulkUpdateTasks: (ids, updated) =>
        set({
          tasks: get().tasks.map((t) => (ids.includes(t.id) ? { ...t, ...updated } : t)),
        }),
    }),
    {
      name: "tasks-storage",
    }
  )
);
