import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";
export const dynamic = 'force-dynamic';

interface RequestBody {
  question: string;
  documentId: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    if (!body || !body.question || !body.documentId) {
      return NextResponse.json(
        { success: false, error: "Missing question or documentId" },
        { status: 400 }
      );
    }

    const { question, documentId } = body;

    // --- CHẾ ĐỘ MOCK AI ---
    // Hiện tại bạn đang dùng Mock, khi nào nạp tiền AI thật thì viết logic gọi SDK ở đây
    const answer = `[Mock AI] This is a temporary answer for: ${question}`;

    // Lưu vào DB (Dùng try-catch riêng để nếu DB lỗi thì vẫn trả về được câu trả lời AI)
    try {
      // Đảm bảo DATABASE_URL đã được add vào Vercel Settings
      await prisma.aiHistory.create({
        data: {
          question,
          answer,
          documentId,
        },
      });
    } catch (dbErr) {
      console.error("DB SAVE ERROR:", dbErr);
      // Không return lỗi ở đây để user vẫn nhận được câu trả lời từ AI
    }

    return NextResponse.json({
      success: true,
      answer,
    });

  } catch (err: unknown) {
    console.error("API ERROR:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Xóa hẳn hàm GET cũ hoặc viết như này để tránh lỗi build data collection
export async function GET() {
  return new Response("Method Not Allowed", { status: 405 });
}