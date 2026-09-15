import type { Metadata } from "next";
import { InfoPage } from "@/components/ui/InfoPage";

export const metadata: Metadata = { title: "Returns — AFTER SIN" };

export default function ReturnsPage() {
  return (
    <InfoPage title="Returns">
      <p>
        Our return policy will publish alongside Drop 001. We&rsquo;re aiming for
        something straightforward and fair — no fine print designed to work
        against you.
      </p>
      <p>PLACEHOLDER — return window and process not yet locked.</p>
    </InfoPage>
  );
}
