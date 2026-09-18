"use client";

import { useState } from "react";

export function ExportCsvButton({
  filename,
  exportAction,
}: {
  filename: string;
  exportAction: () => Promise<string>;
}) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  return (
    <div>
      <button
        type="button"
        disabled={pending}
        onClick={async () => {
          setPending(true);
          setError(null);
          try {
            const csv = await exportAction();
            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename;
            a.click();
            URL.revokeObjectURL(url);
          } catch {
            setError("Couldn't export — try again.");
          } finally {
            setPending(false);
          }
        }}
        className="eyebrow h-10 shrink-0 border border-off-black px-5 transition-opacity hover:opacity-70 disabled:opacity-40"
      >
        {pending ? "…" : "EXPORT CSV"}
      </button>
      {error && <p className="eyebrow mt-2 text-red-800">{error}</p>}
    </div>
  );
}
