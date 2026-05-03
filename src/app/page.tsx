import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Lifecycle from "@/components/sections/Lifecycle";
import HowItWorks from "@/components/sections/HowItWorks";
import ValueCase from "@/components/sections/ValueCase";
import Pricing from "@/components/sections/Pricing";
import Portfolio from "@/components/sections/Portfolio";
import Founder from "@/components/sections/Founder";
import WhoWeAre from "@/components/sections/WhoWeAre";
import Insights from "@/components/sections/Insights";
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
      <Pricing />
      <Portfolio />
      <Founder />
      <WhoWeAre />
      <Insights />
      <IntakeForm />
      <CtaFooter />
    </main>
  );
}
