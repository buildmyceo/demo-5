import { Restaurant, FoodItem, Review } from './types';

export const REVIEWS: Record<string, Review[]> = {
  '1': [
    { id: 'r1', userName: 'Rahul Sharma', userImage: 'https://picsum.photos/seed/rahul/100/100', rating: 5, comment: 'Amazing food! The butter chicken was out of this world. Highly recommended.', date: '2 days ago' },
    { id: 'r2', userName: 'Priya Singh', userImage: 'https://picsum.photos/seed/priya/100/100', rating: 4, comment: 'Good experience, but the delivery was slightly delayed. Food was hot though.', date: '1 week ago' },
    { id: 'r10', userName: 'Sanjay Dutt', userImage: 'https://picsum.photos/seed/sanjay/100/100', rating: 5, comment: 'The best biryani I have ever had. The spices were perfectly balanced.', date: '3 days ago' },
  ],
  '2': [
    { id: 'r3', userName: 'Amit Kumar', userImage: 'https://picsum.photos/seed/amit/100/100', rating: 5, comment: 'Best pizza in town. The crust is perfect.', date: '3 days ago' },
    { id: 'r11', userName: 'Neha Kakkar', userImage: 'https://picsum.photos/seed/neha/100/100', rating: 4, comment: 'Loved the Margherita! Very fresh ingredients.', date: '5 days ago' },
  ],
  '3': [
    { id: 'r4', userName: 'Suresh Raina', userImage: 'https://picsum.photos/seed/suresh/100/100', rating: 5, comment: 'The sweets are fresh and delicious.', date: '1 day ago' },
    { id: 'r12', userName: 'Rohit Sharma', userImage: 'https://picsum.photos/seed/rohit/100/100', rating: 5, comment: 'Kaju Katli is a must try here.', date: '2 days ago' },
  ],
  '4': [
    { id: 'r5', userName: 'Deepak Chahar', userImage: 'https://picsum.photos/seed/deepak/100/100', rating: 4, comment: 'Great burgers, very juicy.', date: '4 days ago' },
    { id: 'r13', userName: 'Jasprit Bumrah', userImage: 'https://picsum.photos/seed/jasprit/100/100', rating: 5, comment: 'The Whopper is huge and tasty!', date: '1 week ago' },
  ],
  '5': [
    { id: 'r6', userName: 'Anjali Gupta', userImage: 'https://picsum.photos/seed/anjali/100/100', rating: 5, comment: 'The quinoa bowl is my favorite healthy meal.', date: '2 days ago' },
    { id: 'r14', userName: 'Hardik Pandya', userImage: 'https://picsum.photos/seed/hardik/100/100', rating: 4, comment: 'Very fresh salads. Perfect for a post-workout meal.', date: '4 days ago' },
  ],
  '6': [
    { id: 'r7', userName: 'Vikram Seth', userImage: 'https://picsum.photos/seed/vikram/100/100', rating: 5, comment: 'Authentic sushi experience.', date: '1 week ago' },
    { id: 'r15', userName: 'Shikhar Dhawan', userImage: 'https://picsum.photos/seed/shikhar/100/100', rating: 5, comment: 'The Salmon Nigiri was incredibly fresh.', date: '3 days ago' },
  ],
  '7': [
    { id: 'r8', userName: 'Meera Bai', userImage: 'https://picsum.photos/seed/meera/100/100', rating: 4, comment: 'The thali is very filling and tasty.', date: '3 days ago' },
    { id: 'r16', userName: 'Virat Kohli', userImage: 'https://picsum.photos/seed/virat/100/100', rating: 5, comment: 'Authentic taste of North India. Litti Chokha is excellent.', date: '1 day ago' },
  ],
  '8': [
    { id: 'r9', userName: 'Karan Johar', userImage: 'https://picsum.photos/seed/karan/100/100', rating: 5, comment: 'Best coffee in the city.', date: '5 days ago' },
    { id: 'r17', userName: 'Ranbir Kapoor', userImage: 'https://picsum.photos/seed/ranbir/100/100', rating: 4, comment: 'Great ambiance and even better coffee.', date: '2 days ago' },
  ],
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
  },
  {
    id: '9',
    name: 'Sweet Delights',
    image: 'https://images.unsplash.com/photo-1551024506-0bccd828d307?q=80&w=800&auto=format&fit=crop',
    rating: 4.8,
    deliveryTime: '10-20 min',
    priceRange: '₹200 for two',
    categories: ['Desserts', 'Cakes'],
    isVeg: true,
    description: 'Premium cakes, pastries and gourmet desserts.'
  }
];

export const INSPIRATION_CATEGORIES = [
  { name: 'Biryani', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=400&auto=format&fit=crop' },
  { name: 'Pizza', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { name: 'Chicken', image: 'https://images.unsplash.com/photo-1610057099443-fde8c4d50f91?q=80&w=400&auto=format&fit=crop' },
  { name: 'Burger', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop' },
  { name: 'Cake', image: 'https://images.unsplash.com/photo-1624353365286-3f8d62daad51?q=80&w=400&auto=format&fit=crop' },
  { name: 'Thali', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop' },
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
  '3': [
    { id: 's1', name: 'Kaju Katli', price: 499, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Premium cashew nut fudge.', category: 'Desserts', isVeg: true },
    { id: 's2', name: 'Rasgulla', price: 149, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Spongy milk balls in sugar syrup.', category: 'Desserts', isVeg: true },
    { id: 's3', name: 'Gulab Jamun (2pc)', price: 89, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Deep fried milk dumplings in sugar syrup.', category: 'Desserts', isVeg: true },
    { id: 's4', name: 'Motichoor Ladoo', price: 199, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Fine gram flour pearls fried and soaked in syrup.', category: 'Desserts', isVeg: true },
    { id: 's5', name: 'Jalebi with Rabri', price: 159, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Crispy jalebis served with thick creamy rabri.', category: 'Desserts', isVeg: true },
    { id: 's6', name: 'Mysore Pak', price: 249, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Rich gram flour and ghee fudge from South India.', category: 'Desserts', isVeg: true },
    { id: 's7', name: 'Besan Ladoo', price: 179, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Roasted gram flour balls with nuts and ghee.', category: 'Desserts', isVeg: true },
    { id: 's8', name: 'Milk Cake', price: 299, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Grainy milk fudge with a caramelized center.', category: 'Desserts', isVeg: true },
    { id: 's9', name: 'Rasmalai (2pc)', price: 129, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Soft paneer discs in thickened saffron milk.', category: 'Desserts', isVeg: true },
    { id: 's10', name: 'Gajar ka Halwa', price: 149, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Slow-cooked carrot pudding with nuts.', category: 'Desserts', isVeg: true },
    { id: 's11', name: 'Soan Papdi', price: 119, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Flaky and crisp gram flour sweet.', category: 'Desserts', isVeg: true },
    { id: 's12', name: 'Peda', price: 189, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Soft milk solids fudge with cardamom.', category: 'Desserts', isVeg: true },
    { id: 's13', name: 'Cham Cham', price: 139, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Colorful Bengali sweet made from paneer.', category: 'Desserts', isVeg: true },
    { id: 's14', name: 'Kalakand', price: 279, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Moist and grainy milk cake.', category: 'Desserts', isVeg: true },
    { id: 's15', name: 'Badam Halwa', price: 349, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Rich almond pudding cooked with pure ghee.', category: 'Desserts', isVeg: true },
    { id: 's16', name: 'Moong Dal Halwa', price: 169, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Classic lentil pudding with dry fruits.', category: 'Desserts', isVeg: true },
    { id: 's17', name: 'Sandesh', price: 159, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Delicate Bengali sweet made from fresh chhena.', category: 'Desserts', isVeg: true },
    { id: 's18', name: 'Dry Fruit Laddu', price: 399, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Healthy balls made of mixed nuts and dates.', category: 'Desserts', isVeg: true },
    { id: 's19', name: 'Shahi Tukda', price: 129, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Fried bread soaked in milk and saffron.', category: 'Desserts', isVeg: true },
    { id: 's20', name: 'Rabri', price: 149, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Thickened sweetened milk with layers of malai.', category: 'Desserts', isVeg: true },
    { id: 's21', name: 'Malpua (2pc)', price: 119, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Sweet pancakes soaked in sugar syrup.', category: 'Desserts', isVeg: true },
    { id: 's22', name: 'Imarti', price: 129, image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop', description: 'Flower-shaped deep fried lentil sweet.', category: 'Desserts', isVeg: true },
  ],
  '4': [
    { id: 'bu1', name: 'Classic Veg Burger', price: 149, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop', description: 'Crispy veg patty with fresh lettuce.', category: 'Main Course', isVeg: true },
    { id: 'bu2', name: 'Chicken Whopper', price: 249, image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop', description: 'Flame-grilled chicken patty.', category: 'Main Course', isVeg: false },
  ],
  '5': [
    { id: 'h1', name: 'Quinoa Bowl', price: 349, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop', description: 'Healthy quinoa with roasted veggies.', category: 'Main Course', isVeg: true },
    { id: 'h2', name: 'Greek Salad', price: 299, image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop', description: 'Fresh cucumber, tomatoes, and feta.', category: 'Starters', isVeg: true },
  ],
  '6': [
    { id: 'su1', name: 'Salmon Nigiri', price: 599, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop', description: 'Fresh salmon on vinegared rice.', category: 'Main Course', isVeg: false },
    { id: 'su2', name: 'California Roll', price: 499, image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop', description: 'Crab, avocado, and cucumber.', category: 'Main Course', isVeg: false },
  ],
  '7': [
    { id: 't1', name: 'Special North Thali', price: 249, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop', description: 'Dal, paneer, roti, rice, and sweet.', category: 'Main Course', isVeg: true },
    { id: 't2', name: 'Litti Chokha', price: 149, image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?q=80&w=400&auto=format&fit=crop', description: 'Traditional Bihari litti with mashed veggies.', category: 'Main Course', isVeg: true },
  ],
  '8': [
    { id: 'c1', name: 'Cappuccino', price: 199, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop', description: 'Classic Italian coffee.', category: 'Beverages', isVeg: true },
    { id: 'c2', name: 'Blueberry Muffin', price: 129, image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?q=80&w=400&auto=format&fit=crop', description: 'Freshly baked muffin with blueberries.', category: 'Desserts', isVeg: true },
  ],
  '9': [
    { id: 'sd1', name: 'Red Velvet Pastry', price: 149, image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?q=80&w=400&auto=format&fit=crop', description: 'Classic red velvet with cream cheese frosting.', category: 'Cakes', isVeg: true },
    { id: 'sd2', name: 'Chocolate Truffle Cake', price: 599, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?q=80&w=400&auto=format&fit=crop', description: 'Dense chocolate cake with ganache.', category: 'Cakes', isVeg: true },
    { id: 'sd3', name: 'New York Cheesecake', price: 199, image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=400&auto=format&fit=crop', description: 'Creamy cheesecake with a graham cracker crust.', category: 'Desserts', isVeg: true },
    { id: 'sd4', name: 'Macarons (Box of 6)', price: 449, image: 'https://images.unsplash.com/photo-1569864358642-9d1619702663?q=80&w=400&auto=format&fit=crop', description: 'Assorted French macarons.', category: 'Desserts', isVeg: true },
    { id: 'sd5', name: 'Tiramisu', price: 249, image: 'https://images.unsplash.com/photo-1571877223202-5562699c78ec?q=80&w=400&auto=format&fit=crop', description: 'Classic Italian coffee-flavored dessert.', category: 'Desserts', isVeg: true },
    { id: 'sd6', name: 'Fruit Tart', price: 129, image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?q=80&w=400&auto=format&fit=crop', description: 'Crispy tart with custard and fresh fruits.', category: 'Desserts', isVeg: true },
    { id: 'sd7', name: 'Apple Pie', price: 179, image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?q=80&w=400&auto=format&fit=crop', description: 'Warm apple pie with cinnamon.', category: 'Desserts', isVeg: true },
    { id: 'sd8', name: 'Brownie with Ice Cream', price: 159, image: 'https://images.unsplash.com/photo-1564355808539-22fda35bed7e?q=80&w=400&auto=format&fit=crop', description: 'Warm walnut brownie with vanilla scoop.', category: 'Desserts', isVeg: true },
  ],
};

export const CATEGORIES = [
  { name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop' },
  { name: 'Biryani', icon: '🍛', image: 'https://images.unsplash.com/photo-1563379091339-03b21bc4a4f8?q=80&w=400&auto=format&fit=crop' },
  { name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?q=80&w=400&auto=format&fit=crop' },
  { name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1589119908995-c6837fa14848?q=80&w=400&auto=format&fit=crop' },
  { name: 'Healthy', icon: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&auto=format&fit=crop' },
  { name: 'Sushi', icon: '🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?q=80&w=400&auto=format&fit=crop' },
];
