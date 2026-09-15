import type { Metadata } from "next";
import { PlaceholderFrame } from "@/components/ui/PlaceholderFrame";
import { SignatureMark } from "@/components/ui/SignatureMark";

export const metadata: Metadata = { title: "About — AFTER SIN" };

export default function AboutPage() {
  return (
    <div>
      <div className="on-dark relative flex h-[56vh] min-h-[380px] w-full items-end bg-off-black text-bone">
        <PlaceholderFrame label="STUDIO IMAGE — PLACEHOLDER" tone="dark" className="absolute inset-0 h-full w-full" />
        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 pb-12 md:px-8">
          <p className="eyebrow text-soft-grey">About</p>
          <h1 className="mt-2 font-display text-5xl md:text-6xl">What Comes Next</h1>
        </div>
      </div>

      <div className="mx-auto max-w-[720px] px-4 py-20 md:py-28">
        <SignatureMark size={20} className="mb-8" />

        <p className="mb-6 text-lg leading-relaxed">
          AFTER SIN is a new fashion label, built in Toronto with an eye on Canada
          and Mexico first. We&rsquo;re not going to invent a history we don&rsquo;t
          have — this is the beginning of one.
        </p>

        <p className="mb-6 text-[15px] leading-relaxed text-charcoal">
          The name comes from an idea more than a story: what happens{" "}
          <em className="font-display not-italic text-off-black">after</em>. After a
          decision. After a mistake. After the version of yourself you&rsquo;ve
          outgrown. Consequence isn&rsquo;t a punishment — it&rsquo;s proof that
          something changed.
        </p>

        <p className="mb-6 text-[15px] leading-relaxed text-charcoal">
          That idea shapes the product, not just the copy. Every AFTER SIN piece is
          built to a standard first and a world — DARK, CORE, whatever comes
          after those — second. The worlds will keep changing. The standard
          won&rsquo;t.
        </p>

        <p className="text-[15px] leading-relaxed text-charcoal">
          Drop 001 is currently in development. Fabric, hardware and fit are being
          tested before anything goes to production — we&rsquo;d rather ship one
          exceptional piece late than a mediocre one on time.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-px bg-off-black/10 md:grid-cols-3">
        {[
          { title: "The Idea", body: "What comes after — consequence, transformation, progress." },
          { title: "The Product", body: "Heavyweight construction, custom hardware, restraint over noise." },
          { title: "The Process", body: "Sample, test, revise, approve. Nothing ships without a physical PPS." },
        ].map((b) => (
          <div key={b.title} className="bg-bone p-8">
            <p className="eyebrow mb-3 text-charcoal">{b.title}</p>
            <p className="text-sm leading-relaxed">{b.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
