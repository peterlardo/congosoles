export interface Product {
  id: number
  title: string
  category: string
  subcategory: string
  brand: string
  store: string
  storeDistance: string
  originalPrice: number
  discountPrice: number
  discountPercent: number
  image: string
  isFlash: boolean
  flashEnd?: string
  location: string
}

export interface Category {
  id: number
  name: string
  icon: string
  count: number
}

export interface Store {
  id: number
  name: string
  category: string
  location: string
  activePromos: number
  image: string
}

export const categories: Category[] = [
  { id: 1, name: "Supermarchés", icon: "🛒", count: 1240 },
  { id: 2, name: "Mode", icon: "👗", count: 892 },
  { id: 3, name: "Chaussures", icon: "👟", count: 412 },
  { id: 4, name: "Beauté", icon: "💄", count: 356 },
  { id: 5, name: "Téléphones", icon: "📱", count: 289 },
  { id: 6, name: "Informatique", icon: "💻", count: 174 },
  { id: 7, name: "Électroménager", icon: "🔌", count: 246 },
  { id: 8, name: "Restaurants", icon: "🍽️", count: 512 },
  { id: 9, name: "Pharmacies", icon: "💊", count: 138 },
  { id: 10, name: "Automobile", icon: "🚗", count: 92 },
  { id: 11, name: "Mobilier", icon: "🛋️", count: 156 },
  { id: 12, name: "Sport", icon: "⚽", count: 201 },
]

export const flashProducts: Product[] = [
  {
    id: 1,
    title: "Riz parfumé Basmati 25kg",
    category: "Supermarchés",
    subcategory: "Tilda",
    brand: "Tilda",
    store: "Casino Brazza",
    storeDistance: "1.2 km",
    originalPrice: 42000,
    discountPrice: 28900,
    discountPercent: 31,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=70&auto=format",
    isFlash: true,
    flashEnd: "05:59:59",
    location: "Brazzaville",
  },
  {
    id: 2,
    title: "Smartphone Galaxy A15 128Go",
    category: "Téléphones",
    subcategory: "Samsung",
    brand: "Samsung",
    store: "TechCongo",
    storeDistance: "0.8 km",
    originalPrice: 165000,
    discountPrice: 129000,
    discountPercent: 22,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=70&auto=format",
    isFlash: true,
    flashEnd: "01:59:59",
    location: "Brazzaville",
  },
  {
    id: 3,
    title: "Poulet braisé + attiéké + boisson",
    category: "Restaurants",
    subcategory: "Chez Mama",
    brand: "Chez Mama",
    store: "Chez Mama Poto-Poto",
    storeDistance: "0.4 km",
    originalPrice: 6500,
    discountPrice: 3900,
    discountPercent: 40,
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=70&auto=format",
    isFlash: true,
    flashEnd: "05:59:59",
    location: "Brazzaville",
  },
]

export const todayProducts: Product[] = [
  {
    id: 4,
    title: "Riz parfumé Basmati 25kg",
    category: "Supermarchés",
    subcategory: "Tilda",
    brand: "Tilda",
    store: "Casino Brazza",
    storeDistance: "1.2 km",
    originalPrice: 42000,
    discountPrice: 28900,
    discountPercent: 31,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=70&auto=format",
    isFlash: true,
    flashEnd: "05:59:59",
    location: "Brazzaville",
  },
  {
    id: 5,
    title: "Sneakers running homme",
    category: "Chaussures",
    subcategory: "Nike Revolution",
    brand: "Nike Revolution",
    store: "SportZone",
    storeDistance: "3.4 km",
    originalPrice: 85000,
    discountPrice: 54900,
    discountPercent: 35,
    image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=70&auto=format",
    isFlash: false,
    location: "Brazzaville",
  },
  {
    id: 6,
    title: "Smartphone Galaxy A15 128Go",
    category: "Téléphones",
    subcategory: "Samsung",
    brand: "Samsung",
    store: "TechCongo",
    storeDistance: "0.8 km",
    originalPrice: 165000,
    discountPrice: 129000,
    discountPercent: 22,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=70&auto=format",
    isFlash: true,
    flashEnd: "01:59:59",
    location: "Brazzaville",
  },
  {
    id: 7,
    title: "Robe wax coupe moderne",
    category: "Mode",
    subcategory: "Atelier Nzinga",
    brand: "Atelier Nzinga",
    store: "Nzinga Store",
    storeDistance: "2.1 km",
    originalPrice: 35000,
    discountPrice: 21900,
    discountPercent: 37,
    image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=70&auto=format",
    isFlash: false,
    location: "Brazzaville",
  },
  {
    id: 8,
    title: "Télé LED 55\" 4K UHD",
    category: "Électroménager",
    subcategory: "LG",
    brand: "LG",
    store: "MaxiElec",
    storeDistance: "5.7 km",
    originalPrice: 480000,
    discountPrice: 349000,
    discountPercent: 27,
    image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=70&auto=format",
    isFlash: false,
    location: "Pointe-Noire",
  },
  {
    id: 9,
    title: "Poulet braisé + attiéké + boisson",
    category: "Restaurants",
    subcategory: "Chez Mama",
    brand: "Chez Mama",
    store: "Chez Mama Poto-Poto",
    storeDistance: "0.4 km",
    originalPrice: 6500,
    discountPrice: 3900,
    discountPercent: 40,
    image: "https://images.unsplash.com/photo-1598515214211-89d3c73ae83b?w=600&q=70&auto=format",
    isFlash: true,
    flashEnd: "05:59:59",
    location: "Brazzaville",
  },
  {
    id: 10,
    title: "Fond de teint peaux noires",
    category: "Beauté",
    subcategory: "Fenty Beauty",
    brand: "Fenty Beauty",
    store: "Glow Cosmetics",
    storeDistance: "1.9 km",
    originalPrice: 28000,
    discountPrice: 19600,
    discountPercent: 30,
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=70&auto=format",
    isFlash: false,
    location: "Brazzaville",
  },
  {
    id: 11,
    title: "Ordinateur portable 15\" i5",
    category: "Informatique",
    subcategory: "HP Pavilion",
    brand: "HP Pavilion",
    store: "TechCongo",
    storeDistance: "0.8 km",
    originalPrice: 520000,
    discountPrice: 429000,
    discountPercent: 17,
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=600&q=70&auto=format",
    isFlash: false,
    location: "Brazzaville",
  },
]

export const allProducts: Product[] = [...flashProducts, ...todayProducts]

export const stores: Store[] = [
  { id: 1, name: "Casino Brazza", category: "🏬", location: "Brazzaville", activePromos: 42, image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&q=70&auto=format" },
  { id: 2, name: "SportZone", category: "⚽", location: "Pointe-Noire", activePromos: 18, image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600&q=70&auto=format" },
  { id: 3, name: "TechCongo", category: "📱", location: "Brazzaville", activePromos: 27, image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=600&q=70&auto=format" },
  { id: 4, name: "Nzinga Store", category: "👗", location: "Brazzaville", activePromos: 12, image: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=600&q=70&auto=format" },
  { id: 5, name: "MaxiElec", category: "🔌", location: "Pointe-Noire", activePromos: 33, image: "https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=600&q=70&auto=format" },
  { id: 6, name: "Glow Cosmetics", category: "💄", location: "Brazzaville", activePromos: 21, image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=600&q=70&auto=format" },
]
