import type { CollectionConfig } from "payload";
import { signedIn } from "../access";
import { redirectDeleted, trackAddress } from "../hooks/redirects";
import { revalidateAfterChange, revalidateAfterDelete } from "../hooks/revalidate";
import { editorWithHeadings } from "../editor";
import { pageAddressField } from "../fields/pageAddress";
import { seoField } from "../fields/seo";

const RETAILERS = ["Buy Direct", "Amazon", "Barnes & Noble", "Apple Books", "Kobo", "Google Play", "Scribd", "Audible", "Smashwords", "Books-A-Million", "Bookshop", "Walmart", "Other"];

export const GENRES = [
  "Contemporary Romance",
  "Historical Romance",
  "Romantic Suspense",
  "Paranormal & Fantasy Romance",
  "Western",
  "Mystery",
  "Cozy Mystery",
  "Thriller & Suspense",
  "Historical Fiction",
  "Fantasy & Science Fiction",
  "Young Adult",
  "Children's",
  "Literary & Women's Fiction",
  "Nonfiction",
  "Memoir & Biography",
];

export const Books: CollectionConfig = {
  slug: "books",
  admin: {
    useAsTitle: "title",
    defaultColumns: ["title", "slug", "heroFeatured", "hidden", "updatedAt"],
    components: { edit: { beforeDocumentControls: ["/cms/admin/CloseDrawerOnCreate#CloseDrawerOnCreate"] } },
  },
  access: { read: signedIn, create: signedIn, update: signedIn, delete: signedIn },
  hooks: {
    afterChange: [trackAddress("books"), revalidateAfterChange],
    afterDelete: [redirectDeleted("books"), revalidateAfterDelete],
  },
  fields: [
    { name: "title", type: "text", required: true },
    { name: "subtitle", type: "text" },
    {
      name: "authors",
      type: "relationship",
      relationTo: "authors",
      hasMany: true,
      required: true,
      minRows: 1,
      admin: { description: "Not in the list? Use + to add a new author without leaving this page." },
    },
    pageAddressField({ source: "title", kind: "book" }),
    { name: "cover", type: "upload", relationTo: "media", required: true },
    {
      type: "row",
      fields: [
        { name: "isbn", type: "text", label: "ISBN" },
        {
          name: "category",
          type: "select",
          required: true,
          defaultValue: "fiction",
          options: [
            { label: "Fiction", value: "fiction" },
            { label: "Nonfiction", value: "nonfiction" },
            { label: "Children", value: "children" },
          ],
        },
        { name: "genre", type: "select", required: true, defaultValue: "Contemporary Romance", options: GENRES, admin: { description: "Used for the genre filter on the Books page." } },
        {
          name: "language",
          type: "select",
          required: true,
          defaultValue: "en",
          options: [
            { label: "English", value: "en" },
            { label: "Spanish", value: "es" },
          ],
        },
      ],
    },
    { name: "formats", type: "select", hasMany: true, defaultValue: ["eBook"], options: ["Paperback", "Hardcover", "eBook", "Audiobook"] },
    {
      type: "row",
      fields: [
        { name: "series", type: "text" },
        { name: "seriesNumber", type: "number", label: "Number in series" },
      ],
    },
    {
      name: "retailers",
      type: "array",
      labels: { singular: "Retailer link", plural: "Retailer links" },
      admin: { description: "The first link becomes the main buy button." },
      fields: [
        { name: "name", type: "select", required: true, options: RETAILERS },
        { name: "url", type: "text", required: true, label: "Link" },
      ],
    },
    { name: "description", type: "richText", editor: editorWithHeadings(["h2", "h3", "h4", "h5"]) },
    { name: "summary", type: "textarea", admin: { description: "Optional short description for book lists. Leave blank to use the start of the description." } },
    {
      name: "heroFeatured",
      type: "checkbox",
      label: "Feature in home hero",
      defaultValue: false,
      admin: { position: "sidebar", description: "Show this cover on the home page book wall and first on the Books page." },
    },
    { name: "hidden", type: "checkbox", defaultValue: false, admin: { position: "sidebar", description: "Hide from the site without deleting." } },
    seoField(),
  ],
};
