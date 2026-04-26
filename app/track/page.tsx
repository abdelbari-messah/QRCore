import { Metadata } from "next";
import { TrackableQRGenerator } from "@/components/trackable-qr-generator";

export const metadata: Metadata = {
  title: "Trackable QR Codes - Free QR Generator",
  description:
    "Create trackable QR codes with private dashboard analytics, including scan counts, location, device, and browser insights.",
};

export default function TrackPage() {
  return <TrackableQRGenerator />;
}
