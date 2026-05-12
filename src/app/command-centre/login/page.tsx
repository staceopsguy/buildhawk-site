import type { Metadata } from "next";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";
import { isAuthConfigured, getSessionEmail } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Sign in · BuildHawk Cost Plan Console",
  description: "Email magic-link sign in for the BuildHawk Cost Plan Console.",
  robots: { index: false, follow: false },
};

export const dynamic = "force-dynamic";

type Params = Promise<{ next?: string; error?: string }>;

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
    />
  );
}
