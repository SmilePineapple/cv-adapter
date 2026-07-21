import type { Metadata } from "next";
import LocalizedLandingPage from "@/components/LocalizedLandingPage";

export const metadata: Metadata = {
  title: "MyCV Buddy — ऐसे रिज़्यूमे जो आपको दिखाएं",
  description:
    "AI की मदद से अपने रिज़्यूमे को किसी भी नौकरी के लिए अनुकूलित करें। ATS-अनुकूल, बीटा के दौरान मुफ़्त।",
};

export default function HindiLandingPage() {
  return <LocalizedLandingPage locale="hi" />;
}
