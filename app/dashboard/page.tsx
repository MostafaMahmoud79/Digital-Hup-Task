"use client";

import { useEffect, useState } from "react";
import { DataTable } from "./projects/data-table";
import { columns } from "./projects/columns";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function ProjectsPage() {
  const { projects, loading } = useProjects();
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      setPageLoading(false);
      console.log("ProjectsPage loaded");
      console.log(`Total projects: ${projects.length}`);
      console.log("Projects data:", projects);

      if (projects.length > 0) {
        const firstProject = projects[0];
        console.log("First project structure:", {
          id: firstProject.id,
          name: firstProject.name,
          hasId: !!firstProject.id,
          idType: typeof firstProject.id,
        });
      }
    }
  }, [loading, projects]);

  // Charts Data
  const progressChartData = projects.map((p) => ({
    name: p.name,
    progress: p.progress,
    remaining: 100 - p.progress,
  }));

  const statusCounts = {
    Pending: projects.filter((p) => p.status === "Pending").length,
    "In Progress": projects.filter((p) => p.status === "In Progress").length,
    Completed: projects.filter((p) => p.status === "Completed").length,
  };

  const statusChartData = [
    { name: "Pending", value: statusCounts.Pending, fill: "#f59e0b" },
    { name: "In Progress", value: statusCounts["In Progress"], fill: "#3b82f6" },
    { name: "Completed", value: statusCounts.Completed, fill: "#10b981" },
  ];

  const tasksChartData = projects.map((p) => ({
    name: p.name.substring(0, 10),
    tasks: p.tasks?.length || 0,
    completed: p.tasks?.filter((t) => t.status === "Completed").length || 0,
    inProgress: p.tasks?.filter((t) => t.status === "In Progress").length || 0,
  }));

  // Stats
  const totalProjects = projects.length;
  const totalTasks = projects.reduce((sum, p) => sum + (p.tasks?.length || 0), 0);
  const completedProjects = projects.filter(
    (p) => p.status === "Completed"
  ).length;
  const totalBudget = projects
    .reduce((sum, p) => {
      const budget = parseFloat(p.budget.replace(/[^\d.]/g, ""));
      return sum + (isNaN(budget) ? 0 : budget);
    }, 0)
    .toLocaleString("en-US", { style: "currency", currency: "USD" });

  if (pageLoading) {
    return (
      <div className="py-6 sm:py-10 space-y-4 px-4">
        <Skeleton className="h-10 w-40" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-6 sm:space-y-10">
      {/* Stats */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Projects Dashboard
        </h1>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-xs sm:text-sm">
                Total Projects
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">
                {totalProjects}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {completedProjects} completed
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-xs sm:text-sm">
                Total Tasks
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-2">
                {totalTasks}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Across all projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-xs sm:text-sm">
                In Progress
              </p>
              <p className="text-2xl sm:text-3xl font-bold mt-2 text-blue-600">
                {statusCounts["In Progress"]}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Active projects
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <p className="text-muted-foreground text-xs sm:text-sm">
                Total Budget
              </p>
              <p className="text-lg sm:text-xl font-bold mt-2">
                {totalBudget}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Allocated resources
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Projects by Status
            </CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={statusChartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  dataKey="value"
                >
                  {statusChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Project Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="name"
                  angle={-45}
                  textAnchor="end"
                  height={80}
                  tick={{ fontSize: 12 }}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="progress" fill="#10b981" name="Progress %" />
                <Bar dataKey="remaining" fill="#e5e7eb" name="Remaining %" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg">
              Tasks Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={tasksChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="completed" fill="#10b981" name="Completed" />
                <Bar dataKey="inProgress" fill="#3b82f6" name="In Progress" />
                <Bar dataKey="tasks" fill="#f59e0b" name="Total" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Table */}
      <div className="w-full">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">All Projects</h2>
        <div className="overflow-x-auto">
          <DataTable columns={columns()} data={projects} />
        </div>
      </div>
    </div>
  );
}