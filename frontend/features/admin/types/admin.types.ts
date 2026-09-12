export interface AdminUser {
  id: string;
  name: string;
  email: string;
  avatar: string;
  permissions: ("customer" | "store_owner" | "admin" | "super_admin")[];
  walletPoints: number;
  status: "Active" | "Inactive" | "Banned";
  createdAt: string;
}

export interface AdminOrder {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  itemsCount: number;
  totalAmount: number;
  status: "Pending" | "Processing" | "Completed" | "Cancelled";
  date: string;
  paymentMethod: string;
}

export interface AdminReview {
  id: string;
  userName: string;
  userAvatar: string;
  productTitle: string;
  rating: number;
  comment: string;
  date: string;
  status: "Approved" | "Pending" | "Rejected";
}

export interface AdminBanner {
  id: string;
  title: string;
  subtitle: string;
  type: "explore_carousel" | "courses_top" | "popup_promo";
  imageUrl: string;
  targetUrl: string;
  badgeText?: string;
  discountTag?: string;
  isActive: boolean;
}

export interface AdminShop {
  id: string;
  name: string;
  logo: string;
  ownerName: string;
  ownerEmail: string;
  productsCount: number;
  ordersCount: number;
  revenue: number;
  status: "Active" | "Pending" | "Suspended";
}

export interface AdminSettings {
  siteTitle: string;
  siteDescription: string;
  currencySymbol: string;
  supportEmail: string;
  contactNumber: string;
  enableVendorRegistration: boolean;
  enableGuestCheckout: boolean;
  popupBannerEnabled: boolean;
}
