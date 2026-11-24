import { EXPERIMENTAL_TableFeature, HeadingFeature, LinkFeature, lexicalEditor } from "@payloadcms/richtext-lexical";
import type { FieldHook } from "payload";

type Level = "h2" | "h3" | "h4" | "h5" | "h6";

/** A rich text editor whose heading menu offers only the given levels (optionally with tables). */
export const editorWithHeadings = (levels: Level[], opts: { tables?: boolean } = {}) =>
  lexicalEditor({
    features: ({ defaultFeatures }) => [
      ...defaultFeatures.filter((f) => f.key !== "heading" && f.key !== "link"),
      HeadingFeature({ enabledHeadingSizes: levels }),
      // Internal links can point only at things that have a page.
      LinkFeature({ enabledCollections: ["books", "authors", "posts"] }),
      ...(opts.tables ? [EXPERIMENTAL_TableFeature()] : []),
    ],
  });

type Node = { type?: string; tag?: string; children?: Node[] };

function clampHeadings(node: Node, top: Level, bottom: Level): Node {
  const next: Node = { ...node };
  if (next.type === "heading" && next.tag) {
    const n = Number(next.tag.slice(1));
    next.tag = n <= Number(top.slice(1)) ? top : n >= Number(bottom.slice(1)) ? bottom : next.tag;
  }
  if (next.children) next.children = next.children.map((c) => clampHeadings(c, top, bottom));
  return next;
}

/**
 * Keeps pasted or imported content inside the allowed heading levels (H1 becomes H2, H4–H6
 * become H3), so the page title stays the only H1 and the outline stays clean.
 */
export const clampHeadingLevels =
  (top: Level, bottom: Level): FieldHook =>
  ({ value }) =>
    value && typeof value === "object" && "root" in value ? { ...value, root: clampHeadings((value as { root: Node }).root, top, bottom) } : value;
