import { generateFormSchema } from "@/lib/aiFormGeneration";
import prisma from "@/lib/prisma";
import { validateFormSchema } from "@/lib/validations";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    const {userId} = await auth();

    if(!userId) {
        return NextResponse.json({error: "Unauthorized"}, {status: 401});
    }

    if (!prompt || prompt.trim().length === 0) {
      return NextResponse.json(
        { error: "Prompt is required and cannot be empty" },
        { status: 400 },
      );
    }

    const schema = await generateFormSchema(prompt);
    const parsedSchema = validateFormSchema(schema);

    const form = await prisma.forms.create({
      data: {
        userId,
        title: parsedSchema.title,
        fields: parsedSchema.fields,
        isPublished: false,
      },
    });
    return NextResponse.json(
      {
        success: true,
        formId: form.id,
        slug: form.slug,
        title: form.title,
        message: "Form generated successfully",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Form generation failed:", error);
    return NextResponse.json(
      { error: "Form generation failed" },
      { status: 500 },
    );
  }
}
