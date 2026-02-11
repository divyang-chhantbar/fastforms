import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { formId, data } = await req.json();

    console.log("formId:", formId);
    console.log("data:", data);

    if (!formId || formId.trim().length === 0) {
      return NextResponse.json(
        { error: "Form ID is required and cannot be empty" },
        { status: 400 },
      );
    }

    if (!data || typeof data !== "object") {
      return NextResponse.json(
        { error: "Form data is required and must be an object" },
        { status: 400 },
      );
    }

    const form = await prisma.forms.findUnique({
      where: { id: formId },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    const formFields = form.fields as any[];
    const submittedKeys = Object.keys(data);

    if (!Array.isArray(formFields)) {
      return NextResponse.json(
        { error: "Form fields are not in the correct format" },
        { status: 400 },
      );
    }

    for (const field of formFields) {
      if (field.required && !submittedKeys.includes(field.id)) {
        return NextResponse.json(
          { error: `Required field missing: ${field.label}` },
          { status: 400 },
        );
      }
    }

    const formResponse = await prisma.formsResponses.create({
      data: {
        formId: formId,
        data: data,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Response submitted successfully",
        responseId: formResponse.id,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error submitting form:", error);
    return NextResponse.json(
      { error: "Failed to submit form" },
      { status: 500 },
    );
  }
}
