import { useState, useEffect } from 'react';
import { Product } from '@/app/[locale]/dashboard/comptoir/page';

interface UseProductsOptions {
  search?: string;
  categoryId?: string;
  subCategoryId?: string;
  page?: number;
  limit?: number;
}

interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function useProducts(options: UseProductsOptions = {}) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const {
    search = '',
    categoryId = '',
    subCategoryId = '',
    page = 1,
    limit = 50,
  } = options;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          page: page.toString(),
          limit: limit.toString(),
        });

        if (search) params.append('search', search);
        if (categoryId) params.append('categoryId', categoryId);
        if (subCategoryId) params.append('subCategoryId', subCategoryId);

        const response = await fetch(`/api/products?${params.toString()}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch products: ${response.statusText}`);
        }

        const data: ProductsResponse = await response.json();
        
        // Transform the API response to match our Product interface
        const transformedProducts: Product[] = data.products.map((product: any) => ({
          id: product.id,
          name: product.name,
          price: parseFloat(product.price) || 0,
          barcode: product.reference || product.id, // Use reference as barcode
          category: product.subCategory?.category?.name || 'Unknown',
          subcategory: product.subCategory?.name,
          image: product.image,
          stock: product.stock || 0,
        }));

        setProducts(transformedProducts);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      } catch (err) {
        console.error('Error fetching products:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [search, categoryId, subCategoryId, page, limit]);

  return {
    products,
    loading,
    error,
    total,
    totalPages,
    refetch: () => {
      // Trigger a refetch by updating a dependency
      setLoading(true);
    },
  };
}
