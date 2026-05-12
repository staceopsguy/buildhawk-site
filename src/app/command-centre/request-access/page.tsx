import type { Metadata } from "next";
import RequestAccessForm from "./RequestAccessForm";

export const metadata: Metadata = {
  title: "Request access · BuildHawk Cost Plan Console",
  description:
    "Apply for access to the BuildHawk Cost Plan Console. Founding-cohort pricing. We'll review your application and respond within one business day.",
  robots: { index: true, follow: true },
  openGraph: {
    title: "Request access · BuildHawk Cost Plan Console",
    description:
      "Pre-contract cost intelligence for residential builders. Apply for founding-cohort access.",
  },
};

export default function RequestAccessPage() {
  return <RequestAccessForm />;
}
