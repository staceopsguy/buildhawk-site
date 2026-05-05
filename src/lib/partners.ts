export type Partner = {
  name: string;
  src: string;
  width: number;
  height: number;
  url?: string;
  badge?: string;
  /** When the partner's source logo is designed for dark backgrounds
   * (white elements on transparent), the tile uses bg-bh-ink so the
   * logo stays legible. Otherwise the tile is always-light bh-paper. */
  darkTile?: boolean;
};

export type Owner = {
  name: string;
  role: string;
  src: string;
};

export type FeaturedCaseStudy = {
  name: string;
  src: string;
  width: number;
  height: number;
  url: string;
  category: string;
  headline: string;
  blurb: string;
  metrics: { k: string; v: string }[];
  owners: Owner[];
};

export type Accreditation = {
  name: string;
  description: string;
  src: string; // image — full strip or single badge
  width: number;
  height: number;
  through: string; // partner who provides this credential link
  throughUrl: string;
  kind?: "award" | "partner-program";
};

export const featuredCaseStudy: FeaturedCaseStudy = {
  name: "Ockenden Group",
  src: "/logos/ockenden-group.png",
  width: 480,
  height: 180,
  url: "https://ockendengroup.com/",
  category: "Featured case study",
  headline: "Margin locked in — not chased.",
  blurb:
    "Ockenden run Hawktress™ across their live jobs. This isn't reporting after the fact — it's control built into how they operate day to day. Variations managed properly. Margins protected early. Decisions made with clarity, not guesswork. Nothing bolted on. It's how the job runs.",
  metrics: [
    { k: "Margin threshold", v: "5% locked in" },
    { k: "Reporting", v: "Monthly · accountable" },
    { k: "Engagement", v: "Tender → Handover" },
  ],
  owners: [
    {
      name: "Ben Ockenden",
      role:
        "Director · 25+ years on the tools — knows where jobs go wrong and how to stop it",
      src: "/images/ockenden-ben.jpg",
    },
  ],
};

export const partners: Partner[] = [
  {
    name: "Homes By NH",
    src: "/logos/homes-by-nh.webp",
    width: 320,
    height: 120,
    darkTile: true,
  },
  {
    name: "Buena Vista Homes",
    src: "/logos/buena-vista-homes.png",
    width: 320,
    height: 120,
    darkTile: true,
  },
  {
    name: "Built On It",
    src: "/logos/built-on-it.png",
    width: 320,
    height: 120,
    url: "https://www.builtonit.com.au/",
    badge: "Cybersecurity",
    darkTile: true,
  },
  { name: "Mindset 365", src: "/logos/mindset-365.svg", width: 320, height: 120 },
  {
    name: "Xact Accounting",
    src: "/logos/xact-accounting.png",
    width: 320,
    height: 120,
    url: "https://xactaccounting.com.au/",
    badge: "Partner",
  },
  {
    name: "Buildxact",
    src: "/logos/buildxact.png",
    width: 320,
    height: 80,
    url: "https://www.buildxact.com/us/",
    badge: "Integration",
    darkTile: true,
  },
  { name: "Softriver", src: "/logos/softriver.svg", width: 320, height: 80 },
  { name: "Tapang Group", src: "/logos/tapang-group.svg", width: 320, height: 80 },
];

export const accreditations: Accreditation[] = [
  {
    name: "Australian Accounting Awards · Firm of the Year 2025",
    description:
      "Australian Accounting Awards 2025 Winner — Firm of the Year. Issued by Accountants Daily.",
    src: "/images/xact-awards-2025.png",
    width: 1178,
    height: 400,
    through: "Xact Accounting",
    throughUrl: "https://xactaccounting.com.au/",
    kind: "award",
  },
  {
    name: "Financial Review Top 100 Accounting Firms 2025",
    description:
      "Recognised in the Australian Financial Review Top 100 Accounting Firms list, presented by Xero.",
    src: "/images/xact-awards-2025.png",
    width: 1178,
    height: 400,
    through: "Xact Accounting",
    throughUrl: "https://xactaccounting.com.au/",
    kind: "award",
  },
  {
    name: "Commercial Finance Awards · Accounting Practice of the Year 2025",
    description:
      "Commercial Finance Awards 2025 Winner — Accounting Practice of the Year.",
    src: "/images/xact-awards-2025.png",
    width: 1178,
    height: 400,
    through: "Xact Accounting",
    throughUrl: "https://xactaccounting.com.au/",
    kind: "award",
  },
  {
    name: "Microsoft 365 Partner",
    description:
      "Microsoft 365 cloud productivity and identity stack delivered through our cybersecurity partner Built On It.",
    src: "/images/builtonit-microsoft365.png",
    width: 283,
    height: 60,
    through: "Built On It",
    throughUrl: "https://www.builtonit.com.au/",
    kind: "partner-program",
  },
  {
    name: "Datto Professional Global Partner Program",
    description:
      "Datto Professional Global Partner — backup, business continuity and managed cybersecurity coverage via Built On It.",
    src: "/images/builtonit-datto.png",
    width: 193,
    height: 151,
    through: "Built On It",
    throughUrl: "https://www.builtonit.com.au/",
    kind: "partner-program",
  },
  {
    name: "Access4 Partner",
    description:
      "Access4 unified cloud communications and Teams calling, integrated through Built On It.",
    src: "/images/builtonit-access4.png",
    width: 290,
    height: 57,
    through: "Built On It",
    throughUrl: "https://www.builtonit.com.au/",
    kind: "partner-program",
  },
];
