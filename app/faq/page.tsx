import type { Metadata } from "next";
import { InfoPage } from "@/components/ui/InfoPage";
import { Accordion } from "@/components/ui/Accordion";

export const metadata: Metadata = { title: "FAQ — AFTER SIN" };

export default function FaqPage() {
  return (
    <InfoPage title="FAQ">
      <Accordion
        items={[
          {
            title: "When does Drop 001 release?",
            content: <p>Date not yet locked. Join the list on the homepage for access.</p>,
          },
          {
            title: "Where do you ship?",
            content: <p>Canada and Mexico at launch. See Shipping for details.</p>,
          },
          {
            title: "What sizes will be available?",
            content: <p>XS–XXL on Drop 001. A full size guide will publish alongside the product.</p>,
          },
          {
            title: "How do I return an item?",
            content: <p>See the Returns page once Drop 001 ships.</p>,
          },
        ]}
      />
    </InfoPage>
  );
}
