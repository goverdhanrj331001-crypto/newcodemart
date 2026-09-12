import { AdminUser, AdminOrder, AdminReview, AdminBanner, AdminShop, AdminSettings } from "../types/admin.types";

export const INITIAL_ADMIN_USERS: AdminUser[] = [
  { id: "300", name: "zhakan", email: "zhakanhendi@gmail.com", avatar: "https://picsum.photos/seed/zhakan/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-03-01" },
  { id: "299", name: "anwar", email: "anwar@gmail.com", avatar: "https://picsum.photos/seed/anwar/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-03-01" },
  { id: "298", name: "smith", email: "smithhike8@gmail.com", avatar: "https://picsum.photos/seed/smith/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-28" },
  { id: "297", name: "badi", email: "badissi@gmail.com", avatar: "https://picsum.photos/seed/badi/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-27" },
  { id: "296", name: "RAKIB SHEIKH", email: "rakibsheikha12@gmail.com", avatar: "https://picsum.photos/seed/rakib/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-25" },
  { id: "295", name: "f", email: "sa@gmail.com", avatar: "https://picsum.photos/seed/f/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-24" },
  { id: "294", name: "yus", email: "yus@gmaill.com", avatar: "https://picsum.photos/seed/yus/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-22" },
  { id: "293", name: "chairo", email: "chario@mail.com", avatar: "https://picsum.photos/seed/chairo/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-20" },
  { id: "292", name: "testingseller", email: "testingseller@pixer.com", avatar: "https://picsum.photos/seed/testingseller/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-18" },
  { id: "291", name: "rveqMCCYVFyMkfBdHHrKg", email: "qe.b.e.xof.a.1.2@gmail.com", avatar: "https://picsum.photos/seed/rveq/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-15" },
  { id: "290", name: "fghjkl", email: "smmagen98@gmail.com", avatar: "https://picsum.photos/seed/fghjkl/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-10" },
  { id: "289", name: "abcd", email: "abcd@abcd.com", avatar: "https://picsum.photos/seed/abcd/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-05" },
  { id: "288", name: "jkjh", email: "gymato@fxzig.com", avatar: "https://picsum.photos/seed/jkjh/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-02-01" },
  { id: "287", name: "ankit", email: "ankitrabadiya722@gmail.com", avatar: "https://picsum.photos/seed/ankit/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-01-28" },
  { id: "286", name: "MD MONIR HOSSEN", email: "monir.sasedu@gmail.com", avatar: "https://picsum.photos/seed/monir/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-01-25" },
  { id: "285", name: "Ferdinand", email: "injiracash@gmail.com", avatar: "https://picsum.photos/seed/ferdinand/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-01-20" },
  { id: "284", name: "TTrung24", email: "ngductrung6@gmail.com", avatar: "https://picsum.photos/seed/ttrung/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-01-15" },
  { id: "283", name: "Bertobaseit", email: "itmaster1710@gmail.com", avatar: "https://picsum.photos/seed/berto/100/100", permissions: ["customer", "store_owner"], walletPoints: 110, status: "Active", createdAt: "2026-01-10" },
  { id: "282", name: "Animas Caustro", email: "acaustro@gmail.com", avatar: "https://picsum.photos/seed/animas/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-01-05" },
  { id: "281", name: "Ginuwine", email: "ginuwine57@yahoo.fr", avatar: "https://picsum.photos/seed/ginuwine/100/100", permissions: ["customer", "store_owner"], walletPoints: 100, status: "Active", createdAt: "2026-01-01" },
];

export const INITIAL_ADMIN_ORDERS: AdminOrder[] = [
  { id: "ORD-1016", orderNumber: "ORD-2026-1016", customerName: "zhakan", customerEmail: "zhakanhendi@gmail.com", itemsCount: 2, totalAmount: 89.0, status: "Completed", date: "2026-03-10", paymentMethod: "Credit Card" },
  { id: "ORD-1015", orderNumber: "ORD-2026-1015", customerName: "anwar", customerEmail: "anwar@gmail.com", itemsCount: 1, totalAmount: 49.0, status: "Completed", date: "2026-03-09", paymentMethod: "PayPal" },
  { id: "ORD-1014", orderNumber: "ORD-2026-1014", customerName: "smith", customerEmail: "smithhike8@gmail.com", itemsCount: 3, totalAmount: 135.2, status: "Processing", date: "2026-03-08", paymentMethod: "Stripe" },
  { id: "ORD-1013", orderNumber: "ORD-2026-1013", customerName: "RAKIB SHEIKH", customerEmail: "rakibsheikha12@gmail.com", itemsCount: 1, totalAmount: 29.0, status: "Pending", date: "2026-03-07", paymentMethod: "Wallet" },
  { id: "ORD-1012", orderNumber: "ORD-2026-1012", customerName: "yus", customerEmail: "yus@gmaill.com", itemsCount: 2, totalAmount: 98.0, status: "Cancelled", date: "2026-03-05", paymentMethod: "Credit Card" },
  { id: "ORD-1011", orderNumber: "ORD-2026-1011", customerName: "ankit", customerEmail: "ankitrabadiya722@gmail.com", itemsCount: 1, totalAmount: 45.0, status: "Completed", date: "2026-03-02", paymentMethod: "PayPal" },
];

export const INITIAL_ADMIN_SHOPS: AdminShop[] = [
  { id: "1", name: "Redq Digital Studio", logo: "https://picsum.photos/seed/redq/100/100", ownerName: "Jhon Doe", ownerEmail: "admin@pixer.com", productsCount: 45, ordersCount: 120, revenue: 14500.0, status: "Active" },
  { id: "2", name: "ThemeForest Elite Author", logo: "https://picsum.photos/seed/themeforest/100/100", ownerName: "Alex Smith", ownerEmail: "alex@themes.com", productsCount: 28, ordersCount: 85, revenue: 9800.0, status: "Active" },
  { id: "3", name: "Flutter Mobile Crafters", logo: "https://picsum.photos/seed/fluttermobile/100/100", ownerName: "Sarah Jenkins", ownerEmail: "sarah@fluttermobile.io", productsCount: 19, ordersCount: 62, revenue: 7200.0, status: "Active" },
  { id: "4", name: "Laravel Artisan Hub", logo: "https://picsum.photos/seed/laravelartisan/100/100", ownerName: "Michael Chang", ownerEmail: "michael@laravelartisan.com", productsCount: 14, ordersCount: 41, revenue: 5100.0, status: "Pending" },
];

export const INITIAL_ADMIN_REVIEWS: AdminReview[] = [
  { id: "REV-1", userName: "Ankit Rabadiya", userAvatar: "https://picsum.photos/seed/ankit/100/100", productTitle: "Next.js E-Commerce Full-stack Starter", rating: 5, comment: "Top-notch code quality! Clean App Router structure and easy to customize.", date: "2026-03-08", status: "Approved" },
  { id: "REV-2", userName: "Rakib Sheikh", userAvatar: "https://picsum.photos/seed/rakib/100/100", productTitle: "Flutter Mobile App UI Kit & API", rating: 5, comment: "Amazing smooth animations and zero lint errors. Saved us 2 months of work.", date: "2026-03-06", status: "Approved" },
  { id: "REV-3", userName: "Smith Hike", userAvatar: "https://picsum.photos/seed/smith/100/100", productTitle: "Laravel REST API & Blade Admin Suite", rating: 4, comment: "Very comprehensive documentation and security rules.", date: "2026-03-01", status: "Approved" },
];

export const INITIAL_ADMIN_BANNERS: AdminBanner[] = [
  {
    id: "BAN-1",
    title: "WordPress Themes & Creative UI/UX Templates",
    subtitle: "High performance digital marketplace for themes, templates, scripts & creative assets.",
    type: "explore_carousel",
    imageUrl: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/1.png",
    targetUrl: "/explore",
    badgeText: "Exclusive Digital Assets",
    discountTag: "Save Up To 50% Off",
    isActive: true,
  },
  {
    id: "BAN-2",
    title: "Master Full-Stack Web & Mobile Development",
    subtitle: "Hands-on video courses taught by industry veterans with full source code download.",
    type: "courses_top",
    imageUrl: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/3.png",
    targetUrl: "/courses",
    badgeText: "Developer Academy",
    discountTag: "Get Certified Today",
    isActive: true,
  },
  {
    id: "BAN-3",
    title: "Limited Time Offer: Get 30% Off All Next.js Kits!",
    subtitle: "Use coupon code PIXER30 at checkout before the end of the week.",
    type: "popup_promo",
    imageUrl: "https://picsum.photos/seed/popbanner/800/400",
    targetUrl: "/explore",
    badgeText: "Special Promo",
    discountTag: "30% OFF",
    isActive: true,
  },
];

export const INITIAL_ADMIN_SETTINGS: AdminSettings = {
  siteTitle: "Pixer - Digital Marketplace",
  siteDescription: "A high-performance digital marketplace for themes, templates, scripts, wireframes, and creative design assets.",
  currencySymbol: "$",
  supportEmail: "support@pixer.com",
  contactNumber: "+1 (800) 555-0199",
  enableVendorRegistration: true,
  enableGuestCheckout: true,
  popupBannerEnabled: true,
};
