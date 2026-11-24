import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import { redirectDeleted, rememberPublishedAddress, trackAddress } from "../hooks/redirects";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { clampHeadingLevels, editorWithHeadings } from "../editor";
import { pageAddressField } from "../fields/pageAddress";
import { seoField } from "../fields/seo";

export const POST_CATEGORIES = ["Publishing", "Writing", "Royalties & Rights", "Book Marketing", "For Readers"];

export const Posts: CollectionConfig = {
  slug: "posts",
  admin: { useAsTitle: "title", defaultColumns: ["title", "category", "date", "_status", "updatedAt"] },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: {
    beforeChange: [rememberPublishedAddress],
    afterChange: [trackAddress("posts"), revalidateAfterChange],
    afterDelete: [redirectDeleted("posts"), revalidateAfterDelete],
  },
  versions: { drafts: true },
  fields: [
    { name: "title", type: "text", required: true },
    pageAddressField({ source: "title", kind: "post" }),
    { name: "description", type: "textarea", required: true, admin: { description: "One or two sentences shown under the title and in Google." } },
    {
      name: "summary",
      type: "textarea",
      required: true,
      label: "In short",
      admin: { description: "The direct answer, in 2–3 sentences. It appears in a box at the top of the post, and answer engines quote it." },
    },
    {
      name: "cover",
      type: "upload",
      relationTo: "media",
      label: "Cover photo",
      admin: {
        description: "Shown at the top of the post, on blog cards, and when the post is shared. Landscape, at least 1600 px wide. Leave empty to use the category artwork.",
      },
    },
    { name: "body", type: "richText", editor: editorWithHeadings(["h2", "h3"], { tables: true }), hooks: { beforeValidate: [clampHeadingLevels("h2", "h3")] } },
    {
      name: "faqTip",
      type: "ui",
      admin: { components: { Field: "/cms/admin/FaqTip#FaqTip" } },
    },
    {
      name: "faqs",
      type: "array",
      label: "FAQs",
      labels: { singular: "FAQ", plural: "FAQs" },
      fields: [
        { name: "q", type: "text", required: true, label: "Question" },
        { name: "a", type: "textarea", required: true, label: "Answer" },
      ],
    },
    { name: "category", type: "select", required: true, defaultValue: "Publishing", options: POST_CATEGORIES, admin: { position: "sidebar" } },
    { name: "date", type: "date", admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } } },
    { name: "updated", type: "date", label: "Updated date", admin: { position: "sidebar", date: { pickerAppearance: "dayOnly" } } },
    { name: "authorName", type: "text", label: "Author", defaultValue: "ePublishingWorks", admin: { position: "sidebar" } },
    { name: "tags", type: "text", hasMany: true, admin: { position: "sidebar" } },
    seoField(),
  ],
};
