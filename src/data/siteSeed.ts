import type { SiteSettings } from "../types";

export const SITE_SETTINGS_SEED: SiteSettings = {
  brandName: "LAP90",
  brandTagline: "Sports Merch",
  logoUrl: "",
  logoAlt: "LAP90 logo",
  contactEmail: "hello@lap90.example",
  contactPhone: "+91 90000 00000",
  contactInstagramUrl: "https://instagram.com/",
  contactAddress: "Calicut, Kerala, India",
  footerNote: "Steel-built fan gear · Built for terraces, tracks, and streets.",
  termsIntro:
    "This page is a template. Replace with your final legal text before going live.",
  termsSections: [
    {
      id: "t1",
      title: "Orders & redirects",
      body:
        "Items may redirect you to a checkout link to complete payment. Always confirm the URL before entering payment details.",
    },
    {
      id: "t2",
      title: "Returns & exchanges",
      body:
        "Returns/exchanges are subject to item condition and timeline. For size exchanges, message us with your order proof and the requested size.",
    },
    {
      id: "t3",
      title: "Shipping",
      body:
        "Dispatch timelines vary by drop. You’ll see item details on the product page and receive a confirmation when your order ships.",
    },
  ],
};

