import { useState, useEffect } from 'react';
import { supabase, type Product, type SupplementDeal, mapProductToSupplement } from '../lib/supabase';

interface UseProductsReturn {
  supplements: SupplementDeal[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useProducts = (): UseProductsReturn => {
  const [supplements, setSupplements] = useState<SupplementDeal[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data, error: supabaseError } = await supabase
        .from('products')
        .select('*')
        .limit(12); // Limit to 12 products for the home page

      if (supabaseError) {
        throw new Error(supabaseError.message);
      }

      if (data) {
        // Map database products to supplement deals
        const mappedSupplements = data.map((product: Product) => 
          mapProductToSupplement(product)
        );
        setSupplements(mappedSupplements);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    supplements,
    loading,
    error,
    refetch: fetchProducts,
  };
}; 