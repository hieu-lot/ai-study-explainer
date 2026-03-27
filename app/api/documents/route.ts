import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(request: NextRequest) {
    try {
        const id = request.nextUrl.searchParams.get("id");
        const username = request.nextUrl.searchParams.get("username");

        if (id) {
            const doc = await (prisma as any).document.findUnique({
                where: { id },
                include: {
                    _count: { select: { histories: true } },
                },
            });

            if (!doc) {
                return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
            }

            // If username provided, ensure the document belongs to the user
            if (username && (doc as any).username !== username) {
                return NextResponse.json({ success: false, error: "Document not found" }, { status: 404 });
            }

            return NextResponse.json({ success: true, documents: [doc] });
        }

        // If username is not provided, return empty list to avoid leaking documents
        if (!username) {
            return NextResponse.json({ success: true, documents: [] });
        }

        // Try querying by username. If the DB hasn't been migrated yet to include `username`,
        // fall back to fetching all documents and filtering in JS.
        try {
            const documents = await (prisma as any).document.findMany({
                where: { username },
                orderBy: { createdAt: "desc" },
                include: { _count: { select: { histories: true } } },
            });

            return NextResponse.json({ success: true, documents });
        } catch (e) {
            console.warn("Prisma query by username failed, falling back to client-side filter", e);
            const all = await prisma.document.findMany({ orderBy: { createdAt: "desc" }, include: { _count: { select: { histories: true } } } });
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

        // If client didn't provide an id, generate one server-side
        if (!name) {
            return NextResponse.json(
                { success: false, error: "name required" },
                { status: 400 }
            );
        }

        if (!username) {
            return NextResponse.json({ success: false, error: "username required" }, { status: 400 });
        }

        // Ensure content is not empty
        if (!content || !String(content).trim()) {
            return NextResponse.json({ success: false, error: "Document content is empty" }, { status: 400 });
        }

        if (!id) {
            // Node 18+ crypto API
            try {
                id = (globalThis as any).crypto?.randomUUID?.() || `doc-${Date.now()}`;
            } catch (e) {
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
            console.warn("Upsert with username failed, falling back to schema without username", e);
            // Fallback to upsert without username for older schemas
            document = await prisma.document.upsert({
                where: { id },
                update: {
                    name,
                    content: content || "",
                },
                create: {
                    id,
                    name,
                    content: content || "",
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
