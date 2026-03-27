import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
    request: NextRequest,
    { params }: { params: { documentId: string } }
) {
    try {
        const { documentId } = params;

        if (!documentId) {
            return NextResponse.json(
                { success: false, error: "documentId required" },
                { status: 400 }
            );
        }

        const history = await prisma.aIHistory.findMany({
            where: {
                documentId,
            },
            orderBy: {
                createdAt: "desc",
            },
            take: 20,
        });

        return NextResponse.json({
            success: true,
            history: history.reverse(),
        });
    } catch (error) {
        console.error("History error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to get history" },
            { status: 500 }
        );
    }
}
