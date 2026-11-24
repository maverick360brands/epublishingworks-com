// Rich text from the CMS (Lexical) rendered to the HTML the site's styles expect, plus the
// table of contents and plain-text excerpts built from that HTML.
import { convertLexicalToHTML, LinkHTMLConverter } from "@payloadcms/richtext-lexical/html";
import { pathOf, type ContentCollection } from "@/cms/paths";
import type { SerializedEditorState } from "@payloadcms/richtext-lexical/lexical";

export type TocEntry = { id: string; text: string };

const ENTITIES: Record<string, string> = { amp: "&", lt: "<", gt: ">", quot: '"', apos: "'", nbsp: " " };

/** Tags stripped (with a space after each block) and entities decoded. */
export function textOf(html: string): string {
  return html
    .replace(/<\/(p|h[1-6]|li|blockquote|td|th|tr|div)>|<br\s*\/?>/gi, "$& ")
    .replace(/<[^>]+>/g, "")
    .replace(/&(#x?[0-9a-f]+|[a-z]+);/gi, (m, code: string) => {
      if (code[0] === "#") return String.fromCodePoint(code[1].toLowerCase() === "x" ? parseInt(code.slice(2), 16) : Number(code.slice(1)));
      return ENTITIES[code.toLowerCase()] ?? m;
    });
}

// Same rule the Markdown build used, so existing #anchor links keep working.
const headingId = (text: string) =>
  text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

// "Internal link" in the editor points at a book, author, or post; link to its page.
function internalDocToHref({ linkNode }: { linkNode: { fields: { doc?: { relationTo?: string; value?: unknown } | null } } }) {
  const doc = linkNode.fields.doc;
  const value = doc?.value && typeof doc.value === "object" ? (doc.value as { slug?: unknown }) : null;
  return (value && doc?.relationTo && pathOf(doc.relationTo as ContentCollection, value)) || "/";
}

export function lexicalToHtml(data: SerializedEditorState | null | undefined): string {
  if (!data?.root) return "";
  return convertLexicalToHTML({
    data,
    disableContainer: true,
    converters: ({ defaultConverters }) => ({ ...defaultConverters, ...LinkHTMLConverter({ internalDocToHref }) }),
  });
}

/** Adds ids to H2/H3, collects H2s into a table of contents, and opens external links in a new tab. */
export function withToc(html: string): { html: string; toc: TocEntry[] } {
  const toc: TocEntry[] = [];
  const out = html
    .replace(/<h([23])([^>]*)>([\s\S]*?)<\/h\1>/g, (_, level: string, attrs: string, inner: string) => {
      const text = textOf(inner).trim();
      const id = headingId(text);
      if (level === "2") toc.push({ id, text });
      return `<h${level}${attrs.replace(/\s*id="[^"]*"/, "")} id="${id}">${inner}</h${level}>`;
    })
    .replace(/<a ([^>]*?)href="(https?:\/\/[^"]+)"([^>]*)>/g, (m, before: string, href: string, after: string) => {
      if (href.includes("epublishingworks.com") || /target=/.test(before + after)) return m;
      return `<a ${before}href="${href}"${after} target="_blank" rel="noopener">`;
    });
  return { html: out, toc };
}

/** A plain-text excerpt of about `max` characters, cut at a word boundary. */
export function excerpt(html: string, max = 155): string {
  // Tildes mark Scripture attributions ("~ Proverbs 18:21"); summaries drop them, as before.
  const text = textOf(html).replace(/~\s*/g, "").replace(/\s+/g, " ").trim();
  if (text.length <= max) return text;
  const cut = text.slice(0, max);
  return cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:.\s]+$/, "") + "…";
}
