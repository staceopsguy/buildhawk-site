import type { Metadata } from "next";
import { redirect } from "next/navigation";
import SignupForm from "./SignupForm";
import { isAuthConfigured, getSession } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Start your BuildHawk workspace · Cost Plan Console",
  description: "Create your BuildHawk Cost Plan Console workspace. 14-day trial, no credit card.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = Promise<{ plan?: string; orphan?: string }>;

export default async function SignupPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const session = await getSession();
  if (session) redirect("/command-centre");
  return (
    <SignupForm
      configured={isAuthConfigured()}
      initialPlan={sp.plan}
      orphan={sp.orphan === "1"}
    />
  );
}
