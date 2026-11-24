import type { GroupField } from "payload";

// Optional search and social overrides. Left blank, each value falls back to the normal
// fields (title, summary, cover or photo), so nobody has to fill these in.
export const seoField = (): GroupField => ({
  name: "seo",
  type: "group",
  label: "Search & social (optional)",
  admin: {
    description: "Leave blank to use the title, summary, and main image. Fill in only to say it differently in Google and on social media.",
  },
  fields: [
    { name: "title", type: "text", maxLength: 70, label: "Search title", admin: { description: "About 60 characters is ideal." } },
    { name: "description", type: "textarea", maxLength: 170, label: "Search description", admin: { description: "About 155 characters is ideal." } },
    { name: "image", type: "upload", relationTo: "media", label: "Social image" },
  ],
});
