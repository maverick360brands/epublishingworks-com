# Catalog migration report: authors and books

Source: the WordPress export (WXR) for structure and attachment URLs, plus the live author pages fetched on 2026-11-24 for buy buttons and for the text itself (see "Live vs export"). Scripts and caches live outside the repo, in the session scratchpad.

## Counts

| | |
|---|---|
| Author pages (`/authors/<slug>/`, WXR parent 4639) | 57 |
| Author files written | 57 |
| Book slots on the live author pages | 512 |
| Book files written | 510 (512 slots minus 2 duplicate slots; the 3 landing-page books are merged into their author-page entries) |
| Featured (landing-page) books | 3 |
| Books with at least one buy link | 491 |
| Books with no buy link | 19 |
| Buy links written | 2072 (Barnes & Noble 455, Amazon 450, Kobo 425, Google Play 377, Apple Books 339, Scribd 20, Other 6) |
| ISBNs (from cover file names) | 22 |
| Author photos | 56 of 57 |
| Images written | 566 JPEGs, largest 106 KB |
| Nonfiction books | 12 |

Genres: Historical Romance 175, Cozy Mystery 84, Contemporary Romance 72, Mystery 45, Romantic Suspense 34, Thriller & Suspense 32, Paranormal & Fantasy Romance 31, Fantasy & Science Fiction 16, Nonfiction 8, Young Adult 4, Literary & Women's Fiction 4, Memoir & Biography 4, Historical Fiction 1.

**The brief said 64 author pages; there are 57.** The WXR has 57 published pages under parent 4639, the live `page-sitemap.xml` lists the same 57, and the live `/authors/` index shows 70 author cards that resolve to the same 57 pages (some authors appear in several genre sections, and pen names get their own card). No author page is missing.

## Books with no buy links

| Title | Author page | File | Why |
|---|---|---|---|
| Texas Wildcat | Adrienne deWolfe | `texas-wildcat-adrienne-dewolfe` | all 6 buttons are `#` placeholders |
| Liberty Unleashed | Alicia Dean | `liberty-unleashed-alicia-dean` | no buttons on the live page |
| A Fair Isle Murder | Ann Yost | `a-fair-isle-murder-ann-yost` | no buttons on the live page |
| Bad Medicine | Eileen Dreyer / Kathleen Korbel | `bad-medicine-eileen-dreyer-kathleen-korbel` | all 6 buttons are `#` placeholders |
| Moon on the Water | Elizabeth Grayson | `moon-on-the-water-elizabeth-grayson` | no buttons on the live page |
| Take Me I'm Yours | Gael Morrison | `take-me-im-yours-gael-morrison` | all 6 buttons are `#` placeholders |
| Dinner with a Bad Boy | Jade Lee/Kathy Lyons | `dinner-with-a-bad-boy-jade-lee` | all 5 buttons have an empty href |
| Forever in My Heart | Jo Goodman | `forever-in-my-heart-jo-goodman` | every link on the page belonged to another book and was dropped or moved (see below) |
| With All My Heart | Jo Goodman | `with-all-my-heart-jo-goodman` | every link on the page belonged to another book and was dropped or moved (see below) |
| The Caley Cove Series | Kay Gregory | `the-caley-cove-series-kay-gregory` | all 6 buttons are `#` placeholders |
| Married To A Stranger | Kay Gregory | `married-to-a-stranger-kay-gregory` | all 6 buttons are `#` placeholders |
| Christmas Presents | Marilyn Campbell | `christmas-presents-marilyn-campbell` | every link on the page belonged to another book and was dropped or moved (see below) |
| Heaven in a Wildflower | Patricia Hagan | `heaven-in-a-wildflower-patricia-hagan` | all 6 buttons are `#` placeholders |
| The Devil's Caldera | Patrick Astre | `the-devils-caldera-patrick-astre` | no buttons on the live page |
| Defiant Destiny | Phoebe Conn / P.J. Conn | `defiant-destiny-phoebe-conn-2` | no buttons on the live page |
| Savage Alliance | R.T. Wolfe | `savage-alliance-r-t-wolfe` | every link on the page belonged to another book and was dropped or moved (see below) |
| Barbarcia | Richard Bowker | `barbarcia-richard-bowker` | no buttons on the live page |
| Dead Silent | S.L. Menear | `dead-silent-sl-menear` | every link on the page belonged to another book and was dropped or moved (see below) |
| A Conspiracy to Murder, 1865 | T.L.B. Wood | `a-conspiracy-to-murder-1865-tlb-wood` | every link on the page belonged to another book and was dropped or moved (see below) |

Also partly placeholder: Love Slave (Mallory Rush) has a `#` Kobo button; Lover's Knot (Louise Clark) and Some Time Away (Marilyn Campbell) had only `#` buttons and now carry links moved from the neighbouring book (below). Liberty Unleashed, The Devil's Caldera and Barbarcia have no description either, only a "Read an excerpt" link to `ebookdiscovery.leadpages.co` (kept verbatim; that host could not be checked from here).

## Authors without a photo

- **T.M. Simmons** (`tm-simmons`): no photo in the export or on the live page; `photo: ""`. The `/authors/` index card uses a book cover (`T.M.-Simmons-Dead-Man-Hand.jpg`) as her image.

## Duplicate, pen-name and co-authored books

- jeanne-glidewell: two different books titled 'Lexie Starr Cozy Mystery Boxset' (series lines differ); slug lexie-starr-cozy-mystery-boxset-books-1-3-jeanne-glidewell uses its line 'Books 1-3'.
- jeanne-glidewell: two different books titled 'Lexie Starr Cozy Mystery Boxset' (series lines differ); slug lexie-starr-cozy-mystery-boxset-books-4-6-jeanne-glidewell uses its line 'Books 4-6'.
- jo-goodman: slot 17 'More Than You Know' not exported as a separate book. Exact duplicate of slot 15 (same cover, description and links).
- susan-king: slot 12 'Laird of Twilight' not exported as a separate book. Duplicate of slot 6 'Laird of the Wind' (Celtic Nights): same cover file and identical description; its H3 reads 'Laird of Twilight' and its buttons are copies of The Heather Moon's links. The Whisky Lairds titles below it are shifted by one (see the title corrections below).
- The 3 standalone landing pages (`/spirits-adopted-alice-duncan/`, `/celluloid-angels-alice-duncan/`, `/dancing-angels-alice-duncan/`) are the same books as Alice Duncan's author-page entries. One file each, with the WordPress slug, `url` set to the landing path, `featured: true`, the landing page's lead line plus description as the body, its cover, and its buttons first. Author-page links for a retailer the landing page lacks are appended. Where both pages link the same retailer, the landing page's link is kept:
  - celluloid-angels-alice-duncan: landing page cover Alice-Duncan-Celluloid-Angels.jpeg used (author page shows Alice_Duncan_Celluloid_Angels.jpg).
  - celluloid-angels-alice-duncan: author-page links not on the landing page appended: [('Apple Books', 'https://books.apple.com/us/book/celluloid-angels-a-mercy-allcutt-mystery-book-9/id6462937494?ign-itscg=30200&ign-itsct=books_box_link')]
  - dancing-angels-alice-duncan: landing page cover 9781644577745-1-scaled.jpg used (author page shows 9781644577745.jpg).
  - dancing-angels-alice-duncan: author-page links not on the landing page appended: [('Kobo', 'https://www.kobo.com/us/en/ebook/dancing-angels-a-mercy-allcutt-mystery-book-10'), ('Barnes & Noble', 'https://www.barnesandnoble.com/w/dancing-angels-alice-duncan/1145941283?ean=9781644577745'), ('Google Play', 'https://play.google.com/store/books/details/Alice_Duncan_Dancing_Angels_A_Mercy_Allcutt_Myster?id=45kREQAAQBAJ')]
  - celluloid-angels-alice-duncan: second Apple Books link dropped (https://books.apple.com/us/book/celluloid-angels-a-mercy-allcutt-mystery-book-9/id6462937494?ign-itscg=30200&ign-itsct=books_box_link); kept https://books.apple.com/us/book/celluloid-angels-a-mercy-allcutt-mystery-book-9/id6462937494?itsct=books_box_link&itscg=30200&ls=1.
  - dancing-angels-alice-duncan: second Kobo link dropped (https://www.kobo.com/us/en/ebook/dancing-angels-a-mercy-allcutt-mystery-book-10); kept https://www.kobo.com/us/en/ebook/dancing-angels-a-mercy-allcutt-mystery-book-10?sId=00e31b7b-6730-40ce-a55a-dc4c9a1d3ab2&ssId=pSi-pJNa-9K6FB1gRlaN_&cPos=1.
  - dancing-angels-alice-duncan: second Barnes & Noble link dropped (https://www.barnesandnoble.com/w/dancing-angels-alice-duncan/1145941283?ean=9781644577745); kept https://www.barnesandnoble.com/w/dancing-angels-alice-duncan/1145941283?ean=9781644577752.
  - dancing-angels-alice-duncan: second Google Play link dropped (https://play.google.com/store/books/details/Alice_Duncan_Dancing_Angels_A_Mercy_Allcutt_Myster?id=45kREQAAQBAJ); kept https://play.google.com/store/books/details/Alice_Duncan_Dancing_Angels_A_Mercy_Allcutt_Myster?id=l-FkEQAAQBAJ&hl=en_US.
- No title appears on two different author pages, so no book is shared between author files.
- Pen-name pages (one person, one author file each):
  - `eileen-dreyer-kathleen-korbel`: name shown as "Eileen Dreyer / Kathleen Korbel". All 10 books carry the byline **Eileen Dreyer**, including the five "Korbel Classic Romance" titles, because their cover files and Google Play links name Eileen Dreyer.
  - `jade-lee` ("Jade Lee/Kathy Lyons"): byline **Kathy Lyons** for Seducing the Sceptic, Rock Hard, Rock Candy, Night Studies and Dinner with a Bad Boy (cover files `Kathy_Lyons_*`, B&N and Google Play name Kathy Lyons); **Jade Lee** for the other 24. The index's separate "Kathy Lyons" card links to this page.
  - `phoebe-conn-2` ("Phoebe Conn / P.J. Conn"): every book is published as Phoebe Conn. The index lists "P.J. Conn" under Mystery, but the page has no P.J. Conn titles. URL kept as `/authors/phoebe-conn-2/`; there is no other Phoebe Conn page in the export.
- Co-authored, as far as the page shows:
  - *Come Rain or Come Shine* (Linda Hale Bucklin): the description says it was written by Linda and "Mary"; Mary's surname isn't given anywhere, so the byline stays Linda Hale Bucklin.
  - *Life, Love & Laughter* (S.L. Menear): an anthology ("the authors' adventurous exploits"). The other contributors aren't named, so the byline stays S.L. Menear.

## Other unusual pages

- `/authors/sl_menear/`: file `sl-menear.md`, `url: "/authors/sl_menear/"` per the brief. **Conflict:** `migration/redirects.csv` (written by another agent) has `/authors/sl_menear/ -> /authors/sl-menear/`, whereas the repo's `scripts/build-content.mjs` accepts the underscore URL ("they stay as they were"). Whoever owns routing should pick one. I did not edit `redirects.csv`.
- `/authors/sjmaciver/` (name "S.J. MacIver"), `/authors/r-t-wolfe/` (WP title "R-T-Wolfe", H2 "R.T. Wolfe") and `/authors/phoebe-conn-2/`: nothing special beyond the slug; `name` is the page's H2.
- `kathleen-giles-seidel`: the H2 spells the name **Gilles**-Seidel and the slug spells it Giles. `name` follows the H2.
- Order: `order` is the author's first card on the live `/authors/` index (1 to 57, no gaps). The index has 70 cards, because authors repeat across genre sections and pen names get their own cards.
  - Index card 'Ann Yost' links to /authors/dallas-gorham/ but is ann-yost's card; counted as ann-yost.
- Websites: the first link in the bio to the author's own domain. Social profiles and group blogs don't count.
  - adrienne-dewolfe: bio links 2 sites (http://www.WritingNovelsThatSell.com, http://www.WildTexasNights.com); website = first (http://www.WritingNovelsThatSell.com); all stay linked in the bio.
  - jade-lee: bio links 2 sites (http://www.jadeleeauthor.com, http://www.KathyLyons.com); website = first (http://www.jadeleeauthor.com); all stay linked in the bio.
  - jo-beverley: website left empty. Bio links only Facebook and the Word Wenches group blog.
  - sl-menear: website left empty. Bio's 'website' link goes to http://www.newsite.twinpeaksroofing.ca (a roofing company domain); not used. Link left in bio verbatim.
  - susan-king: bio links 2 sites (http://www.susanfraserking.com, http://www.susankingbooks.com); website = first (http://www.susanfraserking.com); all stay linked in the bio.

## Live page vs export

- Both sources have the same 57 author pages, the same 512 book slots in the same order, and identical titles, series lines, cover images (all 571 `data-id`s match a WXR attachment whose URL equals the `src`), bios and descriptions once whitespace is normalised. No book exists in one source and not the other.
- **Line breaks:** the export lost every `<br>` inside paragraphs (263 single and 174 double breaks), so sentences run together ("…want to hear.But when…"). The live HTML keeps them, so **all text was taken from the live pages**: a double `<br>` becomes a paragraph break and a single `<br>` a Markdown hard break (`\` at the end of the line). A word-by-word check of every body against the live text passes, apart from the copied paragraphs removed below.
- Buy buttons exist only in the live HTML, as Thrive `tcb-button-link` anchors. No cover image links anywhere, and no Thrive click events carry a link (the only `data-tcb-events` are hover animations).
- The 3 landing pages' `content:encoded` is laid out differently from what the live page renders. The live page was used.

## Errors on the live site and how they were handled

These are publisher-side mistakes (mostly copy and paste) found by checking every retailer URL slug, cover file name and description against the title it sits under. The publisher should review each one.

### Titles and series lines corrected (values taken from the same page)

- alicia-dean: series line 'Isle of Fangs Series (Teen / Young Adult)' -> series 'Isle of Fangs Series' (parenthetical genre note dropped).
- ann-yost slot 3: title 'A Fair Isle Murder COMING SOON - 2024' -> 'A Fair Isle Murder'. H3 carries a styled 'COMING SOON - 2024' badge span; badge dropped from the title.
- ines-saint slot 4: title 'Word Games' -> 'Words With Friends'. Second book titled 'Word Games' on the page, but it is a different book: own cover (Ines-Saint-Words-With-Friends-1.jpg), different plot, and Amazon/B&N/Google Play links all name 'Words With Friends'. Title taken from the cover file name and links; publisher should confirm.
- phoebe-conn-2: series line 'Star Pilot Series (Futuristic Romance)' -> series 'Star Pilot Series' (parenthetical genre note dropped).
- sharon-ihle slot 0: title 'The Proud Ones Series' -> 'The Bride Wore Feathers'. H3 and H5 are swapped on the live page (H3 'The Proud Ones Series', H5 'The Bride Wore Feathers'); cover file, description and links are The Bride Wore Feathers.
- sharon-ihle slot 0: series set to 'The Proud Ones Series' (page H5 'The Bride Wore Feathers'). H3/H5 swap (see title fix).
- sharon-ihle slot 1: series set to 'The Proud Ones Series' (page H5 'The Bride Wore Feathers'). H5 reads 'The Bride Wore Feathers' (copied from the previous book); its Kobo/Apple/Google links say 'The Proud Ones Book 2' and the page labels this pair 'The Proud Ones Series'.
- susan-king slot 13: title 'Laird of Secrets' -> 'Laird of Twilight'. H3 titles in the Whisky Lairds block are shifted by one: this slot's cover (Susan_King_Laird_of_Twilight.jpg), description and all 5 retailer links are Laird of Twilight (Whisky Lairds book 1).
- susan-king slot 14: title 'Laird of Rogues' -> 'Laird of Secrets'. Shifted H3: cover Susan_King_Laird_of_Secrets.jpg, description and all 5 links are Laird of Secrets.
- susan-king slot 15: title 'Laird of the Wind' -> 'Laird of Rogues'. Shifted H3: cover Susan_King_Laird_of_Rogues.jpg, description (Ronan MacGregor, the Whisky Laird) and all 5 links are Laird of Rogues.

Kept verbatim even though they look like typos: "Marriage & Maheym" (Jeanne Glidewell; the retailers say *Mayhem*; the slug is `marriage-and-maheym-jeanne-glidewell`), "Pretender's Games" (Louise Clark; the retailers say *Pretender's Game*), "Barbarcia" (Richard Bowker; the excerpt URL says *barbarica*), and the series name "Carlos McCrary Pivate Investigator Mysteries" (Dallas Gorham). Genre-label H5s such as "Historical Romance - Single Tile" are not series names, so `series` is empty for those books.

### Descriptions copied from another book (paragraphs removed)

- amanda-mccabe / 'A Tangled Web': removed 5 copied paragraph(s) (body now empty). Description (Kierin McKendry, Clay Holt, rigged poker game, wagon train) is identical to Barbara Ankrum's 'Holt's Gamble' and names its hero; it is not A Tangled Web's (Lessons in Temptation, Regency).
- ann-yost / 'A Fair Isle Murder': removed 1 copied paragraph(s) (body now empty). Description is identical to 'A Double Pointed Murder'.
- carol-caverly / 'Death by Doodlebug Book Series Set': removed 3 copied paragraph(s) (body now empty). Description is S.L. Menear's 'Vanished' (Samantha Starr, Blue Dragon Diamond).
- dallas-gorham / 'Sometimes You Lose': removed 3 copied paragraph(s). Plot paragraphs are identical to 'Debt of Honor' ('a debt of honor he intends to repay'); the generic series Publisher's Note is kept.
- patricia-hagan / 'Heaven in a Wildflower': removed 3 copied paragraph(s) (body now empty). Description is identical to 'Passion's Fury' (Rance Taggert / April Jennings).
- richard-bowker / 'Portal': removed 3 copied paragraph(s) (body now empty). Description is S.L. Menear's 'Dead Silent' (Jettine Jorgensen mystery).
- richard-bowker / 'Terra': removed 4 copied paragraph(s) (body now empty). Description is S.L. Menear's 'Dropped Dead' (Jettine Jorgensen mystery).

The 6 books whose body is now empty need their real description from the publisher.

### Placeholder and link-only descriptions

- jo-beverley / 'Forbidden': the WordPress author page carried "Book Description Lorem ipsum dolor sit amet…" as its description. Removed (seed, and the CMS record through migration `20261124_120000_catalog_fixes`); body now empty.
- alicia-dean / 'Liberty Unleashed', elizabeth-grayson / 'Moon on the Water', richard-bowker / 'Barbarica', patrick-astre / 'The Devil's Caldera': the description is only "Read an excerpt" (a link to an excerpt page). Kept verbatim on the page; search descriptions skip it.

TODO(dustin): real descriptions for these 11 books (the 6 above, Forbidden, and the 4 excerpt-only ones). Until then, their search description is built from the book's own record only: title, author, genre, series, and the stores it is sold at (`bookFacts` in `src/lib/seo.ts`). Paragraphs that appear in several books and are genuinely shared were kept: a series "Publisher's Note" (Marilyn Campbell, Dallas Gorham) and a Nora Roberts review quote (Eileen Dreyer).

### Buy links dropped (the URL names a different book)

- alice-duncan / 'The Daisy Gumm Majesty Box Set 2': dropped Barnes & Noble https://www.barnesandnoble.com/w/the-daisy-gumm-majesty-cozy-mystery-box-set-3-alice-duncan/1142398367?ean=9781644570944 - B&N link is Box Set 3's (same URL as the Box Set 3 button).
- alice-duncan / 'Thanksgiving Angels': dropped Kobo https://www.kobo.com/us/en/ebook/angels-of-mercy-a-mercy-allcutt-mystery-series-book-4 - Kobo link is Angels of Mercy's (same URL as that book's button).
- ann-yost / 'A Pattern for Murder': dropped Barnes & Noble https://www.barnesandnoble.com/w/spirits-unearthed-alice-duncan/1127914274?ean=9781947833371 - B&N link points to Alice Duncan's Spirits Unearthed.
- dallas-gorham / 'The Carlos McCrary PI, Murder Mystery Boxset, Books 1 - 3': dropped Barnes & Noble https://www.barnesandnoble.com/w/sometimes-you-lose-dallas-gorham/1138439926?ean=9781644572290 - B&N link is Sometimes You Lose's.
- fred-lichtenberg / 'Bridge to Murder': dropped Kobo https://www.kobo.com/us/en/ebook/mental-case-a-hank-reed-mystery-book-3-1 - Kobo link is a copy of the previous book's (Mental Case / The Edge of Murder).
- ines-saint / 'Words With Friends': dropped iBooks https://books.apple.com/us/book/word-games-angie-gomez-cozy-murder-mystery- - Apple link is truncated (no Apple ID) and names Word Games, the previous book.
- jade-lee / 'Rules for a Lady': dropped Barnes & Noble https://www.barnesandnoble.com/w/swear-by-moonlight-shirlee-busbee/1104578190?ean=9781614173649&st=AFF&2sid=eBook%20Discovery_7960781_NA&sourceId=AFFeBook%20Discovery - B&N link points to Shirlee Busbee's Swear by Moonlight.
- jo-goodman / 'Forever in My Heart': dropped Amazon https://www.amazon.com/Hearts-Desire-Dennehy-Sisters-Book-ebook/dp/B078SJN72V - All 5 links are copies of My Heart's Desire's (identical URLs).
- jo-goodman / 'Forever in My Heart': dropped Kobo https://www.kobo.com/us/en/ebook/my-heart-s-desire-the-dennehy-sisters-series-book-2-1 - All 5 links are copies of My Heart's Desire's (identical URLs).
- jo-goodman / 'Forever in My Heart': dropped Barnes & Noble https://www.barnesandnoble.com/w/my-hearts-desire-jo-goodman/1120554138?ean=9781614176695 - All 5 links are copies of My Heart's Desire's (identical URLs).
- jo-goodman / 'Forever in My Heart': dropped iBooks https://geo.itunes.apple.com/us/book/my-hearts-desire-the-dennehy-sisters-series-book-2/id1334914205?mt=11 - All 5 links are copies of My Heart's Desire's (identical URLs).
- jo-goodman / 'Forever in My Heart': dropped Google Play https://play.google.com/store/books/details/Jo_Goodman_My_Heart_s_Desire_The_Dennehy_Sisters_S?id=MSokBQAAQBAJ - All 5 links are copies of My Heart's Desire's (identical URLs).
- jo-goodman / 'My Steadfast Heart': dropped Barnes & Noble http://www.anrdoezrs.net/links/7960781/type/dlg/http://www.barnesandnoble.com/w/her-defiant-heart-jo-goodman/1117352502?ean=9781614174912 - B&N link is Her Defiant Heart's.
- jo-goodman / 'With All My Heart': dropped Amazon http://amzn.to/1chbuaV - All 5 links are copies of My Reckless Heart's (identical URLs; B&N names my-reckless-heart).
- jo-goodman / 'With All My Heart': dropped Kobo http://bit.ly/15SJHKt - All 5 links are copies of My Reckless Heart's (identical URLs; B&N names my-reckless-heart).
- jo-goodman / 'With All My Heart': dropped Barnes & Noble http://www.anrdoezrs.net/links/7960781/type/dlg/http://www.barnesandnoble.com/w/my-reckless-heart-jo-goodman/1002533704?ean=9781614173236 - All 5 links are copies of My Reckless Heart's (identical URLs; B&N names my-reckless-heart).
- jo-goodman / 'With All My Heart': dropped iBooks http://bit.ly/1cOp9E5 - All 5 links are copies of My Reckless Heart's (identical URLs; B&N names my-reckless-heart).
- jo-goodman / 'With All My Heart': dropped Google Play http://bit.ly/1Nb3vi4 - All 5 links are copies of My Reckless Heart's (identical URLs; B&N names my-reckless-heart).
- jo-goodman / 'All I Ever Needed': dropped iBooks https://geo.itunes.apple.com/us/book/everything-i-ever-wanted-compass/id1057766790?mt=11 - Apple link is Everything I Ever Wanted's.
- jo-goodman / 'Beyond a Wicked Kiss': dropped iBooks https://geo.itunes.apple.com/us/book/everything-i-ever-wanted-compass/id1057766790?mt=11 - Apple link is Everything I Ever Wanted's.
- louise-clark / 'Cat Among The Fishes': dropped Google Play https://play.google.com/store/books/details/Louise_Clark_Let_Sleeping_Cats_Lie_The_9_Lives_Coz?id=zXNfDwAAQBAJ - Google Play link is Let Sleeping Cats Lie's.
- louise-clark / 'Listen to the Cat': dropped Amazon https://www.amazon.com/Cats-Away-Lives-Cozy-Mystery-ebook/dp/B09W92H1BW - Amazon link is identical to When the Cat's Away's.
- marilyn-campbell / 'Gallant': dropped Barnes & Noble https://www.barnesandnoble.com/w/falcon-marilyn-campbell/1116059122?cjdata=MXxOfDB8WXww&ean=9781614174493&st=AFF&SID=www.barnesandnoble.com&2sid=eBook+Discovery_7960781_NA&sourceId=AFFeBook+Discovery&cjevent=0d5902e5d8ea11ef8246009d0a18b8fc&dpid=tekz25v83 - B&N link is Falcon's.
- phoebe-conn-2 / 'No Sweeter Ecstasy': dropped Amazon https://www.amazon.com/gp/product/B00PRT0SYW/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00PRT0SYW&linkCode=as2&tag=wwwebookdisco-20&linkId=BVWKDLIGNPDOLDSS - Same Amazon ASIN link appears under No Sweeter Ecstasy and Tempt Me With Kisses; cannot tell which book it belongs to.
- phoebe-conn-2 / 'Tempt Me With Kisses': dropped Amazon https://www.amazon.com/gp/product/B00PRT0SYW/ref=as_li_qf_sp_asin_il_tl?ie=UTF8&camp=1789&creative=9325&creativeASIN=B00PRT0SYW&linkCode=as2&tag=wwwebookdisco-20&linkId=BVWKDLIGNPDOLDSS - Same Amazon ASIN link appears under No Sweeter Ecstasy and Tempt Me With Kisses; cannot tell which book it belongs to.
- r-t-wolfe / 'Savage Alliance': dropped Amazon https://www.amazon.com/Nickie-Savage-Boxed-Set-ebook/dp/B078SKM5WJ - All 5 links are the Nickie Savage Boxset's (identical to the boxset's buttons).
- r-t-wolfe / 'Savage Alliance': dropped Kobo https://www.kobo.com/us/en/ebook/the-nickie-savage-series-boxed-set-1 - All 5 links are the Nickie Savage Boxset's (identical to the boxset's buttons).
- r-t-wolfe / 'Savage Alliance': dropped Barnes & Noble https://www.barnesandnoble.com/w/the-nickie-savage-series-boxed-set-rt-wolfe/1127152149?ean=9781947833135 - All 5 links are the Nickie Savage Boxset's (identical to the boxset's buttons).
- r-t-wolfe / 'Savage Alliance': dropped iBooks https://books.apple.com/us/book/the-nickie-savage-series-boxed-set/id1334928015?ign-itscg=30200&ign-itsct=books_box_link - All 5 links are the Nickie Savage Boxset's (identical to the boxset's buttons).
- r-t-wolfe / 'Savage Alliance': dropped Google Play https://play.google.com/store/books/details/R_T_Wolfe_The_Nickie_Savage_Series_Boxed_Set?id=BEZFDwAAQBAJ - All 5 links are the Nickie Savage Boxset's (identical to the boxset's buttons).
- sl-menear / 'Dead Silent': dropped Amazon https://www.amazon.com/Flight-Redemption-Samantha-Starr-Thriller-ebook/dp/B07R3HYWWC - All 5 links are Flight to Redemption's.
- sl-menear / 'Dead Silent': dropped Kobo https://www.kobo.com/us/en/ebook/flight-to-redemption-a-samantha-starr-thriller-book-1 - All 5 links are Flight to Redemption's.
- sl-menear / 'Dead Silent': dropped Barnes & Noble https://www.barnesandnoble.com/w/flight-to-redemption-sl-menear/1131342979?ean=9781644570524 - All 5 links are Flight to Redemption's.
- sl-menear / 'Dead Silent': dropped iBooks https://books.apple.com/us/book/flight-to-redemption-a-samantha-starr-thriller-book-1/id1462208256 - All 5 links are Flight to Redemption's.
- sl-menear / 'Dead Silent': dropped Google Play https://play.google.com/store/books/details/S_L_Menear_Flight_to_Redemption_A_Samantha_Starr_T?id=7P2UDwAAQBAJ - All 5 links are Flight to Redemption's.
- tlb-wood / 'A Conspiracy to Murder, 1865': dropped Amazon https://www.amazon.com/Flight-Redemption-Samantha-Starr-Thriller-ebook/dp/B07R3HYWWC - All 5 links are S.L. Menear's Flight to Redemption.
- tlb-wood / 'A Conspiracy to Murder, 1865': dropped Kobo https://www.kobo.com/us/en/ebook/flight-to-redemption-a-samantha-starr-thriller-book-1 - All 5 links are S.L. Menear's Flight to Redemption.
- tlb-wood / 'A Conspiracy to Murder, 1865': dropped Barnes & Noble https://www.barnesandnoble.com/w/flight-to-redemption-sl-menear/1131342979?ean=9781644570524 - All 5 links are S.L. Menear's Flight to Redemption.
- tlb-wood / 'A Conspiracy to Murder, 1865': dropped iBooks https://books.apple.com/us/book/flight-to-redemption-a-samantha-starr-thriller-book-1/id1462208256 - All 5 links are S.L. Menear's Flight to Redemption.
- tlb-wood / 'A Conspiracy to Murder, 1865': dropped Google Play https://play.google.com/store/books/details/S_L_Menear_Flight_to_Redemption_A_Samantha_Starr_T?id=7P2UDwAAQBAJ - All 5 links are S.L. Menear's Flight to Redemption.

### Buy links moved to the book they name (that book had only placeholder buttons)

- louise-clark: Barnes & Noble https://www.barnesandnoble.com/w/lovers-knot-louise-clark/1122409989?cjdata=MXxOfDB8WXww&ean=9781614177739&st=AFF&SID=www.barnesandnoble.com&2sid=eBook+Discovery_7960781_NA&sourceId=AFFeBook+Discovery&cjevent=51a0a426d58611ef820e01680a18b8f7&dpid=tekz25v83 moved from 'Dangerous Desires' to 'Lover's Knot'. B&N, Google Play and Kobo links under Dangerous Desires all name Lover's Knot, whose own buttons are '#' placeholders.
- louise-clark: Google Play https://play.google.com/store/books/details/Louise_Clark_Lover_s_Knot_Hearts_of_Rebellion_Seri?id=N0c8CgAAQBAJ moved from 'Dangerous Desires' to 'Lover's Knot'. B&N, Google Play and Kobo links under Dangerous Desires all name Lover's Knot, whose own buttons are '#' placeholders.
- louise-clark: Kobo https://www.kobo.com/ww/en/ebook/lover-s-knot-hearts-of-rebellion-series-book-2?utm_source=linkshare_us&utm_medium=Affiliate&utm_campaign=ePulishing+Works%21+for+Readers&utm_term=&ranMID=37217&ranEAID=i5%2FP2pYQ*yw&ranSiteID=i5_P2pYQ.yw-6PbDlq.u9VqpbUx11xfWQQ&siteID=i5_P2pYQ.yw-6PbDlq.u9VqpbUx11xfWQQ moved from 'Dangerous Desires' to 'Lover's Knot'. B&N, Google Play and Kobo links under Dangerous Desires all name Lover's Knot, whose own buttons are '#' placeholders.
- marilyn-campbell: Amazon https://www.amazon.com/Some-Time-Away-Lovers-Book-ebook/dp/B07DPJDHDS moved from 'Christmas Presents' to 'Some Time Away'. All 5 links under Christmas Presents name Some Time Away (Lovers in Time book 3), whose own buttons are '#' placeholders.
- marilyn-campbell: Kobo https://www.kobo.com/us/en/ebook/some-time-away-lovers-in-time-series-book-3 moved from 'Christmas Presents' to 'Some Time Away'. All 5 links under Christmas Presents name Some Time Away (Lovers in Time book 3), whose own buttons are '#' placeholders.
- marilyn-campbell: Barnes & Noble https://www.barnesandnoble.com/w/some-time-away-marilyn-campbell/1128920705?ean=9781947833760 moved from 'Christmas Presents' to 'Some Time Away'. All 5 links under Christmas Presents name Some Time Away (Lovers in Time book 3), whose own buttons are '#' placeholders.
- marilyn-campbell: iBooks https://books.apple.com/us/book/some-time-away-lovers-in-time-series-book-3/id1431593028?ign-itscg=30200&ign-itsct=books_box_link moved from 'Christmas Presents' to 'Some Time Away'. All 5 links under Christmas Presents name Some Time Away (Lovers in Time book 3), whose own buttons are '#' placeholders.
- marilyn-campbell: Google Play https://play.google.com/store/books/details/Marilyn_Campbell_Some_Time_Away_Lovers_in_Time_Ser?id=NLdgDwAAQBAJ moved from 'Christmas Presents' to 'Some Time Away'. All 5 links under Christmas Presents name Some Time Away (Lovers in Time book 3), whose own buttons are '#' placeholders.

### Buttons whose label disagreed with the link (named by where the link actually goes)

- words-with-friends-ines-saint: button labelled 'Kobo' links to Google Play; named 'Google Play' (https://play.google.com/store/books/details/Ines_Saint_Words_With_Friends_Angie_Gomez_Cozy_Mur?id=MEJzEAAAQBAJ).
- for-the-love-of-mercy-leta-gail-doerr: button labelled 'Google Play' links to Apple Books; named 'Apple Books' (https://books.apple.com/us/book/for-the-love-of-mercy-the-bluegrass-country-series-book-2/id903589062).
- love-slave-mallory-rush: button labelled 'Google Play' links to Kobo; named 'Kobo' (https://www.kobo.com/ww/en/ebook/love-slave-outlaws-and-heroes-book-1).
- words-with-friends-ines-saint: duplicate URL under 'Google Play' dropped (https://play.google.com/store/books/details/Ines_Saint_Words_With_Friends_Angie_Gomez_Cozy_Mur?id=MEJzEAAAQBAJ).

### Links kept but not verifiable from the URL

- Retailer names: buttons labelled iBooks become **Apple Books**, `everand.com` links (Scribd's ebook store) are **Scribd**, `amzn.to` is **Amazon**, and `anrdoezrs.net` (CJ affiliate) and `bwlnk.com` redirects are named after the store they redirect to. Every URL is kept verbatim, affiliate tags and odd query strings included (for example some Apple links end `?mt=11itunes.app…`).
- `bit.ly` shorteners can't be resolved from this session, so each is named after its button label:
  - her-defiant-heart-jo-goodman: Kobo is a shortener (http://bit.ly/1dsz3vP); name taken from the button label.
  - her-defiant-heart-jo-goodman: iBooks is a shortener (http://bit.ly/1d3Q8y1); name taken from the button label.
  - her-defiant-heart-jo-goodman: Google Play is a shortener (http://bit.ly/1PkZJkS); name taken from the button label.
  - his-hearts-revenge-jo-goodman: Kobo is a shortener (http://bit.ly/1asJ9IQ); name taken from the button label.
  - his-hearts-revenge-jo-goodman: iBooks is a shortener (http://bit.ly/1a5jQAe); name taken from the button label.
  - his-hearts-revenge-jo-goodman: Google Play is a shortener (http://bit.ly/1Fn3aj1); name taken from the button label.
  - my-reckless-heart-jo-goodman: Kobo is a shortener (http://bit.ly/15SJHKt); name taken from the button label.
  - my-reckless-heart-jo-goodman: iBooks is a shortener (http://bit.ly/1cOp9E5); name taken from the button label.
  - my-reckless-heart-jo-goodman: Google Play is a shortener (http://bit.ly/1Nb3vi4); name taken from the button label.
- Many Amazon links are bare `gp/product/<ASIN>` URLs, and two Kobo links use opaque IDs (Tempting Fortune, Carnal Vengeance), so no title can be checked. They are kept wherever only one book uses them.
- Kept on the reading that the book was retitled. Each link names a title found nowhere else in the catalog, with the same series and number:
  - *The Edge of Murder* (Fred Lichtenberg): links name "Mental Case: A Hank Reed Mystery Book 3".
  - *Murder Me Twice* (S.J. MacIver): Amazon and B&N name "Cinnamon Girl (Second Chance at Love)".
  - *Listen to the Cat* (Louise Clark): Kobo and Google Play name "If the Cat's Away … Book 8". Apple says Listen to the Cat is Book 8.
  - *Word Games* (Inés Saint, the first of the two): its own links are consistent.
- Box-set naming differs from the page title but the description confirms it is the box set: *Rock Hard* and *Rock Candy* (Kathy Lyons) are "The Stone Men Series Boxed Set 1/2"; *Death by Doodlebug Book Series Set* (Carol Caverly) is "The Thea Barlow Cozy Mysteries Box Set".
- *Dangerous Desires* (Louise Clark) keeps its Amazon link `gp/product/B011JHEIZ0`, though the other three links in its slot were Lover's Knot's and were moved. The Amazon link may be Lover's Knot's as well.
- Jo Goodman's Bitter Springs books and Louise Clark's newest two use ISBN *search* URLs (Amazon `s?k=`, Kobo `Search?Query=`, B&N `/s/`) and `bwlnk.com` redirects. They are real links and are kept verbatim.
- Retailers named **Other**:
  - spirits-adopted-alice-duncan: 'Buy Direct & Save!' -> Other (https://shop.lightningsource.com/b/085?params=Ig19E4ZovP8BsTANGjNiXj6VeQX1CO4eekmr4oM9C87).
  - spirits-adopted-alice-duncan: 'Books-A-Million' -> Other (https://www.booksamillion.com/p/Spirits-Adopted/Alice-Duncan/9781644577288?id=9363728835238).
  - celluloid-angels-alice-duncan: 'Buy Direct & Save!' -> Other (https://shop.lightningsource.com/b/085?params=Hu6f3O7P36Ec9AR0inYo6MhG6dwhu3S9gMFqvhrruRd).
  - celluloid-angels-alice-duncan: 'Books-A-Million' -> Other (https://www.booksamillion.com/p/Celluloid-Angels/Alice-Duncan/9781644576540?id=9170959397664).
  - dancing-angels-alice-duncan: 'Buy Direct & Save!' -> Other (https://shop.lightningsource.com/b/085?params=0CzWO7gez3j5avUT7sKvSmBX614fmk1ktK90xRFF3NQ).
  - dancing-angels-alice-duncan: 'Books-A-Million' -> Other (https://www.booksamillion.com/p/Dancing-Angels/Alice-Duncan/9781644577752).

## Field decisions

- `title`: the H3 text, verbatim (zero-width spaces stripped). `subtitle`: no H3 carries a separate subtitle. Where the H5 under a box set is a books-range line rather than a series name, that line is the subtitle, unless the title already contains it:
  - The Daisy Gumm Majesty Box Set 1 (Alice Duncan): "Books 1 - 3"
  - The Daisy Gumm Majesty Box Set 2 (Alice Duncan): "Books 4 - 6"
  - The Daisy Gumm Majesty Box Set 3 (Alice Duncan): "Books 7 - 9"
  - Mercy Allcutt Mysteries Box Set (Alice Duncan): "Books 1 - 3"
  - Death by Doodlebug Book Series Set (Carol Caverly): "Book 1-3"
  - Lexie Starr Cozy Mystery Boxset (Jeanne Glidewell): "Books 1-3"
  - Lexie Starr Cozy Mystery Boxset (Jeanne Glidewell): "Books 4-6"
  - The Ripple Effect Cozy Mystery Boxset (Jeanne Glidewell): "Books 1-3"
  - The Joe Burgess Mystery Series Boxset (Kate Flora): "Books 1-3"
  - The Thea Kozak Mystery Series Boxset (Kate Flora): "Books 1-3"
  - The Caley Cove Series (Kay Gregory): "Caley Cove Series Boxed Set"
  - Christmas Presents (Marilyn Campbell): "Box Set"
  - Off-Duty SEALS, An Echo Platoon Anthology (Marliss Melton): "Book Set"
  - The Beach Bachelors Series (Pamela Browning): "Book 1-3"
- `series`: the H5 line with ", Book N" removed (only Alice Duncan's lines and the landing pages state numbers, so those are the only `seriesNumber`s). Genre or placement labels ("Single Title", "Other Titles", "… - Single Title/Tile", "Gothic Romance", "Romantic Comedy Books") and box-set lines give `series: ""`. Parenthetical genre notes are dropped: "Isle of Fangs Series (Teen / Young Adult)" becomes "Isle of Fangs Series" and "Star Pilot Series (Futuristic Romance)" becomes "Star Pilot Series". Judith E. French's last three books have no H5, so their series is empty.
- `isbn`: only from cover file names that are a valid ISBN-13 (21 Alice Duncan covers, plus one Louise Clark).
  - when-the-cats-away-louise-clark: https://epublishingworks.com/wp-content/uploads/9781644576328-1.jpg: accepted ISBN despite WordPress suffix '-1'
- `formats`: always `[]`. No page states a format ("novella" is a length).
- `language`: all `en`.
- `byline`: the author's H2, except on the pen-name pages above.
- Images: originals downloaded once each from `wp:attachment_url` and cached outside the repo. Each is converted to an RGB progressive JPEG at quality 82 (transparent PNGs flattened onto white), metadata stripped, covers at most 600 px wide and photos at most 800 px, never upscaled. 483 of 510 covers stay under 600 px because the originals are small (most are 342 or 344 px wide, some 176 or 200 px; only 27 were over 600 px and were downscaled). Every author photo original is 600 px or narrower (39 of 56 are 240 px), so no photo was resized. If the design needs larger covers, the publisher will have to supply them.

## Genre judgment calls

Each author's tagline sets the default genre, then the series line, then the individual description where those disagree. Calls that could reasonably go either way:

- Historical western romances (Adrienne deWolfe, Barbara Ankrum, Patricia Hagan, Sharon Ihle, Trana Mae Simmons, Phoebe Conn, Elizabeth Grayson) -> 'Historical Romance', not 'Western'. No book on the site is a non-romance western.
- Alicia Dean, Northland Crime Chronicles -> Romantic Suspense (tagline 'Romance/Paranormal'; books are detective/reporter romance with a killer).
- Christine Bush, New Beginnings and Commitment series -> Contemporary Romance (tagline), although several have mystery/danger elements (could be Romantic Suspense).
- Dallas Gorham (tagline 'Mystery/Thriller'), Carlos McCrary PI series -> Mystery.
- David O. Stewart, Fraser and Cook Historical Mysteries -> Mystery (not Historical Fiction).
- Eileen Dreyer, four 'Medical Suspense Thriller' titles and 'If Looks Could Kill' (Suspense) -> Thriller & Suspense (page tagline is 'Romance/Contemporary'; could be Romantic Suspense). Korbel Classic Romance -> Contemporary Romance.
- Jade Lee, The Way of The Tigress (Shanghai, 1890s) -> Historical Romance; Night Studies (Tantric goddess, contemporary) -> Paranormal & Fantasy Romance.
- Jason Melby, Music City Madness ('inspired by true events', Nashville songwriter) -> Literary & Women's Fiction; his other four -> Thriller & Suspense (tagline 'Action & Adventure').
- Jeanne Glidewell, Soul Survivor (past-life suspense, single title) -> Thriller & Suspense.
- John Hoskison: Inside (true story) -> Memoir & Biography; Name and Number (prison novel, fiction) -> Literary & Women's Fiction; three golf instruction books -> Nonfiction.
- Kay Gregory, The Sojourners Series (1950s London) -> Literary & Women's Fiction (she is listed under Women's Fiction on the index); Reluctant Brides and Caley Cove -> Contemporary Romance.
- Linda Hale Bucklin: Beyond His Control and The Distant Shore -> Memoir & Biography; Come Rain or Come Shine and The Love of Angels -> Nonfiction.
- Louise Clark, Forward in Time (time-travelling ancestor) -> Paranormal & Fantasy Romance.
- Mallory Rush: Love Slave, Danger & Desire, Love Trade -> Romantic Suspense; Dead or Alive -> Paranormal & Fantasy Romance; other singles and Shades of Deception -> Contemporary Romance (Date With The Devil, an island-survival romance, could be Romantic Suspense).
- Marilyn Campbell: Innerworld Affairs (alien humanoids), Lovers in Time (time travel), Christmas Presents (angels/spirits) -> Paranormal & Fantasy Romance; Lust and Lies -> Romantic Suspense; Dreams and Schemes -> Contemporary Romance.
- Patricia Hagan: Final Justice and the Shadows of Love gothic set -> Romantic Suspense.
- Patrick Astre: Apocalypse Series -> Thriller & Suspense except Sylvans (ancient non-human race) -> Fantasy & Science Fiction.
- Phoebe Conn: Star Pilot (futuristic romance) -> Paranormal & Fantasy Romance; Helen: The Wine Dark Sea (Helen of Troy) -> Historical Fiction.
- Richard Bowker: The Last P.I. (post-nuclear-war Boston), The Portal Series, Replica, Forbidden Sanctuary -> Fantasy & Science Fiction; Psychic Thriller series, Pontiff, Senator -> Thriller & Suspense.
- S.L. Menear, Life, Love & Laughter (true flying stories mixed with short fiction, multiple authors) -> nonfiction / Memoir & Biography.
- Yvonne Montgomery (tagline 'Horror Author'): The Wisdom Court Series (supernatural) -> Thriller & Suspense, since the list has no Horror genre; Finny Aletter -> Mystery.
- Inés Saint, Romantic Comedy Books -> Contemporary Romance; Angie Gomez -> Cozy Mystery.
- Mary Ellen Johnson, Knights of England (medieval) -> Historical Romance per tagline (could be Historical Fiction).

