"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import ProjectDetailsBox from "../[name]/_components/ProjectDetailsBox";
import { useProjects } from "@/hooks/use-projects";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function ProjectPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const projectIdParam = params?.id;
  const projectId = projectIdParam ? parseInt(projectIdParam as string) : null;
  const isEditMode = searchParams?.get("edit") === "true";

  const { projects, loading } = useProjects();
  const [pageReady, setPageReady] = useState(false);

  const project = projectId ? projects.find((p) => p.id === projectId) : null;

  useEffect(() => {
    if (!loading) {
      setPageReady(true);
    }
  }, [loading, projectId, project, projects.length, isEditMode]);

  if (loading || !pageReady) {
    return (
      <div className="container mx-auto py-6 sm:py-10 space-y-4 px-4">
        <Skeleton className="h-8 sm:h-10 w-32 sm:w-40" />
        <Skeleton className="h-10 sm:h-12 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-12 w-full" />
      </div>
    );
  }

  if (!projectId || isNaN(projectId)) {
    return (
      <div className="container mx-auto py-6 sm:py-10 px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold text-red-700">
              Invalid Project ID
            </p>
            <p className="text-sm text-red-600 mt-2">
              Project ID must be a valid number. Got: {projectIdParam}
            </p>
            <Button
              onClick={() => router.push("/dashboard/projects")}
              className="mt-4"
            >
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="container mx-auto py-6 sm:py-10 px-4">
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6 text-center">
            <p className="text-lg font-semibold text-red-700">
              Project Not Found
            </p>
            <p className="text-sm text-red-600 mt-2">
              Could not find project with ID: {projectId}
            </p>
            <Button
              onClick={() => router.push("/dashboard/projects")}
              className="mt-4"
            >
              Back to Projects
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 sm:py-10 px-4 sm:px-6">
      {isEditMode && (
        <div className="mb-4 p-3 bg-blue-100 border border-blue-300 rounded">
          <p className="text-sm text-blue-700">
            <strong>Edit Mode:</strong> You can modify the project details
          </p>
        </div>
      )}

      <ProjectDetailsBox projectId={projectId} editMode={isEditMode} />
    </div>
  );
}