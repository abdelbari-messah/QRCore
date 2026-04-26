import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ manageToken: string }> },
) {
  try {
    const db = getDb();
    const { manageToken } = await params;

    const qrCode = await db.qRCode.findUnique({
      where: { manageToken },
      include: {
        scans: {
          orderBy: { scannedAt: "desc" },
        },
      },
    });

    if (!qrCode) {
      return NextResponse.json({ error: "QR code not found" }, { status: 404 });
    }

    return NextResponse.json(qrCode);
  } catch (error) {
    console.error("Failed to fetch QR analytics", error);
    return NextResponse.json(
      { error: "Failed to fetch analytics" },
      { status: 500 },
    );
  }
}
