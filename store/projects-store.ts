"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Task = {
  id: number;
  title: string;
  status: "Pending" | "In Progress" | "Completed";
  desc: string;
  projectId: number;
};

export type Project = {
  id: number; 
  name: string;
  status: "Pending" | "In Progress" | "Completed";
  startDate: string;
  endDate: string;
  progress: number;
  budget: string;
  description: string;
  tasks: Task[];
  createdAt?: string;
  updatedAt?: string;
};

type ProjectsState = {
  projects: Project[];
  setProjects: (p: Project[]) => void;
  updateProject: (id: number, updated: Partial<Project>) => void;
  deleteProject: (id: number) => void;
  addTask: (projectId: number, task: Task) => void;
  updateTask: (projectId: number, taskId: number, updated: Partial<Task>) => void;
  deleteTask: (projectId: number, taskId: number) => void;
  bulkUpdateTasks: (
    projectId: number,
    taskIds: number[],
    updated: Partial<Task>
  ) => void;
};

export const useProjectsStore = create(
  persist<ProjectsState>(
    (set, get) => ({
      projects: [],


      setProjects: (p) => {
        console.log("Storing projects in Zustand:", {
          count: p.length,
          firstProjectHasId: p.length > 0 ? !!p[0].id : false,
        });
        set({ projects: p });
      },


      updateProject: (id, updated) => {
        console.log(`Updating project ${id}:`, updated);
        set({
          projects: get().projects.map((proj) =>
            proj.id === id ? { ...proj, ...updated } : proj
          ),
        });
      },


      deleteProject: (id) => {
        console.log(`Deleting project ${id}`);
        set({
          projects: get().projects.filter((proj) => proj.id !== id),
        });
      },


      addTask: (projectId, task) => {
        console.log(`Adding task to project ${projectId}:`, task);
        set({
          projects: get().projects.map((proj) =>
            proj.id === projectId
              ? { ...proj, tasks: [...proj.tasks, task] }
              : proj
          ),
        });
      },


      updateTask: (projectId, taskId, updated) => {
        console.log(`Updating task ${taskId} in project ${projectId}:`, updated);
        set({
          projects: get().projects.map((proj) =>
            proj.id === projectId
              ? {
                  ...proj,
                  tasks: proj.tasks.map((task) =>
                    task.id === taskId ? { ...task, ...updated } : task
                  ),
                }
              : proj
          ),
        });
      },


      deleteTask: (projectId, taskId) => {
        console.log(`🗑️ Deleting task ${taskId} from project ${projectId}`);
        set({
          projects: get().projects.map((proj) =>
            proj.id === projectId
              ? {
                  ...proj,
                  tasks: proj.tasks.filter((task) => task.id !== taskId),
                }
              : proj
          ),
        });
      },


      bulkUpdateTasks: (projectId, taskIds, updated) => {
        console.log(
          `🔄 Bulk updating tasks in project ${projectId}:`,
          taskIds,
          updated
        );
        set({
          projects: get().projects.map((proj) =>
            proj.id === projectId
              ? {
                  ...proj,
                  tasks: proj.tasks.map((task) =>
                    taskIds.includes(task.id) ? { ...task, ...updated } : task
                  ),
                }
              : proj
          ),
        });
      },
    }),
    {
      name: "projects-storage",
    }
  )
);