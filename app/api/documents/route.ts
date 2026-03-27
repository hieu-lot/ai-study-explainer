import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db"; // Kiểm tra lại đường dẫn này có đúng trong project bạn không nhé

// Giữ lại dòng này nếu bạn cần ép kiểu nodejs
export const runtime = "nodejs";

// Sau đó mới đến hàm export async function POST...
export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        // Lấy dữ liệu và gán giá trị mặc định ngay từ đầu để tránh lỗi TypeScript
        let { id, name, content, username } = body;

        // 1. Kiểm tra các trường bắt buộc
        if (!name) {
            return NextResponse.json({ success: false, error: "name required" }, { status: 400 });
        }

        if (!content || !String(content).trim()) {
            return NextResponse.json({ success: false, error: "Document content is empty" }, { status: 400 });
        }

        // 2. Đảm bảo username luôn có giá trị (tránh lỗi Required field trong DB)
        const finalUsername = String(username || "guest");

        // 3. Tạo ID nếu chưa có
        if (!id) {
            id = globalThis.crypto?.randomUUID?.() || `doc-${Date.now()}`;
        }

        // 4. Thực hiện Upsert (Chỉ cần 1 lần duy nhất, không cần lặp lại trong catch)
        const document = await prisma.document.upsert({
            where: { id },
            update: {
                name,
                content: content || "",
                username: finalUsername, // Đảm bảo có username ở đây
            },
            create: {
                id,
                name,
                content: content || "",
                username: finalUsername, // Đảm bảo có username ở đây
            },
        });

        return NextResponse.json({
            success: true,
            document,
        });

    } catch (error) {
        console.error("Document error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to save document" },
            { status: 500 }
        );
    }
}