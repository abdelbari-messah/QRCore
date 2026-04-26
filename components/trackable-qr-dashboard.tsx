"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import QRCodeStyling from "qr-code-styling";
import { format, subDays } from "date-fns";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Download, ExternalLink, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QRPreview } from "@/components/qr-preview";
import { generateTimestamp } from "@/lib/qr-utils";

type Scan = {
  id: string;
  scannedAt: string;
  ip: string | null;
  country: string | null;
  city: string | null;
  device: string | null;
  os: string | null;
  browser: string | null;
  userAgent: string | null;
};

type QRData = {
  id: string;
  slug: string;
  targetUrl: string;
  label: string | null;
  createdAt: string;
  manageToken: string;
  scans: Scan[];
};

const pieColors = ["#0ea5e9", "#22c55e", "#f59e0b", "#a855f7"];

export function TrackableQRDashboard({ manageToken }: { manageToken: string }) {
  const [data, setData] = useState<QRData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    const fetchData = async () => {
      try {
        const response = await fetch(`/api/qr/${manageToken}`, {
          cache: "no-store",
        });
        const payload = (await response.json()) as QRData | { error?: string };

        if (!response.ok || !("id" in payload)) {
          const message =
            "error" in payload
              ? payload.error
              : "Unable to load dashboard data";
          throw new Error(message || "Unable to load dashboard data");
        }

        if (isMounted) {
          setData(payload);
        }
      } catch (fetchError) {
        if (isMounted) {
          setError(
            fetchError instanceof Error ? fetchError.message : "Unknown error",
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void fetchData();

    return () => {
      isMounted = false;
    };
  }, [manageToken]);

  const trackingUrl = useMemo(() => {
    if (!data || typeof window === "undefined") return "";
    return `${window.location.origin}/r/${data.slug}`;
  }, [data]);

  const totalScans = data?.scans.length || 0;

  const scansByDay = useMemo(() => {
    const result: Array<{ date: string; scans: number }> = [];
    const countMap = new Map<string, number>();

    for (const scan of data?.scans || []) {
      const key = format(new Date(scan.scannedAt), "yyyy-MM-dd");
      countMap.set(key, (countMap.get(key) || 0) + 1);
    }

    for (let i = 29; i >= 0; i -= 1) {
      const day = subDays(new Date(), i);
      const key = format(day, "yyyy-MM-dd");
      result.push({
        date: format(day, "MMM d"),
        scans: countMap.get(key) || 0,
      });
    }

    return result;
  }, [data?.scans]);

  const countries = useMemo(() => {
    const countMap = new Map<string, number>();

    for (const scan of data?.scans || []) {
      const key = scan.country || "Unknown";
      countMap.set(key, (countMap.get(key) || 0) + 1);
    }

    return Array.from(countMap.entries())
      .map(([country, scans]) => ({ country, scans }))
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 8);
  }, [data?.scans]);

  const devices = useMemo(() => {
    const countMap = new Map<string, number>();

    for (const scan of data?.scans || []) {
      const key = scan.device || "unknown";
      countMap.set(key, (countMap.get(key) || 0) + 1);
    }

    return ["mobile", "tablet", "desktop", "unknown"].map((device) => ({
      device,
      scans: countMap.get(device) || 0,
    }));
  }, [data?.scans]);

  const osBreakdown = useMemo(() => {
    const countMap = new Map<string, number>();

    for (const scan of data?.scans || []) {
      const key = scan.os || "Unknown";
      countMap.set(key, (countMap.get(key) || 0) + 1);
    }

    return Array.from(countMap.entries())
      .map(([os, scans]) => ({ os, scans }))
      .sort((a, b) => b.scans - a.scans)
      .slice(0, 8);
  }, [data?.scans]);

  const recentScans = useMemo(
    () => (data?.scans || []).slice(0, 20),
    [data?.scans],
  );

  const handleDownload = async (extension: "png" | "svg") => {
    if (!trackingUrl) return;

    const instance = new QRCodeStyling({
      width: 1200,
      height: 1200,
      data: trackingUrl,
      dotsOptions: { color: "#000000", type: "square" },
      cornersSquareOptions: { color: "#000000", type: "square" },
      cornersDotOptions: { color: "#000000", type: "square" },
      backgroundOptions: { color: "#ffffff" },
      qrOptions: { errorCorrectionLevel: "M" },
      margin: 8,
    });

    await instance.download({
      name: `trackable-qr-${generateTimestamp()}`,
      extension,
    });
  };

  if (loading) {
    return (
      <main className="mx-auto flex min-h-screen w-full max-w-7xl items-center justify-center px-4 py-8">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading analytics dashboard...
        </div>
      </main>
    );
  }

  if (error || !data) {
    return (
      <main className="mx-auto min-h-screen w-full max-w-3xl px-4 py-10">
        <Card className="space-y-3 p-6">
          <h1 className="text-xl font-semibold">Dashboard not available</h1>
          <p className="text-sm text-muted-foreground">
            {error || "No data found for this token."}
          </p>
          <Link
            href="/track"
            className="text-sm font-medium underline underline-offset-4"
          >
            Create a new trackable QR code
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              QR Analytics Dashboard
            </h1>
            <p className="text-sm text-muted-foreground">
              No-login access using your private management token.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/track"
              className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-muted"
            >
              New Trackable QR
            </Link>
            <Link
              href="/"
              className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-muted"
            >
              Static Generator
            </Link>
          </div>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-2 p-4 lg:col-span-2">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Destination URL
            </p>
            <p className="break-all text-sm font-medium">{data.targetUrl}</p>
            {data.label && (
              <p className="text-sm text-muted-foreground">
                Label: <span className="text-foreground">{data.label}</span>
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Created: {format(new Date(data.createdAt), "PPpp")}
            </p>
            <div className="pt-2">
              <a
                href={data.targetUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-sm font-medium underline underline-offset-4"
              >
                Open destination
                <ExternalLink className="ml-1 h-3.5 w-3.5" />
              </a>
            </div>
          </Card>

          <Card className="space-y-3 p-4">
            <p className="text-xs uppercase tracking-wide text-muted-foreground">
              Total scans
            </p>
            <p className="text-4xl font-bold leading-none">
              {totalScans.toLocaleString()}
            </p>
            <p className="text-sm text-muted-foreground">
              All time across this QR code.
            </p>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-3">
          <Card className="space-y-3 p-4 lg:col-span-1">
            <p className="text-sm font-medium">Trackable QR Code</p>
            <QRPreview
              value={trackingUrl}
              size={220}
              darkColor="#000000"
              cornerColor="#000000"
              lightColor="#ffffff"
              includeMargin={true}
              level="M"
              dotStyle="square"
              markerBorder="square"
              markerCenter="square"
            />
            <div className="grid gap-2 sm:grid-cols-2">
              <Button onClick={() => void handleDownload("png")}>
                <Download className="mr-2 h-4 w-4" />
                PNG
              </Button>
              <Button
                variant="outline"
                onClick={() => void handleDownload("svg")}
              >
                <Download className="mr-2 h-4 w-4" />
                SVG
              </Button>
            </div>
          </Card>

          <Card className="p-4 lg:col-span-2">
            <h2 className="mb-3 text-sm font-medium">
              Scans over time (last 30 days)
            </h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <LineChart data={scansByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" minTickGap={24} />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="scans"
                    stroke="#0ea5e9"
                    strokeWidth={2}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-medium">Top countries</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={countries}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="country"
                    interval={0}
                    angle={-20}
                    textAnchor="end"
                    height={70}
                  />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="scans" fill="#22c55e" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-medium">Device breakdown</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={devices}
                    dataKey="scans"
                    nameKey="device"
                    outerRadius={100}
                    label={(item) => `${item.device}: ${item.scans}`}
                  >
                    {devices.map((entry, index) => (
                      <Cell
                        key={entry.device}
                        fill={pieColors[index % pieColors.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>

        <div className="grid gap-4 lg:grid-cols-2">
          <Card className="p-4">
            <h2 className="mb-3 text-sm font-medium">Operating systems</h2>
            <div className="h-72 w-full">
              <ResponsiveContainer>
                <BarChart data={osBreakdown} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" allowDecimals={false} />
                  <YAxis type="category" dataKey="os" width={100} />
                  <Tooltip />
                  <Bar dataKey="scans" fill="#f59e0b" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card className="p-4">
            <h2 className="mb-3 text-sm font-medium">Recent scans</h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Browser</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recentScans.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="text-muted-foreground">
                      No scans recorded yet.
                    </TableCell>
                  </TableRow>
                )}
                {recentScans.map((scan) => (
                  <TableRow key={scan.id}>
                    <TableCell>
                      {format(new Date(scan.scannedAt), "PP p")}
                    </TableCell>
                    <TableCell>{scan.country || "Unknown"}</TableCell>
                    <TableCell>{scan.city || "Unknown"}</TableCell>
                    <TableCell>{scan.device || "Unknown"}</TableCell>
                    <TableCell>{scan.browser || "Unknown"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>
        </div>
      </div>
    </main>
  );
}
