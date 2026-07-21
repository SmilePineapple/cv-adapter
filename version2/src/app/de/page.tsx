import type { Metadata } from "next";
import LocalizedLandingPage from "@/components/LocalizedLandingPage";

export const metadata: Metadata = {
  title: "MyCV Buddy — Lebensläufe, die auffallen",
  description:
    "Passen Sie Ihren Lebenslauf mit KI an jede Stelle an. ATS-kompatibel, kostenlos starten.",
};

export default function GermanLandingPage() {
  return <LocalizedLandingPage locale="de" />;
}
