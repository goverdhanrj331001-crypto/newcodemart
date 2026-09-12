export interface Course {
  id: string;
  title: string;
  slug: string;
  image: string;
  category: string;
  instructor: {
    name: string;
    avatar: string;
    role?: string;
  };
  price: string;
  originalPrice?: string;
  isFree?: boolean;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  duration: string;
  lessons: number;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  badge?: "Bestseller" | "Hot" | "Updated" | "New";
  description: string;
  features: string[];
  curriculum: {
    title: string;
    lessons: number;
    duration: string;
  }[];
}
