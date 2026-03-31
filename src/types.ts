export interface Review {
  id: string;
  userName: string;
  userImage: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Restaurant {
  id: string;
  name: string;
  image: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
  categories: string[];
  isVeg: boolean;
  description: string;
}

export interface FoodItem {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'Starters' | 'Main Course' | 'Desserts' | 'Beverages' | 'Snacks' | 'Cakes';
  isVeg: boolean;
}

export interface CartItem extends FoodItem {
  quantity: number;
  restaurantId: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  restaurantImage: string;
  items: CartItem[];
  total: number;
  date: string;
  status: TrackingStatus;
}

export type Page = 'home' | 'listing' | 'detail' | 'cart' | 'checkout' | 'auth' | 'order-confirmed' | 'tracking' | 'orders';

export type TrackingStatus = 'placed' | 'preparing' | 'picked-up' | 'near-you' | 'delivered';
