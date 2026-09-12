import { MarketplaceView } from "@/features/products/components/marketplace-view";

export const metadata = {
  title: "Social Community Hub - Pixer Digital Marketplace",
  description: "Connect with the Pixer community on Discord, Twitter/X, GitHub, YouTube, and Dribbble.",
};

export default function SocialPage() {
  return <MarketplaceView initialNav="social" />;
}
