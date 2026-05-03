// Articles published on /insights. Order does not matter; index sorts by date.
// Each article body uses a tiny markdown-like syntax handled by the renderer:
//   ## H2 heading
//   ### H3 heading
//   > pull quote
//   • bullet
//   --- (horizontal rule)
//   Plain paragraphs are paragraphs.

export type Author = {
  id: "nathan" | "jc";
  name: string;
  title: string;
};

export type Article = {
  slug: string;
  title: string;
  dek: string;
  authorId: Author["id"];
  date: string; // ISO yyyy-mm-dd
  readingTime: number; // minutes
  category: "Methodology" | "Field Notes" | "Founder" | "Operator Playbook";
  cover: string; // /images/...
  body: string;
  videoPoster?: string;
  videoLabel?: string;
  videoSrc?: string; // optional MP4 URL
  youtubeId?: string; // optional YouTube video ID
  videoCredit?: string; // e.g. "Featured talk · Will Spaulding"
};

export const authors: Record<Author["id"], Author> = {
  nathan: {
    id: "nathan",
    name: "Nathan Holloway",
    title: "Founder · BuildHawk and Hawktress",
  },
  jc: {
    id: "jc",
    name: "John Ceballos",
    title: "Head of Operations · BuildHawk",
  },
};

export const articles: Article[] = [
  {
    slug: "five-percent-variance-threshold",
    title: "The 5% Variance Threshold: Why It Saves Margin",
    dek:
      "A single rule that decides whether a quote, a variation, or an actual cost gets approved or escalated. We use it on every job. Here is why 5%, and what happens when you ignore it.",
    authorId: "nathan",
    date: "2025-03-12",
    readingTime: 7,
    category: "Methodology",
    cover: "/images/architect-plans.webp",
    youtubeId: "o9X5uA-pVWA",
    videoLabel: "Construction Contract Variations and Claims with Peter Mallett",
    videoCredit: "Featured talk · 32 min",
    body: `Every builder loses margin in the same three places. The estimate that goes out optimistic. The variation that gets waved through. The PO that closes 10% over without a phone call. None of these failures look catastrophic in the moment. They look like single line items on a single job. But across a year of work they add up to the difference between profit and break-even.

We built the 5% variance threshold to put a hard line under all three.

## What the threshold actually is

Hawktress holds a rolling regional average for every trade rate it has data on. When a quote, a variation, or an actual cost lands more than 5% outside that average, the record is automatically flagged. Flagged items cannot be approved by the contract administrator alone. They escalate to me, the director, before the CA can move forward.

That is the whole rule.

The rule applies at every stage. A frame quote that comes in 12% above the regional rolling average for VIC custom builds gets flagged at the estimate stage. A variation claim that prices repointing brickwork at $180 per m² when the regional average is $128 gets flagged at the contract admin stage. A site clean PO that closes at $4,200 against an issued value of $3,000 gets flagged at the practical completion stage.

Every flag is a conversation. Some flags are completely justified. The site had three trees that were not on the original survey. The supplier passed on a steel price hike that everyone in the market is wearing. Those flags get approved with a note explaining the variance. Other flags are not justified. The trade has padded the rate. The CA missed a duplicated line. Those flags get pushed back.

The point is not to refuse variances. The point is to make sure no variance ever happens silently.

## Why 5%, not 10%

I get this question constantly. Why not give the team a wider band? Builders run hot and cold on price. Trades change their rates. Inflation alone moves things 3 to 4% a year. A 5% threshold is going to flag a lot of records. Is that not just noise?

The answer is in the maths. If your average margin on a residential build is 18%, and you let trades drift 10% above your committed value across the job, you have eaten 1.8% of your gross margin in cost creep alone. On a $2.5 million build that is $45,000. You have lost a year of one staff member's super for nothing.

5% is the threshold where margin protection still works. 10% is the threshold where margin protection becomes wishful thinking.

There is also a behavioural reason. When the threshold is 5%, the team estimates inside the threshold. They sharpen their numbers, they call the supplier when something looks high, they push back on quotes early. When the threshold is 10%, the team uses the headroom. The threshold becomes the new ceiling.

> The threshold you set is the discipline you get.

## What happens when the threshold is ignored

I worked on a custom home in Highton in 2022 where the contract administrator approved every variation that came across his desk for four months. The variations were not unreasonable on their own. A $4,800 framing change here, a $7,200 cabinetry adjustment there. None of them were 5% outside the regional average. Most of them were 6 to 8% above what the original quote had been.

By the time we caught it the project had absorbed $94,000 in approved variations against a contract value of $1.65 million. The gross margin on the job was supposed to be 19%. It came in at 11%. The CA had not done anything wrong by the standards of the day. The standards of the day were the problem.

That job is the reason the 5% threshold exists.

## How it applies to a trade subscription

If you are reading this as a trade contractor on the Hawktress platform, the threshold cuts both ways. Your own pricing gets benchmarked against the regional rolling average for your category. When your quote sits inside the band you are competitive. When it sits more than 5% above the band you get a notification. When it sits more than 5% below the band you also get a notification, because you are leaving money on the table and we want you sustainable on the platform.

The threshold is not a stick. It is a ruler. It tells everyone where they sit so they can decide what to do about it.

## How it applies to suppliers

Suppliers see the same thing at the platform level. Their quote-to-actual variance is tracked across every job they work on with a Hawktress builder. Suppliers who consistently deliver inside the threshold rise in the recommendation list. Suppliers who consistently sit outside it have a conversation with us before they get put in front of more builders. We are not in the business of recommending suppliers who blow up budgets.

## What this looks like in the monthly report

The monthly director report I receive on the 5th of each month carries a flagged-items section. Every line that triggered the threshold across every active job in the previous month, with a director-decision column. Approved with note. Pushed back. Renegotiated. Resolved through scope clarification.

It is the most useful page in the report. It is also the page that has saved us the most money over the last 18 months.

---

If you are a builder reading this and you have ever finished a project knowing you lost margin you cannot quite explain, the answer is almost always uncontrolled variance. Set a threshold. Hold it. Have the awkward conversations early. The job will finish where you said it would.`,
  },
  {
    slug: "underpricing-sitework-year-one",
    title: "Why Every Builder Underprices Sitework in Year One",
    dek:
      "Excavation, drainage, retaining, and site clean. Together they are usually 4 to 7% of the contract. Builders almost universally get them wrong on the first job in a new region. Here is what to actually budget.",
    authorId: "nathan",
    date: "2024-10-08",
    readingTime: 6,
    category: "Operator Playbook",
    cover: "/images/site-aerial.webp",
    youtubeId: "bFloySBOcp8",
    videoLabel: "How to start a House Build in Australia · Pre-construction Guide",
    videoCredit: "Featured walkthrough · CourtneyBraz",
    body: `Sitework is the line item that ruins more first-region builds than any other. Frames are easy to estimate. Cabinetry is easy. Roofing is easy. Sitework is the one that hides.

I have worked across Geelong, the Bellarine Peninsula, and the western Melbourne fringe for over two decades. Every time we open a job in a suburb we have not built in before, the first sitework estimate is wrong. Not by a small amount.

## What sitework actually contains

When estimators talk about sitework they usually mean four things bundled together:

• Bulk excavation and benching
• Stormwater and sewer connection works
• Retaining walls, where required by site fall
• Site clean and disposal at completion

In urban infill blocks across Melbourne and Geelong, these four items together usually run between 4% and 7% of the contract value on a custom home. On a knockdown rebuild the percentage is higher because of demolition, asbestos clearance, and sometimes contaminated soil.

The trap is not the average. The trap is the variance between sites.

## Why the variance is so wide

Two blocks 800 metres apart can have wildly different sitework costs. The variables we have measured the most impact from:

**Site fall.** A 1-in-30 fall on a 600 m² block is benign. The same fall on a long narrow block over 35 metres becomes a retaining problem. The cost to retain a 1.2 metre cut runs $850 to $1,400 per linear metre depending on engineering and material choice. A 50-metre block with a 1.2 metre cut on one side is $42,000 to $70,000 of retaining alone.

**Soil class.** P-classified sites trigger engineered slabs and frequently engineered piers. A waffle pod slab on M-class costs around $98 per m² placed in 2024 prices in the Geelong region. The same footprint on P-class with bored piers can run $145 to $180 per m². On a 220 m² footprint that is $10,000 to $18,000 of unanticipated cost if you priced for M-class.

**Stormwater connection point distance.** Council-mandated connection point on a long block can mean 25 to 40 metres of stormwater pipe through landscaped or finished surface. At $120 to $180 per linear metre installed in tight access, the connection alone can be $3,000 to $7,000 over what you would have priced as a typical urban infill.

**Tree removal and protection.** Significant tree exclusion zones in the City of Greater Geelong and most metro councils require an arborist report and tree protection fencing through the entire build. A single retained tree adds $2,500 to $4,500 in protection costs and sometimes triggers a redesign of stormwater and excavation paths.

## The cost of getting it wrong

Sitework is almost always priced before the soil report and the survey come back. Builders use a per-m² rate that worked on the last job. The first job in a new suburb is usually wrong by between $8,000 and $35,000 against actuals. On a custom home with an 18% margin that is between half a percent and 2% of the entire contract margin, gone before the slab is poured.

The pattern is consistent across every region we have data on.

> The first job in a new suburb is the job you make mistakes on. The trick is to price it like you have already made them.

## What to do instead

We use a three-step process for any job in a region we have not previously built in.

**One.** Pull the sitework actuals from the closest comparable jobs we have, by build type and block size. If we have no closely comparable data we use the regional rolling average for the suburb if available.

**Two.** Add a regional unfamiliarity loading on the four sitework line items. The loading is 8% to 15% depending on how confident we are in the data set. The loading is visible to the client and explained in the assumption log.

**Three.** Caveat the sitework allowance in the contract until soil reports, surveys, and council connection points are confirmed. The caveat language gives both sides the right to revise the sitework allowance based on actual site conditions before slab.

We have not lost a job to this loading. We have stopped losing margin to sitework.

## What the data shows

Across our last 24 months of completed jobs in the Geelong and western Melbourne regions, the average overrun on sitework on first-region jobs was 22% above the original allowance. The average overrun on second-and-subsequent jobs in the same region dropped to 6%.

The data tells you exactly what is happening. The first job you teach yourself the region. The second job you price the region.

The point of running a cost intelligence platform is to teach yourself the region before the first job, not after it.

---

If your business is moving into a new postcode this year, the single most expensive line item to get wrong is the one nobody pays attention to. Sitework is where margin disappears in November and reappears as a hard conversation in March. Price it like you already know what it costs. Then go and find out.`,
  },
  {
    slug: "variation-control-three-questions",
    title: "Variation Control: Three Questions Before You Approve",
    dek:
      "Most variations are not fraudulent. They are sloppy. The CA who runs a variation through three specific questions before approval will catch nine out of ten cost creep events before they hit the books.",
    authorId: "nathan",
    date: "2025-07-22",
    readingTime: 5,
    category: "Operator Playbook",
    cover: "/images/architect-plans.webp",
    youtubeId: "qN8QOmChcxY",
    videoLabel: "Contract variation procedure with worked example",
    videoCredit: "Featured walkthrough · 26 min",
    body: `Contract administrators are not paid to be hard. They are paid to be accurate. The difference between a CA who protects margin and a CA who erodes it is usually three questions.

I review every escalated variation that comes through the Hawktress platform. Across the active builder book the team processes roughly 40 to 60 variation claims a week. The pattern is consistent. Around 70% of variations are legitimate and well-documented. Around 25% are legitimate but underspecified. Around 5% are wrong, either through sloppy paperwork or, occasionally, through deliberate inflation.

The three questions catch the 25 plus the 5.

## Question one. Does the scope of the variation match the scope of the original contract item?

This is the single most common variation failure. A trade prices a variation as if it is net new work, when half of it was already inside the original scope.

Concrete example. A bricklayer issues a variation for $2,400 to "supply and lay extra brickwork to feature wall as marked." The drawing change adds 8 m² of brickwork to a feature wall that was already part of the original scope at 24 m². The original quote was $4,800 for the 24 m². At $200 per m² placed, the additional 8 m² should be priced at $1,600. The trade has priced $300 per m² for the variation. They have used the variation as an opportunity to lift the rate, not just to capture the additional quantity.

The question to ask is: what was the contract rate for this exact item, and is the variation rate consistent with the contract rate? If it is not, escalate.

## Question two. Could this variation have been anticipated at tender stage?

Variations come in three categories. Client-driven changes. Site-driven discoveries. Builder-driven mistakes.

The first two are normal and the contract handles them. The third is where margin disappears.

A trade who issues a variation because they did not allow for a perfectly visible feature on the contract drawings is asking the builder to pay for their own estimating error. A subcontractor who claims a variation because the drawings did not specify a junction detail that any competent operator would have priced is doing the same thing.

The question to ask is: was this scope visible on the documents at tender? If it was, the variation is not a variation. It is a bid revision after the contract has been signed. The right answer is to push back, not to approve.

> A variation is for new scope. A bid revision is for the trade's own oversight. The two are not the same.

## Question three. Does approving this variation change the trade's incentive on the rest of the job?

This is the one CAs miss most often. Variations do not just change the price of the work in front of you. They change the trade's behaviour on the work that comes next.

If you approve a variation that covers the trade's mistake, the trade learns that mistakes get covered. Future quotes from that trade will be looser, knowing the variation pipeline is permissive. If you approve a variation that lets a trade walk back a competitive original quote, every future quote from that trade will be priced higher knowing the contract value can be revised after award.

The question to ask is: what does this approval signal to this trade about how I run my business? If it signals weakness, the cost is not the variation itself. The cost is the next twelve months of quotes from this trade and from every other trade that talks to them.

## What to do with the answers

If the variation passes all three questions, approve it and move on. Most variations do.

If the variation fails one of the three questions, do not approve it. Open a conversation with the trade. The conversation usually resolves with a revised variation that works for both parties. The trade walks away with a clear understanding of where the line is. You walk away with a margin that has not been quietly bled.

If the variation fails two or more questions, escalate to the director. The hawktress 5% threshold catches most of these automatically. The judgement-based ones, where the rate looks reasonable but the scope or behaviour is wrong, need a human escalation path. Build it into your CA workflow.

## What this is not

This is not about being adversarial with trades. The trades who work with our network builders consistently are the ones who write tight variations and welcome the questions. Discipline at the variation desk is what makes those trades stay sustainable on the platform. The trades who push loose variations are the ones who eventually price themselves out of the work.

> The CA who asks three questions is not the CA the trades complain about. They are the CA the trades respect.

The cost of asking three questions on every variation is approximately 90 seconds. The cost of not asking is the gap between your forecast margin and your actual margin at handover.

If you are running a CA function inside a builder, write the three questions on the wall above the desk. Hold the line.`,
  },
  {
    slug: "monthly-director-report-walkthrough",
    title: "Reading the Monthly Director Report: A Walkthrough",
    dek:
      "Every active job, every committed cost, every flagged variation, every dollar of cash position, in one report by the 5th of the month. Here is how to read it in 90 seconds, and what to act on first.",
    authorId: "nathan",
    date: "2026-02-04",
    readingTime: 8,
    category: "Methodology",
    cover: "/images/modern-build.webp",
    youtubeId: "42PcHNSOSEg",
    videoLabel: "Construction Cost Estimating · Step-by-step guide",
    videoCredit: "Featured walkthrough",
    body: `The monthly director report is the most important single artefact Hawktress produces. It runs to between three and seven pages depending on the size of the builder's active book. It lands in the director's inbox by the 5th of every month. Read correctly, it gives you 90 seconds of certainty about whether the business is on track.

This piece walks through how to read it.

## The structure

Every report has the same five sections in the same order.

**Section 1. Portfolio summary.** One page. Total contracted revenue, total revenue received this period, total committed costs, portfolio gross margin, cash position relative to project commitments, and 30 / 60 / 90-day forecast revenue.

**Section 2. Job tracking grid.** One row per active job. Original contract value, current contract value, committed costs, forecast final cost, gross margin forecast, variations approved this month, programme status, and an alert column.

**Section 3. Flagged items.** Every line that triggered the 5% variance threshold across every active job in the previous month, with current status.

**Section 4. Aged debtors and outstanding invoices.** Anything over 30 days, with the contact you need to chase.

**Section 5. Escalation items.** Any decision that requires director sign-off before the CA can proceed in the next 14 days.

## How to read it in 90 seconds

Every director who onboards onto the platform gets the same instruction from me. Read the report in this order, with a stopwatch.

**0 to 15 seconds.** Read section 1 only. Look at three numbers. Portfolio gross margin. Cash position relative to commitments. 30-day forecast revenue. If those three numbers are inside the bands you set at the start of the year, the business is on track and you can read the rest at your own pace. If any of the three are outside the band, you have a real meeting to run this morning.

**15 to 45 seconds.** Read section 2's alert column only. Anything red, anything amber. Skip the body of the grid. The alert column is engineered to be the first thing a director's eye lands on. If the alert column is clean, every job is tracking. If it is not, you know which jobs need a phone call before the day starts.

**45 to 75 seconds.** Read section 3's status column. Approved with note. Pushed back. Awaiting director decision. The "awaiting director decision" rows are the ones that block the CA from moving forward. They are the highest-leverage 30 seconds of your week.

**75 to 90 seconds.** Read section 5. These are the items that need your decision in the next 14 days. They are pre-formatted with the question, the recommendation from the CA, and the option set. Most of them can be approved or actioned in under a minute each.

The other pages are for context. The first 90 seconds is for action.

> The report is engineered around a director who has 90 seconds and a director who has 90 minutes. Both have to be able to use it.

## What the alert column actually flags

The alert column has four possible states.

**Green.** Job is inside all forecast bands.

**Amber.** Job has at least one metric drifting toward a band edge but no breach yet. Common amber triggers: forecast final cost rising more than 2% in a single month, programme slippage of more than 5 working days against the contracted PC date, an unapproved variation backlog of more than five items, or aged debtors on this job over 30 days.

**Red.** At least one metric has breached a band. Common red triggers: gross margin forecast dropped below the floor set at contract award, forecast final cost exceeding current contract value, programme slippage of more than 15 working days, or a variation flagged outside the 5% threshold and unresolved for more than 14 days.

**Black.** Catastrophic. Job has a margin forecast below break-even, an unrecoverable cost overrun, or a programme breach that triggers liquidated damages. These are escalated by the CA before the report goes out.

If you only ever read the alert column, you will catch every problem.

## The report is also a behaviour-shaping artefact

This is the part most directors miss when they first onboard. The report is not just a status snapshot. It is a behaviour-shaping artefact for the entire team that touches the jobs.

The estimator knows that any quote outside the 5% threshold will appear in section 3 with their name on it. They estimate tighter.

The CA knows that any unapproved variation backlog over five items will turn the alert column amber. They clear variations weekly.

The site team knows that any programme slippage over five days will turn amber, and over fifteen days will turn red. They flag programme risk early instead of hiding it.

The director knows that any decision they have not made within 14 days will roll forward into section 5 of next month's report and be highlighted. They make decisions on time.

The report is the operating cadence of the business. It is also the document that proves the operating cadence is being held.

## The 5th of the month is non-negotiable

Reports issued on the 12th are reports nobody reads. The discipline of the 5th-of-the-month deadline is the discipline that keeps the report relevant. If your CA cannot produce the report by the 5th, the operating system upstream of the CA is broken. Fix that before you fix anything else.

## What to look for in your first three reports

If you are new to Hawktress and the report has just landed for the first time, look for three things.

**One.** Are the numbers in section 1 the numbers you expected? If they are not, your forecasts were wrong, which is fine, you now have data. Calibrate.

**Two.** Are the alert states in section 2 consistent with your gut feel about each job? Where the alert disagrees with your gut, the alert is usually right.

**Three.** Are there flagged items in section 3 that you would have approved without question if they had not been flagged? If there are, that is the value of the threshold. Those are the items that would have eaten your margin invisibly. Make a note of which ones, why they were flagged, and what you decided.

By the third monthly report, the rhythm is set. By the sixth, the report is your single most reliable source of truth about the business.

---

If you are a builder running a director-level dashboard right now from spreadsheets and gut feel, the difference between that and a structured monthly report is not technological. It is decision speed. Decisions made in 90 seconds with a structured report are different decisions from the ones made in 90 minutes wading through a spreadsheet.

Run the report on the 5th. Hold the structure. The business will follow.`,
  },
  {
    slug: "building-hawktress-builder-builds-software",
    title: "Building Hawktress: How a Builder Builds Software",
    dek:
      "We did not hire a developer to build a construction platform. We built it ourselves, in Airtable, on top of live jobs we were running. Here is what we learned about why builder-owned software is the only kind that survives contact with a real site.",
    authorId: "nathan",
    date: "2026-05-01",
    readingTime: 9,
    category: "Founder",
    cover: "/images/architect-plans.webp",
    youtubeId: "cbCZbaIoBm4",
    videoLabel: "How To Estimate Jobs For Contractors · Estimating 101",
    videoCredit: "Featured talk · Will Spaulding",
    body: `Most construction software is built by people who have never run a site. The product managers have read about residential construction. The engineers have visited a site once for a customer tour. The designers have never sat in a contract administrator's chair at the end of a Friday afternoon trying to reconcile a $14,000 variation against a quote document that has gone through three revisions.

The result is software that looks good in a demo and dies on a real job.

I have been a builder for 25 years. I have run contract administration for two decades. I have approved or rejected approximately 11,000 variations across that time. When I started building Hawktress, the question I was answering was not "how do we make construction software better." The question was "what would the system look like if a builder had built it from scratch."

The answer turned out to be smaller and more disciplined than the existing market.

## The first decision was Airtable, not custom code

When I told people we were building Hawktress in Airtable, the responses split cleanly. Software people thought it was a temporary scaffolding decision before we built "real" software. Builders thought it was the only sensible decision we could have made.

Airtable was the right answer because it forced us to define the data model before we worried about the interface. Construction is a data problem disguised as a workflow problem. The variations are records. The quotes are records. The actuals are records. The relationships between them are the entire game. Build the records and the relationships first. The interface follows.

The other reason was velocity. JC, our head of operations, can change a field type in Airtable in under a minute. A custom application would have required a deployment cycle for the same change. In the first six months of building Hawktress we changed the schema 34 times. If we had built on a custom stack we would have shipped one schema change a month and it would have been the wrong one.

> Software you can change inside a single morning is software that survives the first contact with a real job. Software that takes a sprint to change is software that fossilises.

## The second decision was internal use first

We did not open Hawktress to a single external builder for the first nine months. Every job we ran went through the platform. Every quote, every variation, every PO, every actual cost. The CA function used it daily. The estimating function used it weekly. The director report came out of it on the 5th of every month.

The reason was simple. If we could not trust the platform to run our own jobs we had no business asking another builder to trust it with theirs.

The internal-first phase taught us things no external customer would ever have told us. The CA needed a different default sort on the variations view than I did. The estimator needed quote documents attached to records, not linked from a shared drive. The supplier performance view needed a per-region cut, not a global one. None of these things would have come up in a customer interview. They came up because the people using the system were the people complaining about the system, and they were sitting two desks from the people building the system.

This is the closed loop that builder-owned software has and external software does not.

## The third decision was no roadmap public commitments

We did not publish a roadmap. We did not pre-sell features. We did not tell anyone the system would do anything until the system actually did it on a real job.

The decision was deliberate. The construction industry has been promised software solutions by every venture-backed company in the sector for the last decade. Most of those promises have not been delivered. Builders have learned to discount roadmaps to zero. The only currency that matters is what the software does today, on a job today, in your CA's hands today.

We will not commit to a feature publicly until the feature has run for at least three months on internal jobs and produced the outcomes we promised. That is the rule.

## The data is the product, not the interface

The Hawktress interface is not impressive by software standards. It is an Airtable workspace with carefully built views and a layer of custom interface components. There are no animations. There is no AI assistant. There is no dashboard with rotating charts.

What there is, is data. Real quote-to-actual variance data on every trade across every region we have built in. Real variation approval data with reasons attached. Real supplier performance data tied to quote accuracy and delivery consistency. Real margin position by job, by builder, by region, over time.

The interface is the layer you use to read the data. The data is the moat.

> Builders do not buy interfaces. Builders buy decisions. The interface is just the vehicle.

This is also why the platform gets stronger the more jobs it sees. Every completed job sharpens the regional benchmarks. Every variation closed adds another data point to the rolling average. Every supplier transaction adds to the performance record. The system that opens to external builders next year will be materially more accurate than the system that opened to internal jobs last year, simply because it has seen more data.

## What this means for the next twelve months

The plan is simple and it is paced. We continue to run the platform on internal jobs through the rest of this year. We open to a small number of external builders next quarter, on annual subscriptions, on the explicit understanding that they are working with a system that has been seasoned on real jobs but is still being shaped by their feedback. We onboard trade subscribers once we have enough builder activity to make the trade benchmarks meaningful in their categories. We open the supplier platform last, once we have the builder and trade data dense enough to support real recommendations.

We are not in a hurry. The construction software graveyard is full of companies that were in a hurry. We would rather be the platform that the industry trusts in three years than the platform that did a big launch this year and disappeared next year.

## What I would tell a builder thinking about software

If you are a builder and you have looked at the construction software market and concluded that none of it fits your business, you are not wrong. None of it fits. The software is built for the average. Your business is not the average.

The answer is not to wait for someone else to build the right software. The answer is to start treating your own jobs as data. Set up an Airtable workspace. Capture every quote, every variation, every actual. Run a CA function that escalates anything outside a threshold. Produce a monthly director report against a discipline.

You do not need Hawktress to do this. You need the discipline to do this. Hawktress is what happens when the discipline runs for long enough across enough jobs that the data starts answering questions before you ask them.

The discipline is the thing. The software is the leverage on the discipline.

---

Hawktress goes to market when it is ready. Until then, every job we run sharpens it. If you are a builder reading this and you want to be one of the early external subscribers when we open the platform, the way in is the same as the way in to anything we do. Email the address at the bottom of the site. Have a real conversation. We work with operators who are serious about margin protection. The rest of the market can keep buying interfaces.`,
  },
];

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}

export function getSortedArticles(): Article[] {
  return [...articles].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getRelatedArticles(slug: string, count = 2): Article[] {
  const current = getArticleBySlug(slug);
  if (!current) return [];
  return [...articles]
    .filter((a) => a.slug !== slug)
    .sort((a, b) => {
      const aSameCat = a.category === current.category ? 0 : 1;
      const bSameCat = b.category === current.category ? 0 : 1;
      if (aSameCat !== bSameCat) return aSameCat - bSameCat;
      return a.date < b.date ? 1 : -1;
    })
    .slice(0, count);
}
