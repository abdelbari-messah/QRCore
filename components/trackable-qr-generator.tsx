"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import QRCodeStyling from "qr-code-styling";
import { Copy, Link2, Loader2, Moon, Sun } from "lucide-react";
import { QRPreview } from "@/components/qr-preview";
import { QRCustomization } from "@/components/qr-customization";
import { AdsSection } from "@/components/ads-section";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { generateTimestamp } from "@/lib/qr-utils";

type CreateQrResponse = {
  slug: string;
  manageToken: string;
  trackingUrl: string;
  qrCodeId: string;
};

export function TrackableQRGenerator() {
  const [targetUrl, setTargetUrl] = useState("");
  const [label, setLabel] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [trackingUrl, setTrackingUrl] = useState("");
  const [manageToken, setManageToken] = useState("");

  const [downloadSize, setDownloadSize] = useState(250);
  const [darkColor, setDarkColor] = useState("#000000");
  const [cornerColor, setCornerColor] = useState("#000000");
  const [lightColor, setLightColor] = useState("#ffffff");
  const [format, setFormat] = useState<"png" | "svg">("png");
  const [includeMargin, setIncludeMargin] = useState(true);
  const [logo, setLogo] = useState<string | undefined>(undefined);
  const [logoSize, setLogoSize] = useState(25);
  const [dotStyle, setDotStyle] = useState<
    "square" | "rounded" | "dot" | "classy" | "classy-rounded" | "extra-rounded"
  >("square");
  const [markerBorder, setMarkerBorder] = useState<
    | "square"
    | "rounded"
    | "circle"
    | "classy"
    | "classy-rounded"
    | "extra-rounded"
  >("square");
  const [markerCenter, setMarkerCenter] = useState<
    "square" | "rounded" | "dot" | "classy" | "classy-rounded" | "extra-rounded"
  >("square");
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  const previewSize = 300;
  const renderScale = 4;

  const dashboardUrl = useMemo(() => {
    if (!manageToken || typeof window === "undefined") {
      return "";
    }

    return `${window.location.origin}/dashboard/${manageToken}`;
  }, [manageToken]);

  const mapDotType = (
    style:
      | "square"
      | "rounded"
      | "dot"
      | "classy"
      | "classy-rounded"
      | "extra-rounded",
  ):
    | "square"
    | "rounded"
    | "dots"
    | "classy"
    | "classy-rounded"
    | "extra-rounded" => {
    if (style === "dot") return "dots";
    return style;
  };

  const mapMarkerBorderType = (
    style:
      | "square"
      | "rounded"
      | "circle"
      | "classy"
      | "classy-rounded"
      | "extra-rounded",
  ):
    | "square"
    | "dot"
    | "rounded"
    | "classy"
    | "classy-rounded"
    | "extra-rounded" => {
    if (style === "circle") return "dot";
    return style;
  };

  const mapMarkerCenterType = (
    style:
      | "square"
      | "rounded"
      | "dot"
      | "classy"
      | "classy-rounded"
      | "extra-rounded",
  ):
    | "square"
    | "dot"
    | "rounded"
    | "classy"
    | "classy-rounded"
    | "extra-rounded" => {
    return style;
  };

  const handleDownload = async (downloadFormat: "png" | "svg") => {
    if (!trackingUrl) return;

    const filename = `trackable-qr-${generateTimestamp()}`;

    const instance = new QRCodeStyling({
      width: downloadSize * renderScale,
      height: downloadSize * renderScale,
      data: trackingUrl,
      image: logo,
      dotsOptions: {
        color: darkColor,
        type: mapDotType(dotStyle),
      },
      cornersSquareOptions: {
        color: cornerColor,
        type: mapMarkerBorderType(markerBorder),
      },
      cornersDotOptions: {
        color: cornerColor,
        type: mapMarkerCenterType(markerCenter),
      },
      backgroundOptions: {
        color: lightColor,
      },
      qrOptions: {
        errorCorrectionLevel: "M",
      },
      imageOptions: {
        hideBackgroundDots: true,
        imageSize: Math.max(0.1, Math.min(0.5, logoSize / 100)),
        saveAsBlob: true,
        margin: 4,
      },
      margin: includeMargin ? 8 : 0,
    });

    await instance.download({
      name: filename,
      extension: downloadFormat,
    });
  };

  const handleCreate = async () => {
    setError(null);

    if (!targetUrl.trim()) {
      setError("Destination URL is required.");
      return;
    }

    setIsCreating(true);

    try {
      const response = await fetch("/api/qr/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          targetUrl: targetUrl.trim(),
          label: label.trim() || undefined,
        }),
      });

      const contentType = response.headers.get("content-type") || "";

      if (!contentType.includes("application/json")) {
        const rawBody = await response.text();
        throw new Error(
          `Server returned an unexpected response (${response.status}). ${rawBody
            .replace(/\s+/g, " ")
            .slice(0, 160)}`,
        );
      }

      const payload = (await response.json()) as
        | CreateQrResponse
        | { error?: string };

      if (!response.ok || !("trackingUrl" in payload)) {
        const message =
          "error" in payload ? payload.error : "Failed to create trackable QR";
        throw new Error(message || "Failed to create trackable QR");
      }

      setTrackingUrl(payload.trackingUrl);
      setManageToken(payload.manageToken);
    } catch (requestError) {
      setError(
        requestError instanceof Error
          ? requestError.message
          : "Unable to create trackable QR right now.",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleCopy = async (value: string) => {
    if (!value) return;
    await navigator.clipboard.writeText(value);
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);

    const html = document.documentElement;
    if (newTheme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
  };

  return (
    <div
      className={`flex min-h-screen flex-col overflow-x-hidden ${
        theme === "dark" ? "dotted-site-bg" : ""
      }`}
    >
      <header className="border-b border-border bg-transparent px-3 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between gap-4">
            <div className="min-w-0">
              <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                Trackable QR Codes
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Generate dynamic redirect links with private scan analytics.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Link
                href="/"
                className="inline-flex h-9 items-center rounded-full border border-border/70 bg-muted/70 px-4 text-sm font-medium hover:bg-muted"
              >
                Static Generator
              </Link>
              <button
                type="button"
                onClick={toggleTheme}
                role="switch"
                aria-checked={theme === "dark"}
                aria-label="Toggle theme"
                className="group inline-flex h-9 w-17 shrink-0 items-center rounded-full border border-border/70 bg-muted/70 p-1 shadow-inner transition-colors duration-300 hover:bg-muted dark:border-white/10 dark:bg-white/10 dark:hover:bg-white/15"
              >
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full transition-all duration-300 ${
                    theme === "dark"
                      ? "translate-x-8 bg-[#2f3440] text-[#e8ecf7] shadow-[0_6px_16px_rgba(0,0,0,0.35)]"
                      : "translate-x-0 bg-[#eceef3] text-[#2c303b] shadow-[0_4px_12px_rgba(15,18,28,0.18)]"
                  }`}
                >
                  {theme === "dark" ? (
                    <Moon className="h-3.5 w-3.5 fill-current" />
                  ) : (
                    <Sun className="h-3.5 w-3.5" />
                  )}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="min-h-0 flex-1 px-3 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto h-full w-full max-w-7xl space-y-4">
          <Card className="space-y-3 p-4">
            <div className="grid gap-3 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="target-url">Destination URL</Label>
                <Input
                  id="target-url"
                  placeholder="https://example.com/landing-page"
                  value={targetUrl}
                  onChange={(event) => setTargetUrl(event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="label">Label (optional)</Label>
                <Input
                  id="label"
                  placeholder="Campaign Spring 2026"
                  value={label}
                  onChange={(event) => setLabel(event.target.value)}
                />
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <Button
                onClick={handleCreate}
                disabled={isCreating || !targetUrl.trim()}
              >
                {isCreating ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Link2 className="mr-2 h-4 w-4" />
                )}
                Generate Trackable QR
              </Button>
              {trackingUrl && (
                <Button
                  variant="outline"
                  onClick={() => handleCopy(trackingUrl)}
                >
                  <Copy className="mr-2 h-4 w-4" />
                  Copy Tracking URL
                </Button>
              )}
            </div>
            {error && (
              <Alert variant="destructive">
                <AlertTitle>Unable to create QR code</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            {trackingUrl && manageToken && (
              <Alert>
                <AlertTitle>Private dashboard link</AlertTitle>
                <AlertDescription>
                  <p className="break-all">
                    {dashboardUrl || `/dashboard/${manageToken}`}
                  </p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        handleCopy(dashboardUrl || `/dashboard/${manageToken}`)
                      }
                    >
                      <Copy className="mr-2 h-4 w-4" />
                      Copy Link
                    </Button>
                    <Link
                      href={`/dashboard/${manageToken}`}
                      className="inline-flex h-9 items-center rounded-md border border-border px-3 text-sm hover:bg-muted"
                    >
                      Open Dashboard
                    </Link>
                  </div>
                  <p className="mt-2 font-medium text-foreground">
                    Save this link now. It is the only way to access your
                    analytics and cannot be recovered.
                  </p>
                </AlertDescription>
              </Alert>
            )}
          </Card>

          <div className="grid h-auto min-h-0 w-full gap-4 md:h-full md:items-stretch lg:grid-cols-2">
            <div className="flex min-h-60 items-center justify-center sm:min-h-72 md:min-h-0">
              <QRPreview
                value={trackingUrl}
                size={previewSize}
                darkColor={darkColor}
                cornerColor={cornerColor}
                lightColor={lightColor}
                includeMargin={includeMargin}
                level="M"
                logo={logo}
                logoSize={logoSize}
                dotStyle={dotStyle}
                markerBorder={markerBorder}
                markerCenter={markerCenter}
              />
            </div>
            <div className="flex w-full flex-col md:min-h-0">
              <QRCustomization
                value={trackingUrl}
                onValueChange={() => {}}
                size={downloadSize}
                onSizeChange={setDownloadSize}
                darkColor={darkColor}
                onDarkColorChange={setDarkColor}
                cornerColor={cornerColor}
                onCornerColorChange={setCornerColor}
                lightColor={lightColor}
                onLightColorChange={setLightColor}
                format={format}
                onFormatChange={setFormat}
                onDownload={handleDownload}
                includeMargin={includeMargin}
                onMarginChange={setIncludeMargin}
                logo={logo}
                onLogoChange={setLogo}
                logoSize={logoSize}
                onLogoSizeChange={setLogoSize}
                dotStyle={dotStyle}
                onDotStyleChange={setDotStyle}
                markerBorder={markerBorder}
                onMarkerBorderChange={setMarkerBorder}
                markerCenter={markerCenter}
                onMarkerCenterChange={setMarkerCenter}
              />
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-transparent">
        <div className="mx-auto max-w-7xl px-2 py-3 sm:px-2 lg:px-2">
          <AdsSection />
          <p className="pt-3 text-center text-sm text-muted-foreground">
            Scan events are stored to provide analytics for your trackable QR
            links.
          </p>
        </div>
      </footer>
    </div>
  );
}
