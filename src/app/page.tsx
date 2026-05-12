import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Lifecycle from "@/components/sections/Lifecycle";
import HowItWorks from "@/components/sections/HowItWorks";
import ValueCase from "@/components/sections/ValueCase";
import Pricing from "@/components/sections/Pricing";
import Integrations from "@/components/sections/Integrations";
import Portfolio from "@/components/sections/Portfolio";
import Founder from "@/components/sections/Founder";
import WhoWeAre from "@/components/sections/WhoWeAre";
import Partners from "@/components/sections/Partners";
import Insights from "@/components/sections/Insights";
import Voices from "@/components/sections/Voices";
import Waitlist from "@/components/sections/Waitlist";
import IntakeForm from "@/components/sections/IntakeForm";
import CtaFooter from "@/components/sections/CtaFooter";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Lifecycle />
      <HowItWorks />
      <ValueCase />
      <Integrations />
      <Pricing />
      <Portfolio />
      <Founder />
      <WhoWeAre />
      <Partners />
      <Insights />
      <Voices />
      <Waitlist />
      <IntakeForm />
      <CtaFooter />
    </main>
  );
}
