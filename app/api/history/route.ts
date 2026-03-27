import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
    try {
        const history = await prisma.aIHistory.findMany({
            take: 10,
            orderBy: {
                createdAt: "desc",
            },
        });

        return NextResponse.json({
            success: true,
            data: history,
        });
    } catch (error) {
        console.error("History retrieval error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to retrieve history" },
            { status: 500 }
        );
    }
}
