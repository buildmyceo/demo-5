import { Restaurant, FoodItem, Review } from './types';

export const REVIEWS: Record<string, Review[]> = {
  '1': [
    { id: 'r1', userName: 'Rahul Sharma', userImage: 'https://picsum.photos/seed/rahul/100/100', rating: 5, comment: 'Amazing food! The butter chicken was out of this world. Highly recommended.', date: '2 days ago' },
    { id: 'r2', userName: 'Priya Singh', userImage: 'https://picsum.photos/seed/priya/100/100', rating: 4, comment: 'Good experience, but the delivery was slightly delayed. Food was hot though.', date: '1 week ago' },
  ],
  '2': [
    { id: 'r3', userName: 'Amit Kumar', userImage: 'https://picsum.photos/seed/amit/100/100', rating: 5, comment: 'Best pizza in town. The crust is perfect.', date: '3 days ago' },
  ]
};

export const RESTAURANTS: Restaurant[] = [
  {
    id: '1',
    name: 'Spicy Biryani House',
    image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=800&auto=format&fit=crop',
    rating: 4.5,
    deliveryTime: '30-40 min',
    priceRange: '₹200 for two',
    categories: ['Biryani', 'North Indian'],
    isVeg: false,
    description: 'Authentic Hyderabadi biryani with a blend of secret spices.'
  },
  {
    id: '2',
    name: 'Pizza Corner',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=800&auto=format&fit=crop',
    rating: 4.2,
    deliveryTime: '20-30 min',
    priceRange: '₹400 for two',
    categories: ['Pizza', 'Italian'],
    isVeg: true,
    description: 'Wood-fired pizzas with fresh toppings and gooey cheese.'
  },
  {
    id: '3',
    name: 'Royal Sweets',
    image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=800&auto=format&fit=crop',
    rating: 4.7,
    deliveryTime: '15-25 min',
    priceRange: '₹150 for two',
    categories: ['Desserts', 'Sweets'],
    isVeg: true,
    description: 'Traditional Indian sweets and modern desserts.'
  },
  {
    id: '4',
    name: 'Burger Kingly',
    image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=800&auto=format&fit=crop',
    rating: 4.0,
    deliveryTime: '25-35 min',
    priceRange: '₹300 for two',
    categories: ['Burgers', 'Fast Food'],
    isVeg: false,
    description: 'Juicy burgers with crispy fries and refreshing drinks.'
  },
  {
    id: '5',
    name: 'The Green Bowl',
    image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=800&auto=format&fit=crop',
    rating: 4.4,
    deliveryTime: '20-30 min',
    priceRange: '₹350 for two',
    categories: ['Healthy', 'Salads'],
    isVeg: true,
    description: 'Fresh, organic salads and healthy grain bowls.'
  },
  {
    id: '6',
    name: 'Sushi Zen',
    image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=800&auto=format&fit=crop',
    rating: 4.6,
    deliveryTime: '35-45 min',
    priceRange: '₹800 for two',
    categories: ['Japanese', 'Sushi'],
    isVeg: false,
    description: 'Premium sushi and Japanese delicacies.'
  },
  {
    id: '7',
    name: 'Mithila Thali',
    image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=800&auto=format&fit=crop',
    rating: 4.3,
    deliveryTime: '30-40 min',
    priceRange: '₹250 for two',
    categories: ['North Indian', 'Thali'],
    isVeg: true,
    description: 'Authentic Bihari thali with sattu paratha and litti chokha.'
  },
  {
    id: '8',
    name: 'The Caffeine Hub',
    image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=800&auto=format&fit=crop',
    rating: 4.1,
    deliveryTime: '15-25 min',
    priceRange: '₹500 for two',
    categories: ['Cafe', 'Beverages'],
    isVeg: true,
    description: 'Specialty coffee and artisanal snacks.'
  }
];

export const INSPIRATION_CATEGORIES = [
  { name: 'Biryani', image: 'https://b.zmtcdn.com/data/dish_images/d19a31d476606516e513732669fa94ee1610364549.png' },
  { name: 'Pizza', image: 'https://b.zmtcdn.com/data/o2_assets/d0bd7c94abc2e051387158105e45449a1618224843.png' },
  { name: 'Chicken', image: 'https://b.zmtcdn.com/data/dish_images/197ab28d8ad5e0d9a722e7953f079a9c1605852701.png' },
  { name: 'Burger', image: 'https://b.zmtcdn.com/data/dish_images/ccb7e915c2f548719e3399561546d7601610546542.png' },
  { name: 'Cake', image: 'https://b.zmtcdn.com/data/dish_images/d5ab931c8c239271de45e1c159af27241605853150.png' },
  { name: 'Thali', image: 'https://b.zmtcdn.com/data/o2_assets/7e83d0bc9f1f5879f276d9152a0ce8601618827939.png' },
];

export const MENU_ITEMS: Record<string, FoodItem[]> = {
  '1': [
    { id: 'b1', name: 'Chicken Dum Biryani', price: 299, image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=400&auto=format&fit=crop', description: 'Classic chicken biryani served with raita.', category: 'Main Course', isVeg: false },
    { id: 'b2', name: 'Mutton Biryani', price: 449, image: 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?q=80&w=400&auto=format&fit=crop', description: 'Tender mutton cooked with basmati rice.', category: 'Main Course', isVeg: false },
    { id: 'b3', name: 'Chicken 65', price: 199, image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=400&auto=format&fit=crop', description: 'Spicy deep-fried chicken appetizer.', category: 'Starters', isVeg: false },
    { id: 'b4', name: 'Gulab Jamun', price: 99, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Soft milk solids dumplings in sugar syrup.', category: 'Desserts', isVeg: true },
  ],
  '2': [
    { id: 'p1', name: 'Margherita Pizza', price: 249, image: 'https://images.unsplash.com/photo-1574071318508-1cdbad80ad38?q=80&w=400&auto=format&fit=crop', description: 'Classic tomato and mozzarella pizza.', category: 'Main Course', isVeg: true },
    { id: 'p2', name: 'Pepperoni Feast', price: 399, image: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?q=80&w=400&auto=format&fit=crop', description: 'Loaded with pepperoni and extra cheese.', category: 'Main Course', isVeg: false },
    { id: 'p3', name: 'Garlic Bread sticks', price: 129, image: 'https://images.unsplash.com/photo-1541745537411-b8046dc6d66c?q=80&w=400&auto=format&fit=crop', description: 'Freshly baked with garlic butter.', category: 'Starters', isVeg: true },
    { id: 'p4', name: 'Choco Lava Cake', price: 149, image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=400&auto=format&fit=crop', description: 'Warm chocolate cake with a gooey center.', category: 'Desserts', isVeg: true },
  ],
  // Add more as needed...
};

export const CATEGORIES = [
  { name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { name: 'Biryani', icon: '🍛', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=400&auto=format&fit=crop' },
  { name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop' },
  { name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop' },
  { name: 'Healthy', icon: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop' },
  { name: 'Sushi', icon: '🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop' },
];
