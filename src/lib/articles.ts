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
  category: "Methodology" | "Field Notes" | "Founder" | "Operator Handbook";
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
    title: "The 5% Variance Rule",
    dek:
      "Most builders find out a job is losing money too late to do anything about it. The 5% variance threshold is how you stop that from happening.",
    authorId: "nathan",
    date: "2026-05-04",
    readingTime: 4,
    category: "Methodology",
    cover: "/brand/pattern-3.svg",
    youtubeId: "o9X5uA-pVWA",
    videoLabel: "Construction Contract Variations and Claims with Peter Mallett",
    videoCredit: "Featured talk · 32 min",
    body: `Most builders find out a job is losing money too late to do anything about it.

The 5% variance threshold is how you stop that from happening.

It is not a contingency, a markup buffer, or a pricing allowance. It is a monitoring trigger — a defined tolerance applied across each trade or BOQ section. When actual costs exceed your estimated allowance by 5% or more on any section, the job flags for review. That is the mechanism.

Here is what it looks like in practice.

Your framing package is estimated at $48,000. Timber runs over on supply and the crew logs an extra day due to a structural change. You are now at $52,400 — 9.2% variance on a single section. Without a threshold in place, that number sits unreviewed until the final account. With it active, the flag triggers at $50,400. You still have time to assess whether the change warrants a variation claim, whether another section absorbs the gap, or whether margin needs to be re-baselined.

The same applies to services. Electrical estimated at $22,000. The sparky invoices $23,200 after running additional circuits for a home office scope that was never formalised as a variation. That is 5.5%. Caught early, it is a conversation and a recoverable cost. Caught at Practical Completion, it is a write-off.

Joinery is where it matters most. A $65,000 package with an additional overhead cupboard run and a revised island bench — neither processed as a variation — sits at 6.2% over. That number only surfaces when you are reconciling the job post-handover.

The threshold creates a decision point while options still exist. At 5% variance on a single section, you have three choices: absorb it, recover it elsewhere, or escalate. At 15% across multiple sections no one caught, you have none.

> Builders who operate without a defined variance threshold are not managing cost. They are counting on the final account to tell them what happened.

BuildHawk builds cost control into the estimate before construction starts. The threshold is one part of a structured financial framework that keeps your margin visible from the first trade package to Practical Completion.

If that is a problem you are looking to solve, reply to this email or book a call below.

— BuildHawk`,
  },
  {
    slug: "underpricing-sitework-year-one",
    title: "Why Every Builder Underprices Sitework in Year One",
    dek:
      "Excavation, drainage, retaining and site clean. Together they are usually 4 to 7% of the contract. Builders almost universally get them wrong on the first job in a new region. Here is what to actually budget.",
    authorId: "nathan",
    date: "2024-10-08",
    readingTime: 6,
    category: "Operator Handbook",
    cover: "/brand/pattern-2.svg",
    youtubeId: "bFloySBOcp8",
    videoLabel: "How to start a House Build in Australia · Pre-construction Guide",
    videoCredit: "Featured walkthrough · CourtneyBraz",
    body: `Sitework is the line item that ruins more first-region builds than any other. Frames are easy to estimate. Cabinetry is easy. Roofing is easy. Sitework is the one that hides.

I have worked across Geelong, the Bellarine Peninsula and the western Melbourne fringe for over two decades. Every time we open a job in a suburb we have not built in before, the first sitework estimate is wrong. Not by a small amount.

## What sitework actually contains

When estimators talk about sitework they usually mean four things bundled together:

• Bulk excavation and benching
• Stormwater and sewer connection works
• Retaining walls, where required by site fall
• Site clean and disposal at completion

In urban infill blocks across Melbourne and Geelong, these four items together usually run between 4% and 7% of the contract value on a custom home. On a knockdown rebuild the percentage is higher because of demolition, asbestos clearance and sometimes contaminated soil.

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

**Three.** Caveat the sitework allowance in the contract until soil reports, surveys and council connection points are confirmed. The caveat language gives both sides the right to revise the sitework allowance based on actual site conditions before slab.

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
    title: "Variation Control: The System That Removes Discretion",
    dek:
      "A builder can price a job accurately, manage trades well, and still finish in the red. In most cases, the cause is the same: variations that were completed but never properly controlled.",
    authorId: "nathan",
    date: "2026-05-04",
    readingTime: 5,
    category: "Operator Handbook",
    cover: "/brand/pattern-5.svg",
    youtubeId: "qN8QOmChcxY",
    videoLabel: "Contract variation procedure with worked example",
    videoCredit: "Featured walkthrough · 26 min",
    body: `A builder can price a job accurately, manage trades well, and still finish in the red.

In most cases, the cause is the same: variations that were completed but never properly controlled.

Variations are not the problem. Scope changes on a custom home are inevitable. The problem is the system around them, or more accurately, the absence of one.

Most variation failures follow the same pattern. A client requests a change on site. The project manager agrees to proceed because the change seems minor or stopping work to process paperwork feels disproportionate. The trade completes the work. The cost gets absorbed into the job. At the end of the project, the builder reconciles the final account and finds the job is short by an amount that correlates almost exactly with the unprocessed variations from the previous six months.

The individual amounts rarely look significant in isolation. A $400 change to a tapware selection. An additional day of excavation after rock was struck. A revised balustrade detail that required custom fabrication. Separately, each one feels manageable. Cumulatively, across a $1.2 million project, they represent the difference between a healthy margin and a break-even job.

The second failure point is verbal approval. A client says yes on site. Work proceeds. The variation is never formalised in writing. At the end of the project, the client disputes the charge because they don't remember approving it, or because the final account is higher than expected and they are looking for items to challenge. Without a signed variation order, the builder has no position to stand on.

The third failure point is underpricing. A builder prices a variation quickly, without applying the same rigour used in the original estimate. Preliminaries are not added. Margin is forgotten. The variation is issued at cost. This happens most often on small variations where the builder wants to appear reasonable, and most expensively on large variations where the time pressure is highest.

A controlled variation process starts with one non-negotiable: no work proceeds on any change to contracted scope until a variation has been identified, priced, and submitted for approval. Not after. Not concurrently. Before.

The pricing step is where discipline matters most. A variation is priced the same way as the original estimate: labour, materials, plant, subcontractor costs, site overheads, and margin. Preliminaries are applied where the change extends the programme. Margin is applied at the same rate as the contract. A variation is not a favour. It is a commercial transaction.

Approval must be in writing before work proceeds. Verbal approval with nothing following it in writing is not a variation system. It is a dispute waiting to happen.

Variations should not be held and invoiced at Practical Completion as a lump sum. They should be invoiced progressively so the cash position of the project reflects actual cost at every stage. A builder who invoices $180,000 in unprocessed variations at the end of a job is not running a variation system. They are running a credit facility for their client, funded by their own cash flow.

A residential builder running ten custom homes a year, averaging $900,000 per contract, with a 12% margin target, needs to recover $108,000 per project to hit plan. On a project where $60,000 in variations were completed but not recovered, the margin drops to 5.3%. That is not a rounding error. It is a business model problem that compounds across every project where variation discipline is absent.

> The builders who run clean final accounts are not the ones who have fewer variations. They are the ones who process every variation the same way, every time, regardless of the relationship, the size of the change, or the pressure to keep work moving.

The system removes the discretion. That is precisely why it works.

— BuildHawk`,
  },
  {
    slug: "monthly-director-report-walkthrough",
    title: "Reading the Monthly Director Report: A Walkthrough",
    dek:
      "Every active job, every committed cost, every flagged variation, every dollar of cash position, in one report by the 5th of the month. Here is how to read it in 90 seconds and what to act on first.",
    authorId: "nathan",
    date: "2026-02-04",
    readingTime: 8,
    category: "Methodology",
    cover: "/brand/pattern-1.svg",
    youtubeId: "42PcHNSOSEg",
    videoLabel: "Construction Cost Estimating · Step-by-step guide",
    videoCredit: "Featured walkthrough",
    body: `The monthly director report is the most important single artefact Hawktress produces. It runs to between three and seven pages depending on the size of the builder's active book. It lands in the director's inbox by the 5th of every month. Read correctly, it gives you 90 seconds of certainty about whether the business is on track.

This piece walks through how to read it.

## The structure

Every report has the same five sections in the same order.

**Section 1. Portfolio summary.** One page. Total contracted revenue, total revenue received this period, total committed costs, portfolio gross margin, cash position relative to project commitments and 30 / 60 / 90-day forecast revenue.

**Section 2. Job tracking grid.** One row per active job. Original contract value, current contract value, committed costs, forecast final cost, gross margin forecast, variations approved this month, programme status and an alert column.

**Section 3. Flagged items.** Every line that triggered the 5% variance threshold across every active job in the previous month, with current status.

**Section 4. Aged debtors and outstanding invoices.** Anything over 30 days, with the contact you need to chase.

**Section 5. Escalation items.** Any decision that requires director sign-off before the CA can proceed in the next 14 days.

## How to read it in 90 seconds

Every director who onboards onto the platform gets the same instruction from me. Read the report in this order, with a stopwatch.

**0 to 15 seconds.** Read section 1 only. Look at three numbers. Portfolio gross margin. Cash position relative to commitments. 30-day forecast revenue. If those three numbers are inside the bands you set at the start of the year, the business is on track and you can read the rest at your own pace. If any of the three are outside the band, you have a real meeting to run this morning.

**15 to 45 seconds.** Read section 2's alert column only. Anything red, anything amber. Skip the body of the grid. The alert column is engineered to be the first thing a director's eye lands on. If the alert column is clean, every job is tracking. If it is not, you know which jobs need a phone call before the day starts.

**45 to 75 seconds.** Read section 3's status column. Approved with note. Pushed back. Awaiting director decision. The "awaiting director decision" rows are the ones that block the CA from moving forward. They are the highest-leverage 30 seconds of your week.

**75 to 90 seconds.** Read section 5. These are the items that need your decision in the next 14 days. They are pre-formatted with the question, the recommendation from the CA and the option set. Most of them can be approved or actioned in under a minute each.

The other pages are for context. The first 90 seconds is for action.

> The report is engineered around a director who has 90 seconds and a director who has 90 minutes. Both have to be able to use it.

## What the alert column actually flags

The alert column has four possible states.

**Green.** Job is inside all forecast bands.

**Amber.** Job has at least one metric drifting toward a band edge but no breach yet. Common amber triggers: forecast final cost rising more than 2% in a single month, programme slippage of more than 5 working days against the contracted PC date, an unapproved variation backlog of more than five items or aged debtors on this job over 30 days.

**Red.** At least one metric has breached a band. Common red triggers: gross margin forecast dropped below the floor set at contract award, forecast final cost exceeding current contract value, programme slippage of more than 15 working days or a variation flagged outside the 5% threshold and unresolved for more than 14 days.

**Black.** Catastrophic. Job has a margin forecast below break-even, an unrecoverable cost overrun or a programme breach that triggers liquidated damages. These are escalated by the CA before the report goes out.

If you only ever read the alert column, you will catch every problem.

## The report is also a behaviour-shaping artefact

This is the part most directors miss when they first come on board. The report is not just a status snapshot. It is a behaviour-shaping artefact for the entire team that touches the jobs.

The estimator knows that any quote outside the 5% threshold will appear in section 3 with their name on it. They estimate tighter.

The CA knows that any unapproved variation backlog over five items will turn the alert column amber. They clear variations weekly.

The site team knows that any programme slippage over five days will turn amber and over fifteen days will turn red. They flag programme risk early instead of hiding it.

The director knows that any decision they have not made within 14 days will roll forward into section 5 of next month's report and be highlighted. They make decisions on time.

The report is the operating cadence of the business. It is also the document that proves the operating cadence is being held.

## The 5th of the month is non-negotiable

Reports issued on the 12th are reports nobody reads. The discipline of the 5th-of-the-month deadline is the discipline that keeps the report relevant. If your CA cannot produce the report by the 5th, the operating system upstream of the CA is broken. Fix that before you fix anything else.

## What to look for in your first three reports

If you are new to Hawktress and the report has just landed for the first time, look for three things.

**One.** Are the numbers in section 1 the numbers you expected? If they are not, your forecasts were wrong, which is fine, you now have data. Calibrate.

**Two.** Are the alert states in section 2 consistent with your gut feel about each job? Where the alert disagrees with your gut, the alert is usually right.

**Three.** Are there flagged items in section 3 that you would have approved without question if they had not been flagged? If there are, that is the value of the threshold. Those are the items that would have eaten your margin invisibly. Make a note of which ones, why they were flagged and what you decided.

By the third monthly report, the rhythm is set. By the sixth, the report is your single most reliable source of truth about the business.

---

If you are a builder running a director-level dashboard right now from spreadsheets and gut feel, the difference between that and a structured monthly report is not technological. It is decision speed. Decisions made in 90 seconds with a structured report are different decisions from the ones made in 90 minutes wading through a spreadsheet.

Run the report on the 5th. Hold the structure. The business will follow.`,
  },
  {
    slug: "building-hawktress-builder-builds-software",
    title: "Hawktress: Cost Data That Actually Matters",
    dek:
      "The cost data that actually matters in construction has never lived in a software platform. It lives in completed jobs. Hawktress is an attempt to fix that.",
    authorId: "nathan",
    date: "2026-05-04",
    readingTime: 5,
    category: "Founder",
    cover: "/images/founder-mark.svg",
    youtubeId: "cbCZbaIoBm4",
    videoLabel: "How To Estimate Jobs For Contractors · Estimating 101",
    videoCredit: "Featured talk · Will Spaulding",
    body: `The cost data that actually matters in construction has never lived in a software platform. It lives in completed jobs.

Hawktress is an attempt to fix that.

Every estimating platform in the market is built on the same premise: give builders a place to input numbers. The assumption is that builders already know what those numbers should be. For a first-time estimate on an unfamiliar build type, in a market you haven't priced in six months, that assumption is where margin starts to erode.

The problem is not that builders lack tools. It is that the tools lack real data.

Published cost guides, QS indices, and square metre rates are useful for feasibility. They are not useful for live estimating decisions. They are averages, smoothed across geographies, build types, and time periods that may no longer reflect current conditions. By the time that data is published, it is already historical.

The data that is actually reliable comes from one place: jobs that have been built and reconciled. What a concreter charged per square metre for a waffle pod slab in a specific postcode, in a specific month, with specific site conditions. What a joinery package cost for a 280m² custom home with stone benchtops, full-height cabinetry, and a butler's pantry. What the delta was between the estimated and actual cost, and why.

That data exists. It just has not been captured in a structured, queryable format. It sits in spreadsheets, in job files, in email threads, and in the memory of estimators who have priced enough work to develop a feel for what things actually cost. That feel is valuable. It does not scale, it does not transfer, and it disappears when a team member leaves.

Hawktress started as a simple question: what if every job we completed fed data back into the next estimate?

The answer was not to build another estimating platform. The answer was to build a cost intelligence layer that sits behind the estimate, pulling from reconciled project data to validate allowances before they are locked in. A reference database, not a workflow tool.

The architecture is straightforward. A record per trade package, per job, capturing estimated cost, actual cost, variance, postcode, build type, floor area, and completion date. Simple to input. Powerful to query.

The discipline was in what not to build. No dashboards before the data is dense enough to be meaningful. No automation before the input process is stable. Builders who build software the way they build houses, by starting with structure before finishes, end up with something that works.

In practice, an estimator pricing a structural steel package for a two-storey custom home in coastal Victoria can query Hawktress for comparable packages from the last twelve months and use the actual cost range to stress-test their allowance before the estimate is finalised. Not as a replacement for a trade quote. As a check against an allowance that might be sitting 8% below where the market has moved.

> That is the function. Not prediction. Not automation. A structured reference that reduces the gap between what an estimator thinks something costs and what a subcontractor is going to charge for it.

The value of the database compounds with every job that feeds it. At fifty reconciled projects, it is a useful reference. At five hundred, it becomes a pricing intelligence asset that no published cost guide can replicate, because no published cost guide is built from the jobs you actually built.

For now, Hawktress is how BuildHawk makes the next estimate more accurate than the last one.

— BuildHawk`,
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
