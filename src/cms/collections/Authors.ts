import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import { blockAuthorDeleteWithBooks } from "../hooks/deleteGuard";
import { redirectDeleted, trackAddress } from "../hooks/redirects";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { editorWithHeadings } from "../editor";
import { pageAddressField } from "../fields/pageAddress";
import { seoField } from "../fields/seo";

export const Authors: CollectionConfig = {
  slug: "authors",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "slug", "hidden", "updatedAt"],
    components: { edit: { beforeDocumentControls: ["/cms/admin/CloseDrawerOnCreate#CloseDrawerOnCreate"] } },
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: {
    beforeDelete: [blockAuthorDeleteWithBooks],
    afterChange: [trackAddress("authors"), revalidateAfterChange],
    afterDelete: [redirectDeleted("authors"), revalidateAfterDelete],
  },
  fields: [
    { name: "name", type: "text", required: true },
    pageAddressField({ source: "name", kind: "segment" }),
    { name: "role", type: "text", label: "Tagline", admin: { description: "Optional, e.g. Author of Historical Cozy Mystery & Romance." } },
    { name: "photo", type: "upload", relationTo: "media", admin: { description: "Optional. Without a photo, the site shows the author's first book cover." } },
    { name: "website", type: "text", admin: { description: "Optional, e.g. https://example.com" } },
    { name: "bio", type: "richText", editor: editorWithHeadings(["h2", "h3", "h4", "h5"]) },
    {
      name: "order",
      type: "number",
      label: "Directory order",
      defaultValue: 50,
      admin: { position: "sidebar", description: "Lower numbers appear first on the Authors page. Ties sort by name." },
    },
    { name: "hidden", type: "checkbox", defaultValue: false, admin: { position: "sidebar", description: "Hide from the site without deleting." } },
    { name: "books", type: "join", collection: "books", on: "authors", admin: { defaultColumns: ["title", "slug", "updatedAt"] } },
    seoField(),
  ],
};
