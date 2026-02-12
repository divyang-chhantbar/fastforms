import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

/*
    get the formId from the params
    validate it 
    we will look up to it in our database and 
    return the response that are attached with that particular formId
*/

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    // console.log("Received form ID:", id);

    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Form ID is required and cannot be empty",
        },
        { status: 400 },
      );
    }

    const data = await prisma.forms.findFirst({
      where: {
        OR: [{ id: id }, { slug: id }],
      },
    });
    console.log("data coming from db : ", data);

    if (!data) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    return NextResponse.json(
      {
        success: true,
        data,
      },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // user authentication
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    if (!id || id.trim().length === 0) {
      return NextResponse.json(
        { error: "Form ID is required and cannot be empty" },
        { status: 400 },
      );
    }

    const form = await prisma.forms.findUnique({
      where: {
        id: id,
      },
      select: { userId: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (form.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const deletedForm = await prisma.forms.delete({
      where: { id: id },
    });

    return NextResponse.json(
      { success: true, data: deletedForm },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
