// Reads migration/redirects.csv (from,to,code,reason), the source of truth for old-URL
// redirects. Path rows become Next.js redirects (next.config.ts); WordPress shortlink rows
// (/?p=ID, /?page_id=ID) are answered by the proxy, because Next.js redirects pass the query
// string through, so "/?p=4553" → "/" would loop.
export type RedirectRow = { from: string; to: string; code: number; reason: string };

/** Minimal CSV parser: quoted fields with doubled quotes, commas, and newlines inside quotes. */
export function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (quoted) {
      if (ch === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (ch === '"') quoted = false;
      else field += ch;
    } else if (ch === '"') quoted = true;
    else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n" || ch === "\r") {
      if (ch === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      if (row.some((f) => f !== "")) rows.push(row);
      row = [];
      field = "";
    } else field += ch;
  }
  row.push(field);
  if (row.some((f) => f !== "")) rows.push(row);
  return rows;
}

export function readRedirectRows(csv: string): RedirectRow[] {
  const [header, ...rows] = parseCsv(csv);
  const at = (name: string) => header.indexOf(name);
  return rows.map((r) => ({ from: r[at("from")], to: r[at("to")], code: Number(r[at("code")]) || 301, reason: r[at("reason")] ?? "" }));
}

/** "/?p=4553" → "p=4553"; null for path rows. */
export const shortlinkKey = (from: string) => {
  const m = /^\/\?(p|page_id)=(\d+)$/.exec(from);
  return m ? `${m[1]}=${m[2]}` : null;
};
