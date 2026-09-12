import React from "react";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { INITIAL_PRODUCTS, MORE_PRODUCTS } from "@/features/products/data/products.data";
import { POPULAR_COURSES } from "@/features/courses/data/courses.data";
import { findProductBySlug } from "@/features/products/utils/product.utils";
import { ProductDetailsView } from "@/features/products/components/product-details/product-details-view";
import { CourseDetailPageWrapper } from "@/features/courses/components/course-detail-page-wrapper";
import { CourseDetailItem } from "@/features/courses/data/courses.data";

interface ProductPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const getAllCatalogItems = () => [...INITIAL_PRODUCTS, ...MORE_PRODUCTS, ...POPULAR_COURSES];

export async function generateStaticParams() {
  const allProds = getAllCatalogItems();
  return allProds.map((p) => ({
    slug: p.slug.replace(/^\/?products\//, "").replace(/^\/+/, ""),
  }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const allProds = getAllCatalogItems();
  const product = findProductBySlug(slug, allProds);

  if (!product) {
    return {
      title: "Product Not Found - Pixer",
    };
  }

  return {
    title: `${product.title} - Pixer`,
    description: product.description || `Buy ${product.title} on Pixer Digital Marketplace.`,
    openGraph: {
      title: `${product.title} - Pixer`,
      description: product.description,
      images: [product.image],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const allProds = getAllCatalogItems();
  const product = findProductBySlug(slug, allProds);

  if (!product) {
    notFound();
  }

  if (product.id.startsWith("course-")) {
    return <CourseDetailPageWrapper course={product as CourseDetailItem} />;
  }

  return <ProductDetailsView product={product} />;
}

