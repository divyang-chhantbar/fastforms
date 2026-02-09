import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

/*
    get the formId from the params
    validate it 
    we will look up to it in our database and 
    return the response that are attached with that particular formId
*/

export async function GET(req : NextRequest,{ params }: { params: Promise<{ formId: string }> }) {
  try {
    const { formId } = await params;
    console.log("FormId : ",formId);
    

    if (!formId || formId.trim().length === 0) {
      return NextResponse.json(
        {
          error: "Form ID is required and cannot be empty",
        },
        { status: 400 },
      );
    }

    const data = await prisma.forms.findUnique({
      where: {
        id: formId,
      },
    });
    console.log("data coming from db : ",data);
    
    if (!data) {
  return NextResponse.json(
    { error: "Form not found" },
    { status: 404 }
  );
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
