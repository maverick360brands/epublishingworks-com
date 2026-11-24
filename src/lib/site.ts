import testimonialData from "../../content/site/testimonials.json";

// Site-wide settings and copy that is shared across pages.
// Copy here was migrated verbatim (or lightly cleaned) from the WordPress site.

export const site = {
  name: "Rise UP Publications",
  shortName: "Rise UP",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://riseuppublications.com",
  tagline: "Christian publisher of books, eBooks, and audiobooks",
  description:
    "Rise UP Publications is a family-owned Christian book publisher helping pastors, teachers, evangelists, and novelists publish print books, eBooks, and audiobooks — from a written manuscript or from sermons, podcasts, and videos.",
  phone: "866-846-5123",
  phoneHref: "tel:+18668465123",
  founder: "Brian Paules",
  foundingNote: "Family-owned · Over a decade of publishing",
  ga4Id: process.env.NEXT_PUBLIC_GA_ID || "",
  calendly: {
    oneHour: "https://calendly.com/brianpaules/1-hour-coaching-session",
    twoHour: "https://calendly.com/brianpaules/2-hour-coaching-session",
    quickConnect: "https://calendly.com/anna-riseup/30-minute-quick-connect",
  },
  // Add the brand's real social profiles here; they feed Organization.sameAs in JSON-LD.
  sameAs: [] as string[],
  // The logo links home, so the menu starts with Books.
  nav: [
    { href: "/books/", label: "Books" },
    { href: "/authors/", label: "Authors" },
    { href: "/coaching/", label: "Coaching" },
    { href: "/reviews/", label: "Reviews" },
    { href: "/blog/", label: "Blog" },
    { href: "/about/", label: "About" },
    { href: "/contact/", label: "Contact" },
  ],
};

export type Faq = { q: string; a: string; link?: { href: string; label: string } };

// From the home page FAQ, verbatim. "How should I edit my manuscript?" appeared twice on
// the WordPress site with two different answers; they are merged into one entry here.
export const faqs: Faq[] = [
  {
    q: "Are you the publisher for me?",
    a: "We work with authors who have a Christ-centered message/story, purpose, and vision. If that's you, then yes. Want to learn more?",
    link: { href: "/contact/", label: "Contact Us" },
  },
  {
    q: "Does my book fit your requirements?",
    a: "We welcome the opportunity to discuss your book and your objectives in more detail. Together, we can determine if your book is a good fit for us. In general, we are looking for books with an audience and writers with the skill and drive to produce quality work that readers will eagerly consume.",
    link: { href: "/contact/", label: "Contact Us" },
  },
  {
    q: "What is a 'Christian' publisher?",
    a: "We publish content that appeals to a Christian audience. This ranges from Christian teaching materials to quality entertainment that respects Christian values.",
  },
  {
    q: "Can I trust you with my book?",
    a: "Many globally recognized teachers, preachers, and evangelists as well as fiction authors and YouTube content producers trust us with their words, and you can too. We take what we do very seriously. Take a look at our list of \u201creal people\u201d authors!",
    link: { href: "/authors/", label: "Our Authors" },
  },
  {
    q: "How should I edit my manuscript?",
    a: "We recommend that you do the best you can without obsessing over the tools and process. Depending on the level of editing needed, we have capable editors for nonfiction and can connect you with an editor for your fiction work. This is a topic best addressed on an individual case basis, so feel free to schedule a 1:1 consulting session to receive the most relevant guidance for your situation.",
    link: { href: "/coaching/", label: "Schedule a 1:1 consulting session" },
  },
  {
    q: "How long should my book be?",
    a: "Nonfiction books are usually 6,000 to 45,000 words, while fiction works should be 65,000 to 90,000 words. These are generalities, and there are exceptions. However, before embarking upon an exception, please contact us first.",
    link: { href: "/contact/", label: "Contact Us" },
  },
  {
    q: "How do I know if my book is good enough?",
    a: "This is a common concern and not an easy question to answer because every book is unique. The best way to get started is to contact us. We can schedule a consultation meeting and provide you with honest feedback and constructive advice on your book.",
    link: { href: "/contact/", label: "Contact Us" },
  },
  {
    q: "If my book is not yet complete, is it too early to speak to a publisher?",
    a: "Experienced authors find value in discussing a book project with a publisher as early in the process as possible, ideally in the planning stage. 1:1 consulting with a knowledgeable publishing expert can save you considerable time and result in a more effective delivery of your message. Hire us for a one or two hour 1:1 consulting session to receive unbiased guidance on your project with no obligation to publish through RUP. We also have coaching sessions with our founder, Brian Paules, which will provide invaluable and in-depth knowledge giving you the edge and confidence as you take leaps forward with your book!",
    link: { href: "/coaching/", label: "1:1 consulting sessions" },
  },
  {
    q: "Am I able to purchase a block of discounted books to give as gifts or promotion?",
    a: "Yes! Rise UP Publication authors can place a wholesale order for any number of books over 15 copies and have them delivered anywhere in the world. This is great for purchasing books for friends, events, and even large ministries.",
  },
  {
    q: "Can I turn my sermons or podcasts into a book?",
    a: "Probably not, but we can certainly do it for you! Many of our books are produced from recorded content that is then professionally edited and polished to read like a written book. To get started, contact us to learn more.",
    link: { href: "/contact/", label: "Contact Us" },
  },
  {
    q: "I have recorded content but it's not professional quality. Is that ok?",
    a: "As long as we can hear it and it's in a digital format, we can use the recording to create a book.",
  },
  {
    q: "Can my book become an ebook or audiobook, as well?",
    a: "We create eBooks and Paperback books from the same source files. It's extremely rare that we do not create both versions of a title. Audiobooks are a separate issue that involves a narrator reading your book and a sound engineer creating special files. Usually, we release audiobooks after the book is released in print and ebook. However, audiobook is not appropriate for every book.",
  },
  {
    q: "Does Rise UP have an editor I can work with?",
    a: "If you publish your book with us, we have in-house editing capability for non-fiction content. We can usually help you find someone to help with fiction content as fiction requires a very diverse skill set.",
  },
];

export type Testimonial = { id: string; quote: string; name: string; authorSlug?: string; photo?: string };

// Verbatim from the WordPress Reviews page (only missing sentence spaces were fixed).
export const testimonials: Testimonial[] = testimonialData;
export const testimonial = (id: string) => testimonials.find((t) => t.id === id)!;

export const benefits = [
  "A Publisher that Shares Their Faith and Passion",
  "A Reliable and Responsive Publishing Team",
  "Retained Ownership Rights of Their Book(s)",
  "Professional Editing & Proofreading",
  "Pro Layout & Design for eBooks & Paperbacks",
  "Landing Pages with Sales Links",
  "Options for Wholesale Paperback Purchase",
  "Flexible Royalty Options",
  "Sales & Marketing Copy Development",
  "Worldwide Distribution of Paperback & eBooks",
];

export const fictionGenres = [
  "Christian Thriller",
  "Christian Mystery",
  "Christian Suspense",
  "Christian Romance",
  "Christian Military Romance",
  "Christian Historical Fiction",
  "Christian Young Adult",
  "Christian Allegory (Truth through Story)",
];

export const nonfictionGenres = ["Evangelism", "Christian Living", "True Stories", "Inspirational stories and teaching", "Discipleship", "Teaching"];
