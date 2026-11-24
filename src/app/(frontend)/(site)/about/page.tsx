import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";
import { PageBanner } from "@/components/PageBanner";
import { StarsHeading, Testimonial } from "@/components/Testimonial";
import { CheckCircle } from "@/components/icons";
import { graph, ids } from "@/lib/schema";
import { site, testimonial } from "@/lib/site";

export const metadata: Metadata = {
  title: "About Rise UP Publications | Christian Book Publisher",
  description:
    "Rise UP Publications is a family-owned Christian publisher founded by Brian and Nina Paules. Meet the team that helps authors publish written manuscripts and recorded messages.",
  alternates: { canonical: "/about/" },
};

const facts = [
  "Family-owned",
  "Decade+ of Publishing",
  "Published Hundreds of Books",
  "Represent Dozens of Authors",
  "Walk and Live by Faith",
  "Involved in Global Missions",
  "Passion for Prison Ministries",
  "Passion for Evangelism",
];

const team = [
  {
    name: "Brian Paules",
    role: "Owner and Publishing Expert",
    photo: "/images/site/team-brian-paules.jpg",
    w: 800,
    h: 800,
    bio: [
      "With over a decade of publishing experience, Brian Paules is committed to helping authors craft successful books that amplify their God-given messages. Utilizing proven strategies and techniques in writing, publishing, and business, he ensures that both written and spoken works not only reach wide audiences but also bolster the ministries and unique callings of the authors. Passionate about creating enduring legacies, Brian advocates for a genuine faith that supports the poor, widows, orphans, the sick, and imprisoned, while upholding the redemptive work of Jesus as the ultimate solution to mankind’s woes.",
    ],
  },
  {
    name: "Anna Aguilar",
    role: "Operations Director and The Wearer of Many Hats",
    photo: "/images/site/team-anna-aguilar.jpg",
    w: 675,
    h: 900,
    bio: [
      "As the daughter of Rise UP founders Brian and Nina Paules, Anna has grown up in the book business with multiple different companies, including working for private libraries.",
      "Anna is passionate about spreading the Gospel of Jesus Christ. She enjoys helping authors fulfill their God-given mission and supporting them in their journey to publish books that demonstrate the transformative power of Jesus Christ! Anna understands what it’s like being in the ministry.",
      "Anna and her husband Julio are the founders and directors of a prison ministry and a humanitarian outreach ministry in Central America.",
    ],
  },
  {
    name: "Ziva",
    role: "Chief Morale Officer",
    photo: "/images/site/team-ziva.jpg",
    w: 700,
    h: 700,
    bio: [
      "Meet Ziva, the Chief Morale Officer at Rise UP Publications. With her keen German Shepherd instincts and an uncanny ability to sniff out any treats nearby, Ziva is the four-legged friend keeping spirits high around the office. Whether she’s leading the team in a spontaneous game of fetch or offering a supportive nuzzle during brainstorming sessions, her contributions are nothing short of paw-some.",
    ],
  },
];

function TeamCard({ m }: { m: (typeof team)[number] }) {
  return (
    <article className="flex h-full flex-col gap-6 rounded-[32px] bg-white p-7 shadow-[0_1px_2px_rgba(13,31,60,0.06),0_24px_50px_-30px_rgba(13,31,60,0.45)] sm:flex-row md:p-9">
      <Image src={m.photo} alt={`${m.name}, ${m.role}`} width={m.w} height={m.h} sizes="140px" className="aspect-square h-auto w-[140px] shrink-0 self-start rounded-[24px] object-cover object-top" />
      <div>
        <p className="text-[14px] font-semibold text-gold-ink">{m.role}</p>
        <h3 className="mt-1 font-display text-[26px] font-extrabold uppercase leading-[1.05] tracking-[-0.5px] text-navy md:text-[30px]">{m.name}</h3>
        <div className="mt-4 space-y-3 text-[16px] leading-[1.65]">
          {m.bio.map((p) => (
            <p key={p.slice(0, 20)}>{p}</p>
          ))}
        </div>
      </div>
    </article>
  );
}

export default function AboutPage() {
  return (
    <>
      <PageBanner>About Us</PageBanner>

      <section className="px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto grid max-w-[1320px] gap-12 lg:grid-cols-[1fr_360px] lg:gap-20">
          <div className="max-w-[760px]">
            <h2 className="font-display text-[26px] font-extrabold uppercase leading-[1.08] tracking-[-0.5px] text-navy md:text-[36px]">
              Welcome to Rise UP Publications! We are passionate about sharing the life-giving, overflowing abundance of Jesus Christ with the world through
              print books, eBooks, and audiobooks.
            </h2>
            <div className="book-copy mt-8 max-w-[68ch] [&>p:first-child]:text-[18px]">
              <p>
                My late wife, Nina, and I laid the cornerstone of this publishing house on a foundation of faith. Words wield extraordinary power&mdash; they
                can edify, inspire, and entertain in ways that comfort the soul, ignite the imagination, and reveal deep truths that mirror the teachings and
                parables of our Lord and Savior, Jesus Christ.
              </p>
              <p>
                We started this journey together on a mission to partner with Christian writers, pastors, evangelists, teachers, missionaries, online content
                creators, and others to amplify their voices and spread their God-given messages of Christ&rsquo;s redemption to the world.
              </p>
              <p>
                While most books are created from traditionally written manuscripts, we have worked diligently to overcome the biggest obstacle to writing a
                manuscript: lack of time. To my knowledge, we are unique in our ability to not just publish written manuscripts but also produce quality books
                from recorded content. This process breaks the barrier that has previously kept many great messages from ever becoming books.
              </p>
              <p>
                Today, our authors benefit from an experienced, talented, and ever-learning team of people who share your vision and mission for bringing your
                message of hope to a hungry world in Jesus&rsquo; name.
              </p>
              <p>
                Please explore our website and reach out to us to schedule a call or ask us a question. If you&rsquo;re just getting started with your writing
                career, please consider our{" "}
                <Link href="/coaching/" className="no-underline">
                  1:1 coaching sessions
                </Link>
                , where you can get one-on-one guidance with no obligation to publish with us in the future.
              </p>
              <p>Thank you for being here, and may you rise up, inspired and renewed by the Word of God!</p>
              <p>
                Brian Paules
                <br />
                <em>&mdash; Owner, Rise UP Publications</em>
              </p>
            </div>
          </div>
          <aside className="self-start rounded-[32px] bg-brand p-8 lg:sticky lg:top-28">
            <h2 className="type-kicker !text-gold">Rise UP at a glance</h2>
            <ul className="mt-6 space-y-4">
              {facts.map((f) => (
                <li key={f} className="flex items-center gap-3 font-display text-[17px] font-bold leading-[1.25] text-white">
                  <CheckCircle className="h-[22px] w-[22px] shrink-0" />
                  {f}
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </section>

      {/* Scripture pull quote over the parallax reading photo. */}
      <section className="bg-fixed-md bg-cover bg-center px-5 py-[60px] md:min-h-[480px] md:py-[110px]" style={{ backgroundImage: "url(/images/site/bg-man-reading.jpg)" }}>
        <div className="mx-auto flex max-w-[1320px] justify-end">
          <figure className="w-full max-w-[540px] rounded-[32px] bg-white/90 px-8 pb-8 pt-10 text-center shadow-[0_30px_60px_-30px_rgba(13,31,60,0.6)] backdrop-blur-sm">
            <blockquote className="font-alice text-[26px] leading-[1.1] text-blue md:text-[32px] md:leading-[1.15]">
              &ldquo;I thought it good to declare the signs and wonders that the Most High God has worked for me. How great are His signs&hellip; how mighty
              His wonders!&rdquo;
            </blockquote>
            <figcaption className="mt-[15px] font-display text-[13px] font-bold uppercase leading-[16.25px] text-blue md:text-[20px] md:leading-[25px]">Daniel 4: 2-3 NKJV</figcaption>
          </figure>
        </div>
      </section>

      <section className="bg-[#f3f6fb] px-5 py-20 lg:px-8 lg:py-28">
        <div className="mx-auto max-w-[1320px]">
          <h2 className="font-display text-[34px] font-extrabold uppercase leading-[1.02] tracking-[-1px] text-navy md:text-[48px]">Meet the team</h2>
          <div className="mt-12 grid items-stretch gap-8 lg:grid-cols-2">
            <TeamCard m={team[0]} />
            <TeamCard m={team[1]} />
          </div>
          <div className="mt-8">
            <TeamCard m={team[2]} />
          </div>
          <div className="mt-14 max-w-[760px]">
            <h3 className="font-display text-[22px] font-extrabold uppercase tracking-[-0.3px] text-navy">We work with a great team</h3>
            <p className="mt-3 text-[17px] leading-[1.65]">
              We have a dynamic team of designers, editors, proofreaders, transcriptionists, marketing pros and more on whom we rely to complete every project
              with excellence. We are thrilled to provide life-changing employment for families everywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Praying-hands photo band with the blue overlay. */}
      <div aria-hidden="true" className="bg-fixed-md relative h-[140px] bg-cover bg-center" style={{ backgroundImage: "url(/images/site/bg-praying-hands.jpg)" }}>
        <div className="absolute inset-0 bg-[rgba(11,76,158,0.66)]" />
      </div>

      <section className="bg-[#f3f6fb] px-5 py-20 lg:px-8">
        <div className="mx-auto max-w-[760px]">
          <StarsHeading withText={false} />
          <div className="mt-[20px]">
            <Testimonial t={testimonial("robyn-richardson")} />
          </div>
        </div>
      </section>

      <JsonLd
        data={graph(
          { "@type": "AboutPage", url: `${site.url}/about/`, about: { "@id": ids.org }, mainEntity: { "@id": ids.org } },
          {
            "@type": "Person",
            "@id": `${site.url}/about/#brian-paules`,
            name: "Brian Paules",
            jobTitle: "Owner",
            worksFor: { "@id": ids.org },
            image: `${site.url}/images/site/team-brian-paules.jpg`,
          },
        )}
      />
    </>
  );
}
