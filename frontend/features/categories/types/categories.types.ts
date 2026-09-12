export type CategoryGroupType = "tech" | "project_type";

export interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  count: string;
  productCount: number;
  type: CategoryGroupType;
  gradient: string;
  monogram?: string;
  iconName?: string;
  filterCategory: string;
  description: string;
}
