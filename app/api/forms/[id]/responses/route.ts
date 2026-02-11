import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;

    if(!id || id.trim().length === 0) {
        return NextResponse.json({error : "Form ID is required and cannot be empty"}, {status: 400});
    }

    try {
        // we will fetch the responses from the database based on the formId
        const response = await prisma.formsResponses.findMany({
            where : {
                formId : id,
            },
            orderBy : {
                createdAt : "desc",
            }
        });
        return NextResponse.json({success: true, data: response}, {status: 200});
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500});
    }
}