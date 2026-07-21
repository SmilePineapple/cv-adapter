import type { Metadata } from "next";
import LocalizedLandingPage from "@/components/LocalizedLandingPage";

export const metadata: Metadata = {
  title: "MyCV Buddy — سير ذاتية تجعلك مرئيًا",
  description:
    "خصص سيرتك الذاتية لأي وظيفة باستخدام الذكاء الاصطناعي. متوافق مع أنظمة تتبع المتقدمين، مجاني خلال الفترة التجريبية.",
};

export default function ArabicLandingPage() {
  return <LocalizedLandingPage locale="ar" />;
}
