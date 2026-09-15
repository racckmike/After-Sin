import type { Metadata } from "next";
import { InfoPage } from "@/components/ui/InfoPage";

export const metadata: Metadata = { title: "Account — AFTER SIN" };

export default function AccountPage() {
  return (
    <InfoPage title="Account">
      <p>Accounts open when Drop 001 does. PLACEHOLDER — sign-in architecture not yet built.</p>
    </InfoPage>
  );
}
