"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { useProjects } from "@/hooks/use-projects";
import { useRouter } from "next/navigation";

type ProjectDetailsBoxProps = {
  projectId: number;
  editMode?: boolean;
};

export default function ProjectDetailsBox({
  projectId,
  editMode = false,
}: ProjectDetailsBoxProps) {
  const router = useRouter();
  const {
    projects,
    loading,
    addTask,
    updateTask,
    deleteTask,
    updateProject,
  } = useProjects();

  const project = projects.find((p) => p.id === projectId);

  const [selectedTask, setSelectedTask] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [showEditProjectModal, setShowEditProjectModal] = useState(editMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { register, handleSubmit, reset } = useForm({
    defaultValues: {
      title: "",
      status: "Pending",
      desc: "",
    },
  });

  const {
    register: registerProject,
    handleSubmit: handleSubmitProject,
    reset: resetProject,
    formState: { errors: projectErrors },
  } = useForm({
    defaultValues: {
      name: project?.name || "",
      description: project?.description || "",
      progress: project?.progress || 0,
      budget: project?.budget || "",
      status: project?.status || "Pending",
    },
  });

  useEffect(() => {
    if (project) {
      resetProject({
        name: project.name,
        description: project.description,
        progress: project.progress,
        budget: project.budget,
        status: project.status,
      });
    }
  }, [project, resetProject]);

  const openUpdateModal = (task) => {
    setSelectedTask(task);
    reset(task);
    setShowUpdateModal(true);
  };

  const submitUpdateProject = async (values) => {
    if (!project) return;

    try {
      setIsSubmitting(true);

      await updateProject(project.id, {
        name: values.name,
        description: values.description,
        progress: parseInt(values.progress),
        budget: values.budget,
        status: values.status,
      });

      console.log("Project updated successfully");
      setShowEditProjectModal(false);


      router.push(`/dashboard/projects/${project.id}`);
    } catch (error) {
      console.error("Error updating project:", error);
      alert("Failed to update project");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitAddTask = async (values) => {
    if (!project) return;

    try {
      setIsSubmitting(true);

      await addTask(project.id, {
        title: values.title,
        status: values.status,
        desc: values.desc,
      });

      console.log("Task added successfully");
      reset({ title: "", status: "Pending", desc: "" });
      setShowAddTaskModal(false);
    } catch (error) {
      console.error("Error adding task:", error);
      alert("Failed to add task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const submitUpdate = async (values) => {
    if (!selectedTask || !project) return;

    try {
      setIsSubmitting(true);

      await updateTask(selectedTask.id, {
        title: values.title,
        status: values.status,
        desc: values.desc,
      });

      console.log("Task updated successfully");
      setShowUpdateModal(false);
    } catch (error) {
      console.error("Error updating task:", error);
      alert("Failed to update task");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteTask = async () => {
    if (!selectedTask) return;

    try {
      setIsSubmitting(true);

      await deleteTask(selectedTask.id);

      console.log("Task deleted successfully");
      setShowDeleteDialog(false);
    } catch (error) {
      console.error("Error deleting task:", error);
      alert("Failed to delete task");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
        <Skeleton className="h-10 w-40" />
        <Skeleton className="h-40 w-full" />
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="w-full p-4 sm:p-6 lg:p-8">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center text-red-700">
            <p className="text-lg font-semibold">Project Not Found</p>
            <p className="text-sm mt-2">
              The project you're looking for doesn't exist.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const tasksList = project.tasks || [];
  const completedTasks = tasksList.filter((t) => t.status === "Completed").length;
  const inProgressTasks = tasksList.filter((t) => t.status === "In Progress").length;

  return (
    <div className="w-full p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-xl sm:text-2xl lg:text-3xl font-semibold">
            {project.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            ID: {project.id}
          </p>
        </div>
        <Button
          onClick={() => setShowEditProjectModal(true)}
          className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
        >
          Edit Project
        </Button>
      </div>

      {/*  Project Card  */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl">{project.name}</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <p className="text-sm sm:text-base text-muted-foreground">
            {project.description}
          </p>

          <div>
            <p className="font-medium mb-1 text-sm sm:text-base">Progress</p>
            <Progress value={project.progress} className="h-2 sm:h-3" />
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              {project.progress}% Complete
            </p>
          </div>

          <div className="flex items-center gap-2">
            <p className="font-medium text-sm sm:text-base">Status:</p>
            <Badge className="text-xs sm:text-sm">{project.status}</Badge>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm border-t pt-4">
            <div>
              <p className="font-medium text-muted-foreground">Start Date</p>
              <p>{project.startDate}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">End Date</p>
              <p>{project.endDate}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Budget</p>
              <p className="font-semibold">{project.budget}</p>
            </div>
            <div>
              <p className="font-medium text-muted-foreground">Tasks</p>
              <p className="font-semibold">{tasksList.length}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/*  Tasks Stats  */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-blue-600">
              {tasksList.length}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Total Tasks
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-green-600">
              {completedTasks}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              Completed
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6 text-center">
            <p className="text-2xl sm:text-3xl font-bold text-yellow-600">
              {inProgressTasks}
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1">
              In Progress
            </p>
          </CardContent>
        </Card>
      </div>

      <Separator />

      {/*  Tasks Section  */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-lg sm:text-xl font-semibold">
          Tasks ({tasksList.length})
        </h2>
        <Button
          onClick={() => setShowAddTaskModal(true)}
          className="w-full sm:w-auto bg-green-600 hover:bg-green-700"
        >
          Add Task
        </Button>
      </div>

      <div className="space-y-3">
        {tasksList.length === 0 ? (
          <p className="text-center text-muted-foreground py-6">
            No tasks yet. Add one to get started!
          </p>
        ) : (
          tasksList.map((task) => (
            <Card
              key={task.id}
              className="p-3 sm:p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 hover:shadow-md transition"
            >
              <div className="flex-1">
                <p className="font-medium text-sm sm:text-base">{task.title}</p>
                <p className="text-xs text-muted-foreground mt-1">{task.desc}</p>
                <Badge
                  variant="outline"
                  className={`mt-2 text-xs ${
                    task.status === "Completed"
                      ? "bg-green-100 text-green-700 border-green-300"
                      : task.status === "In Progress"
                      ? "bg-blue-100 text-blue-700 border-blue-300"
                      : "bg-gray-100 text-gray-700 border-gray-300"
                  }`}
                >
                  {task.status}
                </Badge>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDetailsModal(true);
                  }}
                >
                   Details
                </Button>

                <Button
                  variant="secondary"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                  onClick={() => openUpdateModal(task)}
                >
                  Update
                </Button>

                <Button
                  variant="destructive"
                  size="sm"
                  className="w-full sm:w-auto text-xs sm:text-sm"
                  onClick={() => {
                    setSelectedTask(task);
                    setShowDeleteDialog(true);
                  }}
                >
                  Delete
                </Button>
              </div>
            </Card>
          ))
        )}
      </div>

      {/*  SHOW DETAILS MODAL  */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Task Details</DialogTitle>
          </DialogHeader>

          {selectedTask && (
            <div className="space-y-3 text-sm sm:text-base">
              <div>
                <p className="font-medium text-muted-foreground">Title</p>
                <p>{selectedTask.title}</p>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Status</p>
                <Badge>{selectedTask.status}</Badge>
              </div>
              <div>
                <p className="font-medium text-muted-foreground">Description</p>
                <p>{selectedTask.desc}</p>
              </div>
            </div>
          )}

          <DialogFooter>
            <Button
              onClick={() => setShowDetailsModal(false)}
              className="w-full sm:w-auto"
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/*  UPDATE TASK MODAL  */}
      <Dialog open={showUpdateModal} onOpenChange={setShowUpdateModal}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Task</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(submitUpdate)} className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium">Title</label>
              <Input
                {...register("title")}
                className="text-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">Status</label>
              <select
                {...register("status")}
                className="w-full p-2 border rounded text-sm bg-white"
                disabled={isSubmitting}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">Description</label>
              <Textarea
                rows={4}
                {...register("desc")}
                className="text-sm"
                disabled={isSubmitting}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/*  ADD TASK MODAL  */}
      <Dialog open={showAddTaskModal} onOpenChange={setShowAddTaskModal}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add New Task</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit(submitAddTask)} className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium">Title</label>
              <Input
                {...register("title")}
                placeholder="Task title"
                className="text-sm"
                required
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">Status</label>
              <select
                {...register("status")}
                className="w-full p-2 border rounded text-sm bg-white"
                disabled={isSubmitting}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">Description</label>
              <Textarea
                rows={4}
                {...register("desc")}
                placeholder="Task description"
                className="text-sm"
                disabled={isSubmitting}
              />
            </div>

            <DialogFooter>
              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Adding..." : "Add Task"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/*  EDIT PROJECT MODAL  */}
      <Dialog open={showEditProjectModal} onOpenChange={setShowEditProjectModal}>
        <DialogContent className="w-[95vw] sm:w-full sm:max-w-md max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              Edit Project Details
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmitProject(submitUpdateProject)} className="space-y-4">
            <div>
              <label className="text-xs sm:text-sm font-medium">Project Name *</label>
              <Input
                {...registerProject("name", { required: "Name is required" })}
                className="text-sm"
                disabled={isSubmitting}
              />
              {projectErrors.name && (
                <p className="text-red-500 text-xs mt-1">{projectErrors.name.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">Description</label>
              <Textarea
                rows={3}
                {...registerProject("description")}
                className="text-sm"
                disabled={isSubmitting}
              />
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">
                Progress (0-100) *
              </label>
              <Input
                type="number"
                min="0"
                max="100"
                {...registerProject("progress", {
                  valueAsNumber: true,
                  required: "Progress is required",
                })}
                className="text-sm"
                disabled={isSubmitting}
              />
              {projectErrors.progress && (
                <p className="text-red-500 text-xs mt-1">{projectErrors.progress.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">Status *</label>
              <select
                {...registerProject("status", { required: "Status is required" })}
                className="w-full p-2 border rounded text-sm bg-white"
                disabled={isSubmitting}
              >
                <option value="Pending">Pending</option>
                <option value="In Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
              {projectErrors.status && (
                <p className="text-red-500 text-xs mt-1">{projectErrors.status.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs sm:text-sm font-medium">Budget</label>
              <Input
                {...registerProject("budget")}
                placeholder="e.g., $10,000"
                className="text-sm"
                disabled={isSubmitting}
              />
            </div>

            <DialogFooter className="flex-col sm:flex-row gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowEditProjectModal(false)}
                disabled={isSubmitting}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Saving..." : "Update Project"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/*  DELETE ALERT DIALOG  */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent className="w-[95vw] sm:w-full sm:max-w-md">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base sm:text-lg">
              Delete "{selectedTask?.title}"?
            </AlertDialogTitle>
          </AlertDialogHeader>

          <AlertDialogFooter className="flex-col sm:flex-row gap-2">
            <AlertDialogCancel
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              className="bg-red-600 text-white w-full sm:w-auto hover:bg-red-700"
              onClick={handleDeleteTask}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}