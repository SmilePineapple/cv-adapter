import type { Metadata } from "next";
import LocalizedLandingPage from "@/components/LocalizedLandingPage";

export const metadata: Metadata = {
  title: "MyCV Buddy — Currículos que fazem você ser notado",
  description:
    "Adapte seu currículo para qualquer vaga com IA. Compatível com ATS, comece grátis.",
};

export default function PortugueseLandingPage() {
  return <LocalizedLandingPage locale="pt" />;
}
