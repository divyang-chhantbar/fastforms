import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { validateFormSchema } from "@/lib/validations";

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
    // console.log("data coming from db : ", data);

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


/*
    Here its a request where we will update our form structure 
    As we will be using TamboUI for updating the fields or titles , we need 
    to validate the form structure .
*/
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
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

    const body = await req.json().catch(() => ({}));
    const { title, fields, isPublished } = body;

    // 1. Check if form exists and user owns it
    const existingForm = await prisma.forms.findUnique({
      where: { id: id },
      select: { userId: true, isPublished: true, title: true, fields: true },
    });

    if (!existingForm) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }

    if (existingForm.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const updateData: any = {};

    if (isPublished !== undefined) {
      updateData.isPublished = isPublished;
    } else if (body.togglePublish) {
      // Keep support for the original toggle behavior just in case
      updateData.isPublished = !existingForm.isPublished;
    }

    if (title !== undefined) {
      updateData.title = title;
    }

    if (fields !== undefined) {
      // VALIDATION: Ensure the new fields meet our schema requirements
      try {
        console.log("Validating updated fields:", JSON.stringify(fields, null, 2));
        validateFormSchema({
          title: title || existingForm.title,
          fields: fields,
        });
        updateData.fields = fields;
      } catch (error: any) {
        console.error("Zod Validation Error:", error.errors);
        return NextResponse.json(
          { error: "Invalid form structure", details: error.errors },
          { status: 400 },
        );
      }
    }

    // 3. Execute Update
    const updatedForm = await prisma.forms.update({
      where: { id: id },
      data: updateData,
    });

    return NextResponse.json(
      { success: true, data: updatedForm },
      { status: 200 },
    );
  } catch (error) {
    console.error("PATCH Error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
