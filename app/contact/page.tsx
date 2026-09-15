import type { Metadata } from "next";
import { InfoPage } from "@/components/ui/InfoPage";

export const metadata: Metadata = { title: "Contact — AFTER SIN" };

export default function ContactPage() {
  return (
    <InfoPage title="Contact">
      <p>
        For order, product or press inquiries, reach us at{" "}
        <a href="mailto:hello@aftersin.com" className="underline underline-offset-4 text-off-black">
          hello@aftersin.com
        </a>
        . PLACEHOLDER — inbox not yet live.
      </p>
      <p>We&rsquo;re a small team building out of Toronto. Replies may take a few days.</p>
    </InfoPage>
  );
}
