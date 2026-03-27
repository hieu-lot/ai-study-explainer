import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

interface RequestBody {
  question: string;
  documentId: string;
}

export async function POST(request: NextRequest) {
  try {
    let body: RequestBody;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { success: false, error: "Invalid JSON" },
        { status: 400 }
      );
    }

    const { question, documentId } = body;

    if (!question || typeof question !== "string") {
      return NextResponse.json(
        { success: false, error: "question required" },
        { status: 400 }
      );
    }

    if (!documentId || typeof documentId !== "string") {
      return NextResponse.json(
        { success: false, error: "documentId required" },
        { status: 400 }
      );
    }

    // Generate mock answer
    const answer = `This is a mock answer for: ${question}`;

    // Save to database
    try {
      await prisma.aIHistory.create({
        data: {
          question,
          answer,
          documentId,
        },
      });
    } catch (dbErr) {
      console.error("DB ERROR:", dbErr);
    }

    return NextResponse.json({
      success: true,
      answer,
    });
  } catch (err: any) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { success: false, error: err?.message || "Internal error" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json(
    { success: false, error: "Use POST" },
    { status: 405 }
  );
}