import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { title, description, completed } = (body ?? {}) as {
    title?: unknown;
    description?: unknown;
    completed?: unknown;
  };

  const data: Prisma.TaskUpdateInput = {};

  if (title !== undefined) {
    if (typeof title !== "string" || title.trim().length === 0) {
      return NextResponse.json(
        { error: "Title must be a non-empty string." },
        { status: 400 }
      );
    }
    data.title = title.trim();
  }

  if (description !== undefined) {
    if (typeof description !== "string") {
      return NextResponse.json(
        { error: "Description must be a string." },
        { status: 400 }
      );
    }
    data.description = description.trim();
  }

  if (completed !== undefined) {
    if (typeof completed !== "boolean") {
      return NextResponse.json(
        { error: "Completed must be a boolean." },
        { status: 400 }
      );
    }
    data.completed = completed;
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json(
      { error: "No valid fields provided to update." },
      { status: 400 }
    );
  }

  try {
    const task = await prisma.task.update({ where: { id }, data });
    return NextResponse.json(task);
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to update task." },
      { status: 500 }
    );
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const { id } = await params;

  try {
    await prisma.task.delete({ where: { id } });
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2025"
    ) {
      return NextResponse.json({ error: "Task not found." }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Failed to delete task." },
      { status: 500 }
    );
  }
}
