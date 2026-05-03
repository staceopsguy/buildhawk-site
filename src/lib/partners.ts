export type Partner = {
  name: string;
  src: string;
  width: number;
  height: number;
  url?: string;
  badge?: string;
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
};

export const featuredCaseStudy: FeaturedCaseStudy = {
  name: "Ockenden Group",
  src: "/logos/ockenden-group.png",
  width: 480,
  height: 180,
  url: "https://ockendengroup.com/",
  category: "Featured case study",
  headline: "Margin discipline at scale.",
  blurb:
    "Ockenden Group runs Hawktress™ across an active residential book. Variation control, the 5% threshold and director-grade reporting embedded into how the business actually operates — not bolted on.",
  metrics: [
    { k: "Threshold enforced", v: "5%" },
    { k: "Reporting cadence", v: "Monthly" },
    { k: "Engagement", v: "Tender → Completion" },
  ],
  owners: [
    {
      name: "Ben Ockenden",
      role: "Director · Master Builder · 25+ yrs",
      src: "/images/ockenden-ben.jpg",
    },
  ],
};

export const partners: Partner[] = [
  { name: "Homes By NH", src: "/logos/homes-by-nh.webp", width: 320, height: 120 },
  { name: "Buena Vista Homes", src: "/logos/buena-vista-homes.png", width: 320, height: 120 },
  {
    name: "Built On It",
    src: "/logos/built-on-it.png",
    width: 320,
    height: 120,
    url: "https://www.builtonit.com.au/",
    badge: "Cybersecurity",
  },
  { name: "Uprise Projects", src: "/logos/uprise-projects.jpg", width: 320, height: 120 },
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
  },
];
