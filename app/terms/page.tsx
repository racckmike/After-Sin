import type { Metadata } from "next";
import { InfoPage } from "@/components/ui/InfoPage";

export const metadata: Metadata = { title: "Terms — AFTER SIN" };

export default function TermsPage() {
  return (
    <InfoPage title="Terms of Service">
      <p>
        Terms governing use of this site and purchases from AFTER SIN will
        publish before checkout goes live.
      </p>
      <p>PLACEHOLDER — legal copy pending counsel review.</p>
    </InfoPage>
  );
}
