export interface NavItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  isActive?: boolean;
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: string;
  image: string;
  author: string;
  quantity: number;
}
