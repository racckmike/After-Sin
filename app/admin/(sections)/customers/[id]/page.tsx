import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCustomer } from "@/lib/admin/db";
import { listAddresses } from "@/lib/customer/db";

export const metadata: Metadata = { title: "Customer — AFTER SIN Admin", robots: { index: false, follow: false } };
export const dynamic = "force-dynamic";

export default async function AdminCustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const customer = await getCustomer(id);
  if (!customer) notFound();

  const addresses = await listAddresses(id);
  const name = customer.firstName || customer.lastName ? `${customer.firstName ?? ""} ${customer.lastName ?? ""}`.trim() : "Unnamed customer";

  return (
    <div>
      <p className="eyebrow text-charcoal">Customer</p>
      <h1 className="mt-2 font-display text-3xl">{name}</h1>

      <dl className="mt-8 grid gap-4 sm:grid-cols-2 sm:gap-8">
        <div>
          <dt className="eyebrow text-charcoal">Email</dt>
          <dd className="mt-1 text-sm">
            {customer.email} {customer.emailVerified ? "" : <span className="text-red-800">— not verified</span>}
          </dd>
        </div>
        <div>
          <dt className="eyebrow text-charcoal">Joined</dt>
          <dd className="mt-1 text-sm">{new Date(customer.createdAt).toLocaleDateString()}</dd>
        </div>
        <div>
          <dt className="eyebrow text-charcoal">Orders</dt>
          <dd className="mt-1 text-sm">{customer.orderCount}</dd>
        </div>
        <div>
          <dt className="eyebrow text-charcoal">Total Spent</dt>
          <dd className="mt-1 text-sm">${customer.totalSpent}</dd>
        </div>
      </dl>

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Addresses</p>
        {addresses.length === 0 ? (
          <p className="mt-3 text-sm text-charcoal">No saved addresses.</p>
        ) : (
          <div className="mt-4 flex flex-col gap-4">
            {addresses.map((a) => (
              <div key={a.id} className="border hairline p-4 text-sm leading-relaxed">
                <p className="font-display text-base">
                  {a.fullName} {a.isDefault && <span className="eyebrow ml-2 text-charcoal">Default</span>}
                </p>
                <p>{a.line1}</p>
                {a.line2 && <p>{a.line2}</p>}
                <p>
                  {a.city}, {a.region} {a.postalCode}
                </p>
                <p>{a.country}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-10 border-t hairline pt-8">
        <p className="eyebrow text-off-black">Order History</p>
        <p className="mt-3 text-sm text-charcoal">No orders yet — pending payment integration.</p>
      </div>
    </div>
  );
}
