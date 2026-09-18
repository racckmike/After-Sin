"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import { markShippedAction, type ActionResult } from "@/lib/admin/orderActions";

const initialState: ActionResult = {};

const CARRIERS = ["Estafeta", "DHL", "FedEx", "Correos de México"];

export function MarkShippedForm({ orderNumber }: { orderNumber: string }) {
  const router = useRouter();
  const [carrier, setCarrier] = useState(CARRIERS[0]);
  const [trackingNumber, setTrackingNumber] = useState("");
  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await markShippedAction(prev, formData);
    if (result.success || result.dataChanged) router.refresh();
    return result;
  }, initialState);

  return (
    <form action={formAction} className="mt-4 flex flex-wrap items-end gap-4">
      <input type="hidden" name="orderNumber" value={orderNumber} />
      <div>
        <label htmlFor="carrier" className="eyebrow mb-2 block text-charcoal">
          Carrier
        </label>
        <select
          id="carrier"
          name="carrier"
          value={carrier}
          onChange={(e) => setCarrier(e.target.value)}
          className="h-11 border border-off-black bg-transparent px-3 text-sm outline-none"
        >
          {CARRIERS.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label htmlFor="trackingNumber" className="eyebrow mb-2 block text-charcoal">
          Tracking Number
        </label>
        <input
          id="trackingNumber"
          name="trackingNumber"
          required
          value={trackingNumber}
          onChange={(e) => setTrackingNumber(e.target.value)}
          className="h-11 w-56 border border-off-black bg-transparent px-3 text-sm outline-none"
        />
      </div>
      <button
        type="submit"
        disabled={pending}
        className="eyebrow h-11 border border-off-black px-5 hover:opacity-70 disabled:opacity-40"
      >
        {pending ? "…" : "MARK SHIPPED"}
      </button>
      {state.error && <p className="eyebrow w-full text-red-800">{state.error}</p>}
      {state.success && <p className="eyebrow w-full text-charcoal">Shipped — confirmation email sent.</p>}
    </form>
  );
}
