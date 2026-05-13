import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { isAuthConfigured, getSessionEmail } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in or apply · BuildHawk Cost Plan Console",
  description:
    "Sign in to your BuildHawk Cost Plan Console workspace or apply for founding-cohort access. Email magic-link sign in, no passwords.",
  // Public SaaS entry — indexable so prospects can find it.
  robots: { index: true, follow: true },
  openGraph: {
    title: "Sign in · BuildHawk Cost Plan Console",
    description:
      "Pre-contract cost intelligence for residential builders. Sign in or apply for founding-cohort access.",
  },
};

export const dynamic = "force-dynamic";

type Params = Promise<{ next?: string; error?: string; invitationOnly?: string }>;

export default async function LoginPage({ searchParams }: { searchParams: Params }) {
  const sp = await searchParams;
  const email = await getSessionEmail();
  if (email) {
    const target = sp.next && sp.next.startsWith("/") ? sp.next : "/command-centre";
    redirect(target);
  }
  return (
    <LoginForm
      next={sp.next}
      error={sp.error}
      configured={isAuthConfigured()}
      invitationOnly={sp.invitationOnly === "1"}
    />
  );
}
