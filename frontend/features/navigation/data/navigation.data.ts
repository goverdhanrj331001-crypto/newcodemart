import { NavItem, FooterLink } from "../types/navigation.types";

export const PRIMARY_NAV_ITEMS: NavItem[] = [
  {
    id: "home",
    label: "Home",
    href: "/",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-7.svg",
    isActive: true,
  },
  {
    id: "explore",
    label: "Explore",
    href: "/explore",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-8.svg",
  },
  {
    id: "popular-products",
    label: "Popular Products",
    href: "/popular-products",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-9.svg",
  },
  {
    id: "categories",
    label: "Categories",
    href: "/categories",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-10.svg",
  },
  {
    id: "courses",
    label: "Courses",
    href: "/courses",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-11.svg",
  },
  {
    id: "contact-us",
    label: "Contact",
    href: "/contact-us",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-12.svg",
  },
  {
    id: "social",
    label: "Social",
    href: "/social",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-12.svg",
  },
];

export const SECONDARY_NAV_ITEMS: NavItem[] = [
  {
    id: "admin",
    label: "Admin Panel",
    href: "/admin",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-13.svg",
  },
  {
    id: "profile",
    label: "Settings",
    href: "/profile",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-13.svg",
  },
  {
    id: "help",
    label: "Help",
    href: "/help",
    icon: "https://c.animaapp.com/hA8iGgNv0AbbR5iEAhUDJQ/assets/icon-14.svg",
  },
];

export const FOOTER_LINKS: FooterLink[] = [
  { label: "Terms", href: "/terms" },
  { label: "Privacy", href: "/privacy" },
  { label: "Help", href: "/help" },
];
