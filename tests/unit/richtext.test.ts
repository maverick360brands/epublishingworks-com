import { describe, expect, it } from "vitest";
import { excerpt, lexicalToHtml, textOf, withToc } from "@/lib/richtext";

describe("withToc", () => {
  const { html, toc } = withToc('<h2>Step 1: Know your message</h2><p><a href="https://example.com">x</a> <a href="/the-advantage/">y</a> <a href="https://epublishingworks.com/books/">z</a></p><h3>Detail</h3>');

  it("lists H2s in the table of contents with the same ids as before", () => {
    expect(toc).toEqual([{ id: "step-1-know-your-message", text: "Step 1: Know your message" }]);
    expect(html).toContain('<h2 id="step-1-know-your-message">Step 1: Know your message</h2>');
  });

  it("gives H3s ids too, without listing them", () => {
    expect(html).toContain('<h3 id="detail">Detail</h3>');
  });

  it("opens external links in a new tab, and leaves the site's own links alone", () => {
    expect(html).toContain('<a href="https://example.com" target="_blank" rel="noopener">x</a>');
    expect(html).toContain('<a href="/the-advantage/">y</a>');
    expect(html).toContain('<a href="https://epublishingworks.com/books/">z</a>');
  });

  it("builds ids from the heading text, ignoring markup and entities", () => {
    expect(withToc("<h2>Who&#39;s it <strong>for</strong>?</h2>").toc).toEqual([{ id: "who-s-it-for", text: "Who's it for?" }]);
  });
});

describe("excerpt", () => {
  const long = `<p>${"word ".repeat(60).trim()}</p>`;
  it("cuts at a word boundary and ends with an ellipsis", () => {
    const e = excerpt(long);
    expect(e.length).toBeLessThanOrEqual(156);
    expect(e.endsWith("word…")).toBe(true);
  });
  it("drops attribution tildes, as the Markdown summaries did", () => {
    expect(excerpt('<p>"Be strong." ~Joshua 1:9 and ~ Jesus</p>')).toBe('"Be strong." Joshua 1:9 and Jesus');
  });
  it("returns short text unchanged, without tags", () => {
    expect(excerpt("<p>Short <em>and</em> sweet.</p>")).toBe("Short and sweet.");
  });
});

describe("lexicalToHtml", () => {
  it("returns an empty string for empty content", () => {
    expect(lexicalToHtml(null)).toBe("");
  });
  it("renders paragraphs and headings", () => {
    const data = {
      root: {
        type: "root",
        version: 1,
        direction: null,
        format: "",
        indent: 0,
        children: [
          { type: "heading", tag: "h2", version: 1, direction: null, format: "", indent: 0, children: [{ type: "text", text: "Title", version: 1, detail: 0, format: 0, mode: "normal", style: "" }] },
          { type: "paragraph", version: 1, direction: null, format: "", indent: 0, textFormat: 0, children: [{ type: "text", text: "Body", version: 1, detail: 0, format: 1, mode: "normal", style: "" }] },
        ],
      },
    };
    const html = lexicalToHtml(data as never);
    expect(html).toContain("<h2");
    expect(html).toContain("Title</h2>");
    expect(html).toContain("<strong>Body</strong>");
  });
});

describe("textOf", () => {
  it("keeps a space between paragraphs, headings, and list items", () => {
    expect(textOf("<p>Provider?</p><p>Benjamin</p><h2>Next</h2><ul><li>One</li><li>Two</li></ul>").replace(/\s+/g, " ").trim()).toBe("Provider? Benjamin Next One Two");
  });
});

describe("internal links", () => {
  const link = (doc: object) => ({
    root: {
      type: "root", version: 1, direction: null, format: "", indent: 0,
      children: [{ type: "paragraph", version: 1, direction: null, format: "", indent: 0, textFormat: 0, children: [
        { type: "link", version: 3, direction: null, format: "", indent: 0, fields: { linkType: "internal", newTab: false, doc }, children: [{ type: "text", text: "See it", version: 1, detail: 0, format: 0, mode: "normal", style: "" }] },
      ] }],
    },
  });
  it("link to the book, author, or post page", () => {
    expect(lexicalToHtml(link({ relationTo: "books", value: { id: 3, slug: "provider" } }) as never)).toContain('href="/provider/"');
    expect(lexicalToHtml(link({ relationTo: "authors", value: { id: 1, slug: "angeladams" } }) as never)).toContain('href="/authors/angeladams/"');
    expect(lexicalToHtml(link({ relationTo: "posts", value: { id: 9, slug: "how-to" } }) as never)).toContain('href="/blog/how-to/"');
  });
});

describe("excerpt from several blocks", () => {
  it("ends a block without punctuation with a full stop instead of running on", () => {
    expect(excerpt("<h2>Los Angeles, California, 1927</h2><p>Mercy Allcutt is bored.</p>")).toBe("Los Angeles, California, 1927. Mercy Allcutt is bored.");
    expect(excerpt("<p>A cozy mystery!</p><p>Book two.</p>")).toBe("A cozy mystery! Book two.");
  });
  it("skips link labels that say nothing about the book", () => {
    expect(excerpt('<p>Read an <a href="https://example.com/x">excerpt</a></p>')).toBe("");
    expect(excerpt("<p>Read the Excerpt</p><p>The real description.</p>")).toBe("The real description.");
    expect(excerpt('<p><a href="https://example.com/x">Buy now</a></p><p>Story.</p>')).toBe("Story.");
  });
  it("keeps paragraphs that merely start and end with links", () => {
    expect(excerpt('<p><a href="/a/">Ann</a> and <a href="/b/">Bo</a></p>')).toBe("Ann and Bo");
  });
});

describe("excerpt datelines", () => {
  it("drops the dashes or asterisks framing a dateline before ending it with a full stop", () => {
    expect(excerpt("<p>--Montana Badlands, 2020--</p><p>Story.</p>")).toBe("Montana Badlands, 2020. Story.");
    expect(excerpt("<p>-- Mekong River, Vietnam, 1970 --</p><p>Story.</p>")).toBe("Mekong River, Vietnam, 1970. Story.");
    expect(excerpt("<p>** Author's Cut Edition w/Bonus Material **</p><p>Story.</p>")).toBe("Author's Cut Edition w/Bonus Material. Story.");
  });
});
