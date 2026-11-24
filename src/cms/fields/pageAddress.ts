import type { TextField } from "payload";
import { suggestBookSegment, suggestPostSlug, suggestSegment, validateSegment } from "../slugs";

type Options = { source: "title" | "name"; kind: "segment" | "book" | "post" };

// The part of the URL that belongs to this item (/spirits-adopted-alice-duncan/,
// /authors/alice-duncan/, /blog/how-to-republish-your-backlist/). Suggested when left blank:
// books from the title and first author, the way the WordPress book pages were named.
export const pageAddressField = ({ source, kind }: Options): TextField => ({
  name: "slug",
  type: "text",
  label: "Page address",
  required: true,
  unique: true,
  index: true,
  admin: {
    position: "sidebar",
    description: "Filled in from the title if left blank. Old links will redirect automatically if you change this.",
  },
  hooks: {
    beforeValidate: [
      async ({ value, data, req }) => {
        if (value) return value;
        const from = String(data?.[source] ?? "");
        if (kind === "post") return suggestPostSlug(from);
        if (kind === "segment") return suggestSegment(from);
        const first = (data?.authors as unknown[] | undefined)?.[0];
        const id = first && typeof first === "object" ? (first as { id?: unknown }).id : first;
        let authorSlug = "";
        if (id !== undefined && id !== null && req?.payload) {
          const author = await req.payload.findByID({ collection: "authors", id: id as number, depth: 0, req, overrideAccess: true }).catch(() => null);
          authorSlug = String((author as { slug?: unknown } | null)?.slug ?? "");
        }
        return suggestBookSegment(from, authorSlug);
      },
    ],
  },
  validate: (value: string | null | undefined) => {
    if (kind !== "post") return validateSegment(value ?? "");
    if (!value) return "Page address is required.";
    return /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(value) ? true : "Use lowercase letters, numbers, and hyphens only.";
  },
});
