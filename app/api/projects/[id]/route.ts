import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET project by id
export async function GET(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  try {
    const project = await prisma.project.findUnique({
      where: { id: parseInt(id) },
      include: { tasks: true },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

// PUT update project
export async function PUT(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;
  const body = await req.json();

  try {
    const project = await prisma.project.update({
      where: { id: parseInt(id) },
      data: {
        name: body.name,
        description: body.description,
        status: body.status,
        progress: body.progress,
        budget: body.budget,
      },
      include: { tasks: true },
    });

    return NextResponse.json(project);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

// DELETE project
export async function DELETE(req: Request, ctx: { params: { id: string } }) {
  const { id } = ctx.params;

  try {
    await prisma.project.delete({ where: { id: parseInt(id) } });
    return NextResponse.json({ message: "Project deleted" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}
