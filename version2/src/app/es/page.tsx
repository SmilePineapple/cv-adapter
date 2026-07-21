import type { Metadata } from "next";
import LocalizedLandingPage from "@/components/LocalizedLandingPage";

export const metadata: Metadata = {
  title: "MyCV Buddy — CVs que consiguen que te vean",
  description:
    "Adapta tu CV a cualquier oferta de trabajo con IA. Compatible con ATS, empieza gratis.",
};

export default function SpanishLandingPage() {
  return <LocalizedLandingPage locale="es" />;
}
