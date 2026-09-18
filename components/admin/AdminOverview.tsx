import Link from "next/link";

function Metric({ label, value, note }: { label: string; value: string; note?: React.ReactNode }) {
  return (
    <div className="border hairline p-6">
      <p className="eyebrow text-charcoal">{label}</p>
      <p className="mt-3 font-display text-3xl">{value}</p>
      {note && <p className="mt-1 text-xs text-charcoal">{note}</p>}
    </div>
  );
}

export function AdminOverview({
  waitlistCount,
  customerCount,
}: {
  waitlistCount: number;
  customerCount: number;
}) {
  const pendingNote = "Pending payment integration";

  return (
    <div>
      <p className="eyebrow text-charcoal">Overview</p>
      <h1 className="mt-2 font-display text-3xl">Business Snapshot</h1>

      <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-3">
        <Metric label="Total Sales" value="$0" note={pendingNote} />
        <Metric label="Total Orders" value="0" note={pendingNote} />
        <Metric label="Average Order Value" value="$0" note={pendingNote} />
        <Metric label="Customers" value={String(customerCount)} />
        <Metric
          label="Waitlist Members"
          value={String(waitlistCount)}
          note={
            <Link href="/admin/waitlist" className="underline underline-offset-4">
              View list
            </Link>
          }
        />
        <Metric label="Orders To Fulfill" value="0" note={pendingNote} />
      </div>

      <p className="mt-10 max-w-[60ch] text-sm leading-relaxed text-charcoal">
        Sales, order, and fulfillment numbers stay at zero until AFTER SIN has a real
        checkout/payment integration writing orders to the database — see{" "}
        <Link href="/admin/orders" className="underline underline-offset-4">
          Orders
        </Link>{" "}
        for details on what that requires.
      </p>
    </div>
  );
}
