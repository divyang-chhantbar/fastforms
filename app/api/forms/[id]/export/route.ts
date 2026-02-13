import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";
import { exporters } from "@/lib/exporter";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const form = await prisma.forms.findUnique({
      where: { id },
      select: { title: true, userId: true },
    });

    if (!form) {
      return NextResponse.json({ error: "Form not found" }, { status: 404 });
    }
    if (form.userId !== userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const responses = await prisma.formsResponses.findMany({
      where: { formId: id },
      select: { data: true, createdAt: true },
    });

    if (responses.length === 0) {
      return new Response("No responses to export", { status: 404 });
    }

    // this I have made to convert the responses into a format and matches our ExportInput type format that can be easily exported to csv or any other format in the future
    const formattedResponses = responses.map((r) => ({
      data: r.data as Record<string, any>,
      createdAt: r.createdAt.toISOString(),
    }));

    const format = request.nextUrl.searchParams.get("format") || "csv";
    const exporter = exporters[format];

    if (!exporter) {
      return NextResponse.json(
        { error: "Unsupported export format" },
        { status: 400 },
      );
    }

    const exportUtility = exporter({
      formTitle: form.title,
      responses: formattedResponses,
    });

    return new Response(exportUtility.content, {
      headers: {
        "Content-Type": exportUtility.mimeType,
        "Content-Disposition": `attachment; filename="${exportUtility.fileName}"`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to export form" },
      { status: 500 },
    );
  }
}
