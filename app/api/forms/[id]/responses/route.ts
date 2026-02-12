import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  if (!id || id.trim().length === 0) {
    return NextResponse.json(
      { error: "Form ID is required and cannot be empty" },
      { status: 400 },
    );
  }

  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // we will extract out the other form data from the forms table
    const form = await prisma.forms.findUnique({
      where: { id },
      select: {
        id: true,
        title: true,
        userId: true,
      },
    });
    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    if (form.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    // we will fetch the responses from the database based on the formId
    const responses = await prisma.formsResponses.findMany({
      where: {
        formId: id,
      },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        data: true,
        createdAt: true,
      },
    });
    console.log("Fetched responses:", responses);
    return NextResponse.json(
      {
        success: true,
        formTitle: form.title,
        totalResponses: responses.length,
        responses: responses,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
