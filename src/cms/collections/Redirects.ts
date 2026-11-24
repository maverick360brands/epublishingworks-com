import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";

// Old addresses and where they now point. Created automatically when a page address changes
// or an item is deleted; read-only in the admin so it's clear what happens to old links.
export const Redirects: CollectionConfig = {
  slug: "redirects",
  admin: {
    group: "Admin",
    useAsTitle: "from",
    defaultColumns: ["from", "to", "reason", "updatedAt"],
    description: "Created automatically. Old links to these addresses send visitors to the new page.",
  },
  access: { read: signedIn, create: () => false, update: () => false, delete: signedIn },
  hooks: { afterChange: [revalidateAfterChange], afterDelete: [revalidateAfterDelete] },
  fields: [
    { name: "from", type: "text", required: true, unique: true, index: true },
    { name: "to", type: "text", required: true },
    {
      name: "reason",
      type: "select",
      required: true,
      options: [
        { label: "Address changed", value: "address-changed" },
        { label: "Deleted", value: "deleted" },
      ],
    },
  ],
};
