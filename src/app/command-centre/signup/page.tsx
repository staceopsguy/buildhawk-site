import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SignupForm from "./SignupForm";
import { isAuthConfigured, getSession, isSignupDisabled } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Start your BuildHawk workspace · Cost Plan Console",
  description:
    "Create your BuildHawk Cost Plan Console workspace. 14-day free trial. No credit card required. Pre-contract cost intelligence for residential builders.",
  // Public SaaS entry — indexable so the signup page can rank for "buildhawk signup".
  robots: { index: true, follow: true },
  openGraph: {
    title: "Start your BuildHawk workspace · 14-day free trial",
    description:
      "Pre-contract cost intelligence for residential builders. Live margin, cashflow forecast, variation flags. No credit card to start.",
  },
};

export const dynamic = "force-dynamic";

type Params = Promise<{ plan?: string; orphan?: string }>;

export default async function SignupPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const session = await getSession();
  if (session) redirect("/command-centre");
  // Lockdown: bounce visitors to login (Request access tab does the lead-gen).
  if (isSignupDisabled()) redirect("/command-centre/login?invitationOnly=1");
  return (
    <SignupForm
      configured={isAuthConfigured()}
      initialPlan={sp.plan}
      orphan={sp.orphan === "1"}
    />
  );
}
