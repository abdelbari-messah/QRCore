import { NextResponse } from "next/server";
import { UAParser } from "ua-parser-js";
import { getDb } from "@/lib/db";

export const dynamic = "force-dynamic";

type GeoLookup = {
  country?: string;
  city?: string;
  regionName?: string;
};

function parseIp(rawIp: string | null): string {
  if (!rawIp) {
    return "127.0.0.1";
  }

  return rawIp.split(",")[0]?.trim() || "127.0.0.1";
}

function normalizeDeviceType(type?: string): "mobile" | "tablet" | "desktop" {
  if (type === "mobile" || type === "tablet") {
    return type;
  }

  return "desktop";
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  const db = getDb();
  const { slug } = await params;

  const qrCode = await db.qRCode.findUnique({
    where: { slug },
    select: {
      id: true,
      targetUrl: true,
    },
  });

  if (!qrCode) {
    return NextResponse.json(
      { error: "Tracking link not found" },
      { status: 404 },
    );
  }

  const userAgent = request.headers.get("user-agent") || "";
  const ip = parseIp(request.headers.get("x-forwarded-for") ?? "127.0.0.1");
  const parsed = new UAParser(userAgent).getResult();

  void (async () => {
    let geo: GeoLookup | null = null;

    try {
      const geoRes = await fetch(
        `http://ip-api.com/json/${encodeURIComponent(ip)}?fields=country,city,regionName`,
        {
          cache: "no-store",
        },
      );

      if (geoRes.ok) {
        geo = (await geoRes.json()) as GeoLookup;
      }
    } catch (error) {
      console.error("Geolocation lookup failed", error);
    }

    db.scan
      .create({
        data: {
          qrCodeId: qrCode.id,
          ip,
          country: geo?.country ?? null,
          city: geo?.city ?? null,
          device: normalizeDeviceType(parsed.device.type),
          os: parsed.os.name || null,
          browser: parsed.browser.name || null,
          userAgent,
        },
      })
      .catch((error) => {
        console.error("Scan logging failed", error);
      });
  })().catch((error) => {
    console.error("Failed to process scan metadata", error);
  });

  return NextResponse.redirect(qrCode.targetUrl, 301);
}
