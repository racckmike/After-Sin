import type { Metadata } from "next";
import { InfoPage } from "@/components/ui/InfoPage";

export const metadata: Metadata = { title: "Shipping — AFTER SIN" };

export default function ShippingPage() {
  return (
    <InfoPage title="Shipping">
      <p>
        AFTER SIN currently ships within <strong>Canada</strong>, with{" "}
        <strong>Mexico</strong> following shortly after launch. Rates and
        delivery windows are calculated at checkout once Drop 001 is live.
      </p>
      <p>PLACEHOLDER — final carrier, rates and delivery estimates not yet locked.</p>
    </InfoPage>
  );
}
