"use client";

import { useState, useEffect } from "react";
import { useProjectsStore } from "@/store/projects-store";

export type Task = {
  id: number;
  title: string;
  status: string;
  desc: string;
  projectId: number;
};

export type Project = {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget: string;
  tasks: Task[];
};

export function useProjects() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const {
    projects,
    setProjects,
    updateProject,
    deleteProject,
    addTask,
    updateTask,
    deleteTask,
  } = useProjectsStore();


  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      console.log("Fetching projects from API...");

      const response = await fetch("/api/projects");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: Failed to fetch projects`);
      }

      const data: Project[] = await response.json();

      console.log("Projects fetched successfully:");
      console.log(`   Total: ${data.length} projects`);


      if (data.length > 0) {
        const firstProject = data[0];
        console.log("🔍 First project structure:", {
          id: firstProject.id,
          name: firstProject.name,
          hasId: typeof firstProject.id !== "undefined",
          idType: typeof firstProject.id,
          keysInObject: Object.keys(firstProject),
        });
      }


      setProjects(data);
      setError(null);
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error fetching projects:", errorMsg);
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const addProject = async (
    project: Omit<Project, "id" | "tasks">
  ) => {
    try {
      console.log("Adding new project...", project);

      const response = await fetch("/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(project),
      });

      if (!response.ok) {
        throw new Error("Failed to add project");
      }

      console.log("Project added successfully");
      await fetchProjects();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error adding project:", errorMsg);
      setError(errorMsg);
    }
  };

  const updateProjectData = async (
    id: number,
    data: Partial<Project>
  ) => {
    try {
      console.log(`Updating project ${id}...`, data);

      const response = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error("Failed to update project");
      }

      console.log("Project updated successfully");
      await fetchProjects();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error updating project:", errorMsg);
      setError(errorMsg);
    }
  };

  const deleteProjectData = async (id: number) => {
    try {
      console.log(`Deleting project ${id}...`);

      const response = await fetch(`/api/projects/${id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete project");
      }

      console.log("Project deleted successfully");
      await fetchProjects();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error deleting project:", errorMsg);
      setError(errorMsg);
    }
  };

  const addTaskData = async (
    projectId: number,
    task: Omit<Task, "id" | "projectId">
  ) => {
    try {
      console.log(`Adding task to project ${projectId}...`, task);

      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...task, projectId }),
      });

      if (!response.ok) {
        throw new Error("Failed to add task");
      }

      console.log("Task added successfully");
      await fetchProjects();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error adding task:", errorMsg);
      setError(errorMsg);
    }
  };

  const updateTaskData = async (
    id: number,
    data: Partial<Task>
  ) => {
    try {
      console.log(`Updating task ${id}...`, data);

      const response = await fetch("/api/tasks", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id, ...data }),
      });

      if (!response.ok) {
        throw new Error("Failed to update task");
      }

      console.log("Task updated successfully");
      await fetchProjects();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error updating task:", errorMsg);
      setError(errorMsg);
    }
  };

  const deleteTaskData = async (id: number) => {
    try {
      console.log(`Deleting task ${id}...`);

      const response = await fetch("/api/tasks", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (!response.ok) {
        throw new Error("Failed to delete task");
      }

      console.log("Task deleted successfully");
      await fetchProjects();
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Unknown error";
      console.error("Error deleting task:", errorMsg);
      setError(errorMsg);
    }
  };

  return {
    projects: projects as Project[],
    loading,
    error,
    fetchProjects,
    addProject,
    updateProject: updateProjectData,
    deleteProject: deleteProjectData,
    addTask: addTaskData,
    updateTask: updateTaskData,
    deleteTask: deleteTaskData,
  };
}