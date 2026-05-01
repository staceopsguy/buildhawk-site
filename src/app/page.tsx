import Nav from "@/components/Nav";
import Hero from "@/components/sections/Hero";
import Pillars from "@/components/sections/Pillars";
import HowItWorks from "@/components/sections/HowItWorks";
import WhoWeAre from "@/components/sections/WhoWeAre";
import Testimonials from "@/components/sections/Testimonials";
import CtaFooter from "@/components/sections/CtaFooter";

export default function Home() {
  return (
    <main className="relative">
      <Nav />
      <Hero />
      <Pillars />
      <HowItWorks />
      <WhoWeAre />
      <Testimonials />
      <CtaFooter />
    </main>
  );
}
