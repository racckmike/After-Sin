/**
 * Escapes a single CSV cell: quotes values that need it, and neutralizes
 * formula-injection payloads (=, +, -, @, tab, CR at the start of a cell —
 * the set most spreadsheet apps treat as a formula trigger) by prefixing
 * with a single quote, since these values ultimately come from public
 * form input (waitlist emails, customer names).
 */
function escapeCsvCell(value: string): string {
  let v = value;
  if (/^[=+\-@\t\r]/.test(v)) v = `'${v}`;
  if (/[",\n\r]/.test(v)) v = `"${v.replace(/"/g, '""')}"`;
  return v;
}

export function toCsv(headers: string[], rows: (string | number | null)[][]): string {
  const lines = [headers.map(escapeCsvCell).join(",")];
  for (const row of rows) {
    lines.push(row.map((cell) => escapeCsvCell(cell === null ? "" : String(cell))).join(","));
  }
  return lines.join("\r\n");
}
