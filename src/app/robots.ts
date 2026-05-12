import type { MetadataRoute } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://buildhawk.com.au";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/command-centre/request-access"],
        // /command-centre is a gated app surface; let the marketing site and
        // the request-access landing rank, hide the rest.
        disallow: [
          "/api/",
          "/command-centre",
          "/command-centre/login",
          "/command-centre/architecture",
          "/command-centre/new-project",
          "/command-centre/projects/",
        ],
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
    host: SITE_URL,
  };
}
