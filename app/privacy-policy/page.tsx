import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | QRCore",
  description:
    "Privacy Policy for QRCore, including information about ads, cookies, and analytics.",
  alternates: {
    canonical: "https://qr.example.com/privacy-policy",
  },
};

export default function PrivacyPolicyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10 text-foreground sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <header className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Privacy Policy
          </h1>
          <p className="text-sm text-muted-foreground">
            Effective date: April 15, 2026
          </p>
          <p className="text-muted-foreground">
            This Privacy Policy explains what information this website may
            process and how third-party services (such as advertising and
            analytics) may use cookies or similar technologies.
          </p>
        </header>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">1. QR Code Content</h2>
          <p className="text-muted-foreground">
            QR code text and settings are generated in your browser. We do not
            intentionally store your QR content on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">2. Advertising</h2>
          <p className="text-muted-foreground">
            This site may display ads provided by Google AdSense. Google and its
            partners may use cookies to serve ads based on your prior visits to
            this and other websites.
          </p>
          <p className="text-muted-foreground">
            You can learn more about how Google uses data here:{" "}
            <a
              href="https://policies.google.com/technologies/ads"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-4"
            >
              How Google uses information from sites or apps that use our
              services
            </a>
            .
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">3. Cookies and Consent</h2>
          <p className="text-muted-foreground">
            Cookies or local storage may be used for website functionality,
            measurement, and advertising. Where required by law, we request
            consent before non-essential cookies are used.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">4. Analytics</h2>
          <p className="text-muted-foreground">
            We may use website analytics tools to understand performance and
            improve user experience. These tools may collect technical data such
            as pages visited, browser type, and approximate location.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">5. Third-Party Links</h2>
          <p className="text-muted-foreground">
            This site may contain links to third-party websites. We are not
            responsible for the privacy practices of those sites.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">6. Changes to This Policy</h2>
          <p className="text-muted-foreground">
            We may update this Privacy Policy from time to time. Updates will be
            posted on this page with a revised effective date.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-xl font-semibold">7. Contact</h2>
          <p className="text-muted-foreground">
            If you have questions about this policy, you can contact the site
            owner through the project contact channels.
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
