import { SignatureMark } from "@/components/ui/SignatureMark";

/**
 * No commerce backend is wired up yet (see data/products.ts — pricing and
 * checkout aren't real). There is no order data to show, so this is an
 * honest empty state rather than a fabricated order list. The shape each
 * order will eventually need (number, date, line items with image/size/
 * color/qty, total, payment + fulfillment status, tracking) lives in this
 * comment as the contract for whoever wires up real checkout:
 *
 * interface Order {
 *   id: string;
 *   number: string;
 *   createdAt: string;
 *   items: { productSlug: string; image: string; size: string; color: string; quantity: number; price: number }[];
 *   total: number;
 *   paymentStatus: "paid" | "pending" | "refunded";
 *   fulfillmentStatus: "unfulfilled" | "shipped" | "delivered";
 *   tracking?: { carrier: string; number: string; url: string };
 * }
 */
export function OrderHistorySection() {
  return (
    <div className="flex flex-col items-center gap-4 border-t hairline py-20 text-center">
      <SignatureMark size={20} className="opacity-40" />
      <p className="eyebrow text-charcoal">No Orders Yet</p>
      <p className="max-w-[36ch] text-sm text-charcoal">
        Your consequences will appear here.
      </p>
    </div>
  );
}
