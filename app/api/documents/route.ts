import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        const username = request.nextUrl.searchParams.get("username");

        if (id) {
            const doc = await prisma.document.findUnique({
                where: { id },
                include: {
                    _count: { select: { histories: true } },
                },
            });

            if (!doc) {
                return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
            }

            if (username && (doc as any).username !== username) {
                return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true, documents: [doc] });
        }

        if (!username) {
            return NextResponse.json({ success: true, documents: [] });
        }

        try {
            const documents = await (prisma as any).document.findMany({
                where: { username },
                orderBy: { createdAt: "desc" },
                include: { _count: { select: { histories: true } } },
            });

            return NextResponse.json({ success: true, documents });
        } catch (e) {
            console.warn("Fallback filter", e);

            const all = await prisma.document.findMany({
                orderBy: { createdAt: "desc" },
                include: { _count: { select: { histories: true } } },
            });

            const filtered = all.filter((d) => (d as any).username === username);
            return NextResponse.json({ success: true, documents: filtered });
        }
    } catch (error) {
        console.error("Documents error:", error);
        return NextResponse.json(
            { success: false, error: "Failed to get documents" },
            { status: 500 }
        );
    }
}

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        let { id, name, content, username } = body;

        if (!name) {
            return NextResponse.json(
                { success: false, error: "name required" },
                { status: 400 }
            );
        }

        // 🔥 FIX CHÍNH: auto fallback username
        if (!username) {
            username = "guest";
        }

        if (!content || !String(content).trim()) {
            return NextResponse.json(
                { success: false, error: "Document content is empty" },
                { status: 400 }
            );
        }

        if (!id) {
            try {
                id = globalThis.crypto?.randomUUID?.() || `doc-${Date.now()}`;
            } catch {
                id = `doc-${Date.now()}`;
            }
        }

        let document;

        try {
            document = await (prisma as any).document.upsert({
                where: { id },
                update: {
                    name,
                    content: content || "",
                    username,
                },
                create: {
                    id,
                    name,
                    content: content || "",
                    username,
                },
            });
        } catch (e) {
            console.warn("Fallback no-username schema", e);

            document = await prisma.document.upsert({
                where: { id },
                update: {
                    name,
                    content: content || "",
                    username, // 👈 THÊM DÒNG NÀY
                },
                create: {
                    id,
                    name,
                    content: content || "",
                    username, // 👈 THÊM DÒNG NÀY
                },
            });
        }
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