import { MarketplaceView } from "@/features/products/components/marketplace-view";

export const metadata = {
  title: "Explore Products - Pixer Digital Marketplace",
  description: "WordPress Themes & Creative UI/UX Templates. Explore digital products, mobile UI kits, templates, and scripts.",
};

export default function ExplorePage() {
  return <MarketplaceView initialNav="explore" />;
}
