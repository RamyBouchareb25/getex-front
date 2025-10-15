import { useState, useEffect } from 'react';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface SubCategory {
  id: string;
  name: string;
  description?: string;
  categoryId: string;
  category?: Category;
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/categories');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch categories: ${response.statusText}`);
        }

        const data = await response.json();
        setCategories(data.categories || []);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch categories');
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
}

export function useSubCategories(categoryId?: string) {
  const [subCategories, setSubCategories] = useState<SubCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubCategories = async () => {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch('/api/subcategories');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch subcategories: ${response.statusText}`);
        }

        const data = await response.json();
        let filteredSubCategories = data.subCategories || [];

        // Filter by categoryId if provided
        if (categoryId) {
          filteredSubCategories = filteredSubCategories.filter(
            (sub: SubCategory) => sub.categoryId === categoryId
          );
        }

        setSubCategories(filteredSubCategories);
      } catch (err) {
        console.error('Error fetching subcategories:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch subcategories');
        setSubCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSubCategories();
  }, [categoryId]);

  return { subCategories, loading, error };
}
