import type { Metadata } from "next";
import LocalizedLandingPage from "@/components/LocalizedLandingPage";

export const metadata: Metadata = {
  title: "MyCV Buddy — Des CV qui se font remarquer",
  description:
    "Adaptez votre CV à n'importe quelle offre d'emploi avec l'IA. Compatible ATS, gratuit pendant la bêta.",
};

export default function FrenchLandingPage() {
  return <LocalizedLandingPage locale="fr" />;
}
