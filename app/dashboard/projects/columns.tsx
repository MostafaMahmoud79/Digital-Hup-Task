"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth-store";


export type ProjectColumn = {
  id: number;
  name: string;
  description: string;
  status: string;
  startDate: string;
  endDate: string;
  progress: number;
  budget: string;
  tasks?: any[];
};

export const columns = (): ColumnDef<ProjectColumn>[] => [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },

  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        className="text-xs sm:text-sm"
      >
        Name
        <ArrowUpDown className="ml-2 h-3 w-3 sm:h-4 sm:w-4" />
      </Button>
    ),
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm font-medium">
        {row.getValue("name")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm">{row.getValue("status")}</div>
    ),
  },
  {
    accessorKey: "startDate",
    header: "Start Date",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm">{row.getValue("startDate")}</div>
    ),
  },
  {
    accessorKey: "endDate",
    header: "End Date",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm">{row.getValue("endDate")}</div>
    ),
  },
  {
    accessorKey: "progress",
    header: "Progress",
    cell: ({ row }) => {
      const progress = row.getValue("progress");
      return (
        <div className="text-xs sm:text-sm">
          {typeof progress === "number" ? `${progress}%` : "0%"}
        </div>
      );
    },
  },
  {
    accessorKey: "budget",
    header: "Budget",
    cell: ({ row }) => (
      <div className="text-xs sm:text-sm font-medium">
        {row.getValue("budget")}
      </div>
    ),
  },

  {
    id: "actions",
    cell: ({ row }) => {
      const project = row.original as ProjectColumn;
      
      if (!project) {
        console.error(" Project is null or undefined");
        return <span className="text-red-500 text-xs">Error</span>;
      }

      if (typeof project.id === "undefined" || project.id === null) {
        console.error("Project ID is missing:", project);
        return <span className="text-red-500 text-xs">No ID</span>;
      }

      console.log(`ActionsCell received project:`, {
        id: project.id,
        name: project.name,
        hasId: !!project.id,
      });

      return <ActionsCell project={project} />;
    },
  },
];

function ActionsCell({ project }: { project: ProjectColumn }) {
  const router = useRouter();
  const canEdit = useAuthStore((s) => s.canEditProjects());
  const canDelete = useAuthStore((s) => s.canDeleteProjects());

  if (!project || !project.id) {
    console.error("ActionsCell: Invalid project data", project);
    return (
      <span className="text-red-500 text-xs">
        Invalid data
      </span>
    );
  }

  const handleViewProject = () => {
    console.log(
      `Navigating to view: ID=${project.id}, Name=${project.name}`
    );
    router.push(`/dashboard/projects/${project.id}`);
  };

  const handleEditProject = () => {
    console.log(
      `Navigating to edit: ID=${project.id}, Name=${project.name}`
    );
    router.push(`/dashboard/projects/${project.id}?edit=true`);
  };

  const handleDeleteProject = async () => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${project.name}"?`
      )
    ) {
      return;
    }

    try {
      console.log(`Deleting project: ID=${project.id}`);

      const response = await fetch(`/api/projects/${project.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.details || "Failed to delete project");
      }

      console.log("Project deleted successfully");
      window.location.reload();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert(`Failed to delete project: ${error}`);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-[200px]">
        <DropdownMenuLabel className="text-sm">Actions</DropdownMenuLabel>

        <DropdownMenuItem
          onClick={() => navigator.clipboard.writeText(project.name)}
          className="text-xs sm:text-sm cursor-pointer"
        >
          Copy project name
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleViewProject}
          className="text-xs sm:text-sm cursor-pointer"
        >
          View project
        </DropdownMenuItem>

        {/*  Edit Admin and ProjectManager */}
        {canEdit && (
          <DropdownMenuItem
            onClick={handleEditProject}
            className="text-xs sm:text-sm cursor-pointer"
          >
            Edit project
          </DropdownMenuItem>
        )}

        {/*  Delete Admin */}
        {canDelete && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleDeleteProject}
              className="text-xs sm:text-sm text-red-600 cursor-pointer"
            >
              Delete project
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}