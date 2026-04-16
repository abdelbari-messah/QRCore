"use client";

import { useState, useRef, useCallback } from "react";
import Link from "next/link";
import { QRPreview } from "./qr-preview";
import { QRCustomization } from "./qr-customization";
import { generateTimestamp } from "@/lib/qr-utils";
import { Button } from "@/components/ui/button";
import { AdsSection } from "@/components/ads-section";
import { Sun, Moon } from "lucide-react";
import QRCodeStyling from "qr-code-styling";

export function QRGenerator() {
  const [value, setValue] = useState("");
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
  const qrRef = useRef<HTMLDivElement>(null);
  const qrInstanceRef = useRef<QRCodeStyling | null>(null);
  const previewSize = 300;
  const renderScale = 4;

  const mapDotType = (
    style:
      | "square"
      | "rounded"
      | "dot"
      | "classy"
      | "classy-rounded"
      | "extra-rounded",
  ): "square" | "rounded" | "dots" | "classy" | "classy-rounded" | "extra-rounded" => {
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
  ): "square" | "dot" | "rounded" | "classy" | "classy-rounded" | "extra-rounded" => {
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
  ): "square" | "dot" | "rounded" | "classy" | "classy-rounded" | "extra-rounded" => {
    return style;
  };

  const handleInstanceReady = useCallback((instance: QRCodeStyling | null) => {
    qrInstanceRef.current = instance;
  }, []);

  const handleDownload = async (downloadFormat: "png" | "svg") => {
    if (!value) return;

    try {
      const timestamp = generateTimestamp();
      const filename = `qr-code-${timestamp}`;

      const downloadInstance = new QRCodeStyling({
        width: downloadSize * renderScale,
        height: downloadSize * renderScale,
        data: value,
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

      if (downloadFormat === "png") {
        await downloadInstance.download({
          name: filename,
          extension: "png",
        });
      } else if (downloadFormat === "svg") {
        await downloadInstance.download({
          name: filename,
          extension: "svg",
        });
      }
    } catch (error) {
      console.error("Error downloading QR code:", error);
    }
  };

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    if (typeof document !== "undefined") {
      const html = document.documentElement;
      if (newTheme === "dark") {
        html.classList.add("dark");
      } else {
        html.classList.remove("dark");
      }
    }
  };

  return (
    <div
      className={`flex h-screen flex-col overflow-hidden ${
        theme === "dark" ? "dotted-site-bg" : ""
      }`}
    >
      {/* Header */}
      <header className="border-b border-border bg-transparent px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl">
                Free QR Code Generator
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Create beautiful, customized QR codes instantly. No signup
                required. by Abdelbari Messah
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="ml-4"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="min-h-0 flex-1 px-4 py-3 sm:px-6 lg:px-8">
        <div className="mx-auto h-full w-full max-w-7xl">
          <div className="grid h-full min-h-0 w-full items-stretch gap-4 lg:grid-cols-2">
            {/* Preview Section */}
            <div
              ref={qrRef}
              className="flex min-h-0 items-center justify-center"
            >
              <QRPreview
                value={value}
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
                onInstanceReady={handleInstanceReady}
              />
            </div>

            {/* Customization Section */}
            <div className="flex min-h-0 w-full flex-col">
              <QRCustomization
                value={value}
                onValueChange={setValue}
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

      {/* Footer - Ad space */}
      <footer className="bg-transparent">
        <div className="mx-auto max-w-7xl px-2 py-3 sm:px-2 lg:px-2">
          <AdsSection />
          <div className=" pt-3">
            <p className="text-center text-sm text-muted-foreground">
              © 2024 Free QR Code Generator. QR data is not stored on our
              servers.
            </p>
            <p className="mt-1 text-center text-sm text-muted-foreground">
              <Link
                href="/privacy-policy"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Privacy Policy
              </Link>
              <span className="px-2">·</span>
              <Link
                href="/terms-of-service"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Terms of Service
              </Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
