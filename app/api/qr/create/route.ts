import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";
import { getDb } from "@/lib/db";

function isValidUrl(value: string): boolean {
  try {
    const parsed = new URL(value);
    return parsed.protocol === "http:" || parsed.protocol === "https:";
  } catch {
    return false;
  }
}

async function generateUniqueSlug(length = 8): Promise<string> {
  const db = getDb();

  for (let i = 0; i < 10; i += 1) {
    const slug = nanoid(length);
    const existing = await db.qRCode.findUnique({
      where: { slug },
      select: { id: true },
    });
    if (!existing) {
      return slug;
    }
  }

  throw new Error("Unable to generate a unique slug");
}

export async function POST(request: NextRequest) {
  try {
    const db = getDb();
    const body = (await request.json()) as {
      targetUrl?: string;
      label?: string;
    };
    const targetUrl = body.targetUrl?.trim();
    const label = body.label?.trim() || null;

    if (!targetUrl || !isValidUrl(targetUrl)) {
      return NextResponse.json({ error: "Invalid targetUrl" }, { status: 400 });
    }

    const slug = await generateUniqueSlug(8);
    const manageToken = crypto.randomUUID();

    const created = await db.qRCode.create({
      data: {
        slug,
        targetUrl,
        label,
        manageToken,
      },
      select: {
        id: true,
        slug: true,
        manageToken: true,
      },
    });

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || request.nextUrl.origin;
    const trackingUrl = `${baseUrl.replace(/\/$/, "")}/r/${created.slug}`;

    return NextResponse.json({
      slug: created.slug,
      manageToken: created.manageToken,
      trackingUrl,
      qrCodeId: created.id,
    });
  } catch (error) {
    console.error("Failed to create trackable QR code", error);
    return NextResponse.json(
      { error: "Failed to create QR code" },
      { status: 500 },
    );
  }
}
