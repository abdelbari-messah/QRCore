import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service | QRCore",
  description: "Terms of Service for using QRCore and related features.",
  alternates: {
    canonical: "https://qr.example.com/terms-of-service",
  },
};

export default function TermsOfServicePage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Terms of Service
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective date: April 15, 2026
          </p>
          <p className="text-muted-foreground">
            By using this website, you agree to these Terms of Service. If you
            do not agree, please do not use the service.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. Service Description</h2>
          <p className="text-muted-foreground">
            QRCore allows users to create and download QR codes in supported
            formats. Features may change at any time.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">2. Acceptable Use</h2>
          <p className="text-muted-foreground">
            You agree not to use this site for illegal, harmful, fraudulent, or
            abusive activities. You are responsible for content encoded in your
            QR codes.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">3. No Warranty</h2>
          <p className="text-muted-foreground">
            The service is provided on an "as is" and "as available" basis,
            without warranties of any kind, express or implied.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. Limitation of Liability</h2>
          <p className="text-muted-foreground">
            To the maximum extent permitted by law, the site owner is not liable
            for any indirect, incidental, or consequential damages arising from
            your use of the service.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. Third-Party Services</h2>
          <p className="text-muted-foreground">
            This website may use third-party services, including analytics and
            advertising providers. Their terms and policies may apply.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">6. Changes to Terms</h2>
          <p className="text-muted-foreground">
            These terms may be updated from time to time. Continued use of the
            website after updates means you accept the revised terms.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">7. Contact</h2>
          <p className="text-muted-foreground">
            For questions about these terms, contact the site owner through the
            project contact channels.
          </p>
        </section>

        <div className="border-t border-border pt-6">
          <Link href="/" className="text-sm underline underline-offset-4">
            Back to QRCore
          </Link>
        </div>
      </div>
    </main>
  );
}
