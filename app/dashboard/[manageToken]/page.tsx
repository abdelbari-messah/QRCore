import { Metadata } from "next";
import { TrackableQRDashboard } from "@/components/trackable-qr-dashboard";

type DashboardPageProps = {
  params: Promise<{ manageToken: string }>;
};

export const metadata: Metadata = {
  title: "QR Analytics Dashboard",
  description: "Private analytics dashboard for your trackable QR code.",
};

export default async function DashboardPage({ params }: DashboardPageProps) {
  const { manageToken } = await params;
  return <TrackableQRDashboard manageToken={manageToken} />;
}
