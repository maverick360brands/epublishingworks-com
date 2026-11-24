import testimonialData from "../../content/site/testimonials.json";

// Site-wide settings and copy shared across pages. Copy and facts come from the WordPress site
// (see migration/pages/ and migration/notes.md); FAQ answers and testimonials are verbatim.

export const site = {
  name: "ePublishingWorks",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://epublishingworks.com",
  tagline: "Write, Publish, Prosper",
  homeTitle: "Publish Smarter with Higher Royalties | ePublishingWorks!",
  description:
    "Earn more while focusing on your craft. ePublishingWorks! simplifies the publishing process, offers higher royalties, and helps promote your books—all designed to put authors first.",
  /** One-paragraph description for the blog's "About us" box and /llms.txt. */
  about:
    "ePublishingWorks is an author-first independent publisher, founded in 2011 by two national bestselling authors and an entrepreneur with a love for books. We pay our authors 80% to 85% royalties and handle the business of publishing (covers, sales copy, distribution, and promotion) so they can focus on writing.",
  foundingDate: "2011",
  phone: "866-846-5123",
  phoneHref: "tel:+18668465123",
  email: "info@epublishingworks.com",
  address: { street: "644 Shrewsbury Commons Ave, Suite 249", city: "Shrewsbury", region: "PA", postalCode: "17361", country: "US" },
  ga4Id: process.env.NEXT_PUBLIC_GA_ID || "",
  // Add the brand's real social profiles here; they feed Organization.sameAs in JSON-LD.
  sameAs: [] as string[],
  logo: { src: "/images/site/logo-primary.png", width: 1200, height: 194 },
  logoReversed: { src: "/images/site/logo-primary-reversed.png", width: 1200, height: 194 },
  logoMark: { src: "/images/site/logo-icon-reversed.png", width: 500, height: 500 },
  images: {
    authorAtWork: { src: "/images/site/author-senior-laptop-kitchen.jpg", width: 1600, height: 1404, alt: "An author smiling as he types on a laptop at his kitchen table" },
  },
  // The logo links home, so the menu starts with Books.
  nav: [
    { href: "/books/", label: "Books" },
    { href: "/authors/", label: "Authors" },
    { href: "/about/", label: "About" },
    { href: "/the-advantage/", label: "The Advantage" },
    { href: "/submission-guidelines/", label: "Submissions" },
    { href: "/blog/", label: "Blog" },
    { href: "/contact/", label: "Contact" },
  ],
  footerNav: {
    authors: [
      { href: "/submit-your-manuscript/", label: "Submit Your Manuscript" },
      { href: "/submission-guidelines/", label: "Submission Guidelines" },
      { href: "/the-advantage/", label: "Our Signature Advantage" },
      { href: "/frequently-asked-questions/", label: "Frequently Asked Questions" },
      { href: "/reviews/", label: "Author Reviews" },
    ],
    explore: [
      { href: "/", label: "Home" },
      { href: "/books/", label: "Books" },
      { href: "/authors/", label: "Authors" },
      { href: "/blog/", label: "Blog" },
      { href: "/about/", label: "About" },
      { href: "/contact/", label: "Contact" },
    ],
  },
  /** Search titles and descriptions, verbatim from the live site (migration/seo-meta.csv), except the
   *  FAQ description, rewritten to match what the page answers (see migration/notes.md). */
  seo: {
    advantage: { title: "The ePublishingWorks Advantage | 80–85% Author Royalties", description: "ePublishingWorks pays 80–85% royalties — the highest in indie publishing. See how we help you write more, earn more, and reach readers worldwide." },
    guidelines: { title: "Manuscript Submission Guidelines | ePublishingWorks", description: "Ready to publish? Review our submission guidelines and send us your manuscript. We publish crime fiction, mystery, cozy mystery, and historical romance." },
    submit: { title: "Submit Your Manuscript | ePublishingWorks", description: "Ready to publish? Submit your manuscript to ePublishingWorks and take the first step toward higher royalties and wider readership." },
    about: { title: "About ePublishingWorks | Author-First Independent Publisher", description: "Founded by bestselling authors in 2011, ePublishingWorks helps career authors earn more, reach more readers, and focus on what they do best — writing." },
    authors: { title: "Our Published Authors | ePublishingWorks", description: "Meet the mystery, romance, and cozy mystery authors who trust ePublishingWorks to publish, distribute, and promote their books worldwide." },
    contact: { title: "Contact ePublishingWorks | Talk to a Publisher", description: "Questions about publishing your book? Reach out to the ePublishingWorks team. We're here to help career authors take the next step." },
    faq: { title: "Frequently Asked Questions | ePublishingWorks", description: "Get answers about submitting your manuscript, backlist titles, editing, the genres we publish, and first-time authors. Have more questions? Contact us anytime." },
    reviews: { title: "Publisher Reviews & Author Testimonials | ePublishingWorks", description: "Hear from bestselling and award-winning authors who chose ePublishingWorks. Real results, real royalties, real careers — in their own words." },
  },
};

export type Faq = { q: string; a: string; link?: { href: string; label: string } };

// The FAQ, verbatim from the WordPress site (the same six questions appeared on Home, the FAQ
// page, and Submission Guidelines). Paragraph breaks are "\n\n"; a link's label is linked where
// it appears in the answer.
export const faqs: Faq[] = [
  {
    q: "How do I submit my manuscript?",
    a: "Pretty easy peasy. Please submit your manuscript by filling out our submission form.",
    link: { href: "/submit-your-manuscript/", label: "Please submit your manuscript by filling out our submission form" },
  },
  {
    q: "Do you accept backlist titles?",
    a: "Yes, if rights have been reverted from the original publisher. Acceptance of any book is subject to review by our experienced publishing team.\n\nWe are happy to guide our authors through what that looks like.",
  },
  {
    q: "Will you edit my manuscript for me?",
    a: "We will proofread but we have limited capacity to edit manuscripts. As one of our authors, we can connect you with the right people – legends who can help you.",
  },
  {
    q: "Does my book fit your requirements?",
    a: "Great question. We'll review your manuscript to make certain.\n\nIn general, we're looking for a commercially viable writing style that meets the expectations of the genre. We prefer “evergreen” books. Serial titles with 3+ titles are preferred.",
  },
  {
    q: "What genres do you publish?",
    a: "We primarily publish crime fiction, mystery, cozy mystery, and a lot of historical romance.\n\nYes, we will consider other genres, although we do not publish erotica.\n\nFor Christian fiction and Christian non-fiction, please see our sister brand, RiseUpPublications.com",
    link: { href: "https://riseuppublications.com/", label: "RiseUpPublications.com" },
  },
  {
    q: "Do you accept first-time books from a new author?",
    a: "Yes, of course! We'll look for evidence of quality and a plan for 6+ titles. Trust us, you will want to write a series too.",
  },
];
/** The home page shows the same six. */
export const homeFaqs = faqs;

export type Testimonial = { id: string; quote: string; name: string; authorSlug?: string; photo?: string; role?: string; headline?: string };

// Verbatim from the WordPress Reviews and Home pages.
export const testimonials: Testimonial[] = testimonialData;
export const testimonial = (id: string) => testimonials.find((t) => t.id === id);
/** The four on the WordPress home page, in its order. */
export const homeTestimonials = ["alice-duncan", "jo-goodman", "jillian-david", "jeanne-glidewell"].map(testimonial).filter((t): t is Testimonial => Boolean(t));

export const authorsPageIntro = "Created by authors for authors, because ePublishingWorks! Browse every author we publish, A to Z, or by the genres they write.";

/** What the publisher is looking for (Submission Guidelines, verbatim). */
export const wantedGenres = [
  { name: "Thriller", text: "From heart-pounding psychological tales to action-packed adventures, we welcome all types of thrillers." },
  { name: "Mystery", text: "Intriguing whodunits, cozy mysteries, and every twist-filled narrative in between." },
  { name: "Romance", text: "Sweet and heartfelt love stories, as well as other sub-genres of romance." },
  { name: "Contemporary", text: "Stories that capture the spirit of today's world, from drama to light-hearted fiction." },
  { name: "Suspense", text: "Edge-of-your-seat narratives that keep readers hooked." },
  { name: "Historical", text: "Immersive tales from any era, meticulously woven with historical detail." },
  { name: "Paranormal / Fantasy", text: "Worlds where magic, the supernatural, and the extraordinary come to life." },
];
