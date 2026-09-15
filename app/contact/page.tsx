import type { Metadata } from "next";
import { InfoPage } from "@/components/ui/InfoPage";

export const metadata: Metadata = { title: "Contact — AFTER SIN" };

export default function ContactPage() {
  return (
    <InfoPage title="Contact">
      <p>
        For order, product or press inquiries, reach us at{" "}
        <a
          href="mailto:contact.aftersin@gmail.com"
          className="underline underline-offset-4 text-off-black"
        >
          contact.aftersin@gmail.com
        </a>
        , or find us on{" "}
        <a
          href="https://instagram.com/aftersin.world"
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-4 text-off-black"
        >
          Instagram
        </a>
        .
      </p>
      <p>We&rsquo;re a small team building out of Toronto. Replies may take a few days.</p>
    </InfoPage>
  );
}
