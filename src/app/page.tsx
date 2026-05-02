import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Pillars from "@/components/sections/Pillars";
import HowItWorks from "@/components/sections/HowItWorks";
import Portfolio from "@/components/sections/Portfolio";
import WhoWeAre from "@/components/sections/WhoWeAre";
import Testimonials from "@/components/sections/Testimonials";
import IntakeForm from "@/components/sections/IntakeForm";
import CtaFooter from "@/components/sections/CtaFooter";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Pillars />
      <HowItWorks />
      <Portfolio />
      <WhoWeAre />
      <Testimonials />
      <IntakeForm />
      <CtaFooter />
    </main>
  );
}
