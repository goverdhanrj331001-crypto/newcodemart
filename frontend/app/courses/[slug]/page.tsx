import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { POPULAR_COURSES } from "@/features/courses/data/courses.data";
import { INITIAL_PRODUCTS, MORE_PRODUCTS } from "@/features/products/data/products.data";
import { findProductBySlug, getCleanSlug } from "@/features/products/utils/product.utils";
import { CourseDetailPageWrapper } from "@/features/courses/components/course-detail-page-wrapper";
import { CourseDetailItem } from "@/features/courses/data/courses.data";

interface CoursePageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getAllCatalogItems = () => [...POPULAR_COURSES, ...INITIAL_PRODUCTS, ...MORE_PRODUCTS];

export async function generateStaticParams() {
  return POPULAR_COURSES.map((c) => ({
    slug: getCleanSlug(c.slug),
  }));
}

export async function generateMetadata({ params }: CoursePageProps): Promise<Metadata> {
  const { slug } = await params;
  const allProds = getAllCatalogItems();
  const course = findProductBySlug(slug, allProds);

  if (!course) {
    return {
      title: "Course Not Found - Pixer",
    };
  }

  return {
    title: `${course.title} - Pixer Courses`,
    description: course.description || `Learn ${course.title} with hands-on projects and community support.`,
    openGraph: {
      title: `${course.title} - Pixer`,
      description: course.description,
      images: [course.image],
    },
  };
}

export default async function CourseDetailPage({ params }: CoursePageProps) {
  const { slug } = await params;
  const allProds = getAllCatalogItems();
  const course = findProductBySlug(slug, allProds);

  if (!course) {
    notFound();
  }

  return <CourseDetailPageWrapper course={course as CourseDetailItem} />;
}
