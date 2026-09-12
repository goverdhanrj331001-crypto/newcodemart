import { MarketplaceView } from "@/features/products/components/marketplace-view";

export const metadata = {
  title: "Developer Courses & Tutorials - Pixer Digital Marketplace",
  description: "Learn full-stack Next.js, Flutter mobile app development, Laravel REST APIs, and UI/UX design systems.",
};

export default function CoursesPage() {
  return <MarketplaceView initialNav="courses" />;
}
