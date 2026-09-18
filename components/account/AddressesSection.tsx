"use client";

import { useActionState, useState } from "react";
import { useRouter } from "next/navigation";
import {
  createAddressAction,
  updateAddressAction,
  deleteAddressAction,
  setDefaultAddressAction,
} from "@/lib/customer/actions";
import type { ActionResult } from "@/lib/auth/actions";
import type { CustomerAddress } from "@/lib/customer/db";

const initialState: ActionResult = {};

function inputClass() {
  return "h-12 w-full border border-off-black bg-transparent px-4 text-sm outline-none";
}

export function AddressesSection({ addresses }: { addresses: CustomerAddress[] }) {
  const [adding, setAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  return (
    <div className="flex flex-col gap-8">
      {addresses.length === 0 && !adding && (
        <p className="border-t hairline pt-8 text-sm text-charcoal">
          No addresses saved yet.
        </p>
      )}

      <div className="flex flex-col gap-6">
        {addresses.map((address) =>
          editingId === address.id ? (
            <AddressForm
              key={address.id}
              address={address}
              onDone={() => setEditingId(null)}
            />
          ) : (
            <AddressCard
              key={address.id}
              address={address}
              onEdit={() => setEditingId(address.id)}
            />
          )
        )}
      </div>

      {adding ? (
        <AddressForm onDone={() => setAdding(false)} />
      ) : (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="eyebrow h-11 self-start border border-off-black px-6 transition-opacity hover:opacity-70"
        >
          ADD ADDRESS
        </button>
      )}
    </div>
  );
}

function AddressCard({ address, onEdit }: { address: CustomerAddress; onEdit: () => void }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  return (
    <div className="border border-off-black/30 p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="text-sm leading-relaxed">
          <p className="font-display text-base">{address.fullName}</p>
          <p>{address.line1}</p>
          {address.line2 && <p>{address.line2}</p>}
          <p>
            {address.city}, {address.region} {address.postalCode}
          </p>
          <p>{address.country}</p>
          {address.phone && <p className="mt-1 text-charcoal">{address.phone}</p>}
        </div>
        {address.isDefault && <span className="eyebrow shrink-0 text-charcoal">Default</span>}
      </div>
      <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2">
        <button type="button" onClick={onEdit} className="eyebrow underline underline-offset-4">
          Edit
        </button>
        {!address.isDefault && (
          <button
            type="button"
            disabled={pending}
            onClick={async () => {
              setPending(true);
              await setDefaultAddressAction(address.id);
              router.refresh();
              setPending(false);
            }}
            className="eyebrow underline underline-offset-4 disabled:opacity-40"
          >
            Set Default
          </button>
        )}
        <button
          type="button"
          disabled={pending}
          onClick={async () => {
            setPending(true);
            await deleteAddressAction(address.id);
            router.refresh();
            setPending(false);
          }}
          className="eyebrow text-red-800 underline underline-offset-4 disabled:opacity-40"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

function AddressForm({
  address,
  onDone,
}: {
  address?: CustomerAddress;
  onDone: () => void;
}) {
  const router = useRouter();
  const action = address ? updateAddressAction : createAddressAction;
  const [state, formAction, pending] = useActionState(async (prev: ActionResult, formData: FormData) => {
    const result = await action(prev, formData);
    if (result.success) {
      router.refresh();
      onDone();
    }
    return result;
  }, initialState);

  const [fullName, setFullName] = useState(address?.fullName ?? "");
  const [phone, setPhone] = useState(address?.phone ?? "");
  const [line1, setLine1] = useState(address?.line1 ?? "");
  const [line2, setLine2] = useState(address?.line2 ?? "");
  const [city, setCity] = useState(address?.city ?? "");
  const [region, setRegion] = useState(address?.region ?? "");
  const [postalCode, setPostalCode] = useState(address?.postalCode ?? "");
  const [country, setCountry] = useState(address?.country ?? "Canada");
  const [isDefault, setIsDefault] = useState(address?.isDefault ?? false);

  return (
    <form action={formAction} className="flex flex-col gap-4 border border-off-black/30 p-5">
      {address && <input type="hidden" name="id" value={address.id} />}
      <div>
        <label htmlFor="fullName" className="eyebrow mb-2 block text-charcoal">
          Full Name
        </label>
        <input
          id="fullName"
          name="fullName"
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          required
          className={inputClass()}
        />
      </div>
      <div>
        <label htmlFor="phone" className="eyebrow mb-2 block text-charcoal">
          Phone (optional)
        </label>
        <input
          id="phone"
          name="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className={inputClass()}
        />
      </div>
      <div>
        <label htmlFor="line1" className="eyebrow mb-2 block text-charcoal">
          Address Line 1
        </label>
        <input
          id="line1"
          name="line1"
          value={line1}
          onChange={(e) => setLine1(e.target.value)}
          required
          className={inputClass()}
        />
      </div>
      <div>
        <label htmlFor="line2" className="eyebrow mb-2 block text-charcoal">
          Address Line 2 (optional)
        </label>
        <input
          id="line2"
          name="line2"
          value={line2}
          onChange={(e) => setLine2(e.target.value)}
          className={inputClass()}
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="city" className="eyebrow mb-2 block text-charcoal">
            City
          </label>
          <input
            id="city"
            name="city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            className={inputClass()}
          />
        </div>
        <div>
          <label htmlFor="region" className="eyebrow mb-2 block text-charcoal">
            Province / State
          </label>
          <input
            id="region"
            name="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            required
            className={inputClass()}
          />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="postalCode" className="eyebrow mb-2 block text-charcoal">
            Postal Code
          </label>
          <input
            id="postalCode"
            name="postalCode"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
            className={inputClass()}
          />
        </div>
        <div>
          <label htmlFor="country" className="eyebrow mb-2 block text-charcoal">
            Country
          </label>
          <select
            id="country"
            name="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
            className={`${inputClass()} appearance-none`}
          >
            <option value="Canada">Canada</option>
            <option value="Mexico">Mexico</option>
          </select>
        </div>
      </div>
      <label className="flex items-center gap-2 text-sm text-charcoal">
        <input
          type="checkbox"
          name="isDefault"
          checked={isDefault}
          onChange={(e) => setIsDefault(e.target.checked)}
        />
        Set as default address
      </label>
      {state.error && <p className="eyebrow text-red-800">{state.error}</p>}
      <div className="flex gap-4">
        <button
          type="submit"
          disabled={pending}
          className="eyebrow h-11 border border-off-black px-6 transition-opacity hover:opacity-70 disabled:opacity-40"
        >
          {pending ? "…" : "SAVE ADDRESS"}
        </button>
        <button type="button" onClick={onDone} className="eyebrow text-charcoal underline underline-offset-4">
          Cancel
        </button>
      </div>
    </form>
  );
}
