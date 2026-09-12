import { MarketplaceView } from "@/features/products/components/marketplace-view";

export const metadata = {
  title: "Categories - By Tech & Project Type - Pixer Digital Marketplace",
  description: "Browse templates and digital products categorized by Technology (React, Next.js, Flutter, Laravel, WordPress) and by Project Type (E-Commerce, Mobile Apps, Dashboards).",
};

export default function CategoriesPage() {
  return <MarketplaceView initialNav="categories" />;
}
