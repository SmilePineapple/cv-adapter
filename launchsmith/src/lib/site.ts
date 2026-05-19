export const site = {
  name: "Launchsmith",
  role: "Web & Mobile Developer",
  description:
    "Launchsmith builds clean, modern websites, web apps, and mobile apps — shipped fast, with a professional finish.",
  accent: {
    hex: "#2563eb",
  },
} as const;

export const navItems = [
  { href: "/", label: "Home" },
  { href: "/portfolio", label: "Portfolio" },
  { href: "/about", label: "About" },
  { href: "/services", label: "Services" },
  { href: "/contact", label: "Contact" },
] as const;

