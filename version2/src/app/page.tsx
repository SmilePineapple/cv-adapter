import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Features from "@/components/Features";
import ToolsShowcase from "@/components/ToolsShowcase";
import Pricing from "@/components/Pricing";
import Footer from "@/components/Footer";
import SmoothScroll from "@/components/SmoothScroll";

export default function Home() {
  return (
    <SmoothScroll>
      <Nav />
      <main className="flex-1">
        <Hero />
        <HowItWorks />
        <Features />
        <ToolsShowcase />
        <Pricing />
      </main>
      <Footer />
    </SmoothScroll>
  );
}
