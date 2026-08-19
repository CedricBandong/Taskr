import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const tasks = await prisma.task.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(tasks);
  } catch {
    return NextResponse.json(
      { error: "Failed to load tasks." },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Request body must be valid JSON." },
      { status: 400 }
    );
  }

  const { title, description } = (body ?? {}) as {
    title?: unknown;
    description?: unknown;
  };

  if (typeof title !== "string" || title.trim().length === 0) {
    return NextResponse.json(
      { error: "Title is required." },
      { status: 400 }
    );
  }

  if (description !== undefined && typeof description !== "string") {
    return NextResponse.json(
      { error: "Description must be a string." },
      { status: 400 }
    );
  }

  try {
    const task = await prisma.task.create({
      data: {
        title: title.trim(),
        description: (description ?? "").trim(),
      },
    });
    return NextResponse.json(task, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Failed to create task." },
      { status: 500 }
    );
  }
}
