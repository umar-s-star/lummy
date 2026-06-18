export type Theme = 'dark' | 'light';
export type Language = 'ru' | 'uz' | 'uz_cyrl';

export interface Category {
  id: string;
  nameRu: string; nameUz: string; nameUzCyrl: string;
  slug: string;
  icon?: string;
  image?: string;
  isActive: boolean;
  order: number;
}

export interface Dish {
  id: string;
  nameRu: string; nameUz: string; nameUzCyrl: string;
  descriptionRu: string; descriptionUz: string; descriptionUzCyrl: string;
  price: number;
  oldPrice?: number;
  image: string;
  gallery?: string[];
  weight?: number;
  calories?: number;
  proteins?: number;
  fats?: number;
  carbs?: number;
  allergens?: string[];
  categoryId: string;
  category?: Category;
  tags?: string[];
  isBestseller?: boolean;
  isNew?: boolean;
  isSignature?: boolean;
  inStock: boolean;
  isHidden?: boolean;
  rating?: number;
  reviewCount?: number;
}

export interface Review {
  id: string;
  userId?: string;
  userName: string;
  userAvatar?: string;
  dishId?: string;
  rating: number;
  text: string;
  isApproved: boolean;
  createdAt: string;
}

export interface Branch {
  id: string;
  name: string;
  address: string;
  phone: string;
  hours: string;
  lat: number;
  lng: number;
  isMain?: boolean;
  image?: string;
  description?: string;
}

export interface Promo {
  id: string;
  titleRu: string; titleUz: string;
  descriptionRu: string; descriptionUz: string;
  image: string;
  code?: string;
  discount?: number;
  isActive: boolean;
  expiresAt?: string;
}

export type OrderStatus = 'new' | 'confirmed' | 'preparing' | 'ready' | 'in_delivery' | 'delivered' | 'cancelled';

export interface Order {
  id: string;
  customerName: string;
  customerPhone: string;
  items: { dishName: string; quantity: number; price: number }[];
  status: OrderStatus;
  total: number;
  deliveryType: 'delivery' | 'pickup';
  address?: string;
  paymentMethod: string;
  createdAt: string;
  note?: string;
}
