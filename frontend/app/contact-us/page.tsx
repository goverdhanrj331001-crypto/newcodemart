import { MarketplaceView } from "@/features/products/components/marketplace-view";

export const metadata = {
  title: "Contact Support - Pixer Digital Marketplace",
  description: "Get in touch with Pixer support for product inquiries, custom development, or author assistance.",
};

export default function ContactPage() {
  return <MarketplaceView initialNav="contact-us" />;
}
