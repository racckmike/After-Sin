import type { Metadata } from "next";
import { InfoPage } from "@/components/ui/InfoPage";

export const metadata: Metadata = { title: "Privacy — AFTER SIN" };

export default function PrivacyPage() {
  return (
    <InfoPage title="Privacy Policy">
      <p>
        AFTER SIN respects your privacy. A full policy covering data collection,
        use and your rights will publish before checkout goes live.
      </p>
      <p>PLACEHOLDER — legal copy pending counsel review.</p>
    </InfoPage>
  );
}
