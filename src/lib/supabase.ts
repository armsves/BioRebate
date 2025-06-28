import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://xmsbbbxbrifrbkwpqenu.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhtc2JiYnhicmlmcmJrd3BxZW51Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MTE0NzE2OCwiZXhwIjoyMDY2NzIzMTY4fQ.dNo_cfgPzWNCVXBAsN9G1g3eT6QUwpilds9A1erWuSY'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  provider: string;
  keyword: string;
}

// Type for the component props (mapped from database)
export interface SupplementDeal {
  id: string;
  name: string;
  brand: string;
  originalPrice: number;
  discountPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  imageUrl: string;
  timeLeft: string;
  soldCount: number;
}

// Function to map database product to supplement deal
export const mapProductToSupplement = (product: Product): SupplementDeal => {
  // Generate some mock data for fields not in database
  const discountPercentage = Math.floor(Math.random() * 40) + 20; // 20-60% discount
  const discountPrice = product.price * (1 - discountPercentage / 100);
  const rating = 4.5 + Math.random() * 0.5; // 4.5-5.0 rating
  const reviewCount = Math.floor(Math.random() * 2000) + 500; // 500-2500 reviews
  const soldCount = Math.floor(Math.random() * 1500) + 200; // 200-1700 sold
  const daysLeft = Math.floor(Math.random() * 7) + 1; // 1-7 days
  const hoursLeft = Math.floor(Math.random() * 24); // 0-23 hours

  return {
    id: product.id.toString(),
    name: product.name,
    brand: product.provider,
    originalPrice: Number(product.price),
    discountPrice: Number(discountPrice.toFixed(2)),
    discountPercentage,
    rating: Number(rating.toFixed(1)),
    reviewCount,
    imageUrl: product.image,
    timeLeft: `${daysLeft}d ${hoursLeft}h`,
    soldCount,
  };
}; 