"use client"

import { useState, useMemo, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, Plus, Package, Loader2 } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import { useCategories, useSubCategories } from "@/hooks/use-categories"
import type { Product } from "@/app/[locale]/dashboard/comptoir/page" 
import { useTranslations } from "next-intl"
import { imageUrl } from "@/lib/utils"
type Props = {
  onProductSelect: (product: Product) => void
}

export function ProductGrid({ onProductSelect }: Props) {
  const [search, setSearch] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedSubcategory, setSelectedSubcategory] = useState<string>("all")

  const t = useTranslations("pos")

  // Fetch data using hooks
  const { products, loading: productsLoading, error: productsError } = useProducts({
    search: search || undefined,
    categoryId: selectedCategory !== "all" ? selectedCategory : undefined,
    subCategoryId: selectedSubcategory !== "all" ? selectedSubcategory : undefined,
  })

  const { categories, loading: categoriesLoading } = useCategories()
  const { subCategories, loading: subCategoriesLoading } = useSubCategories(
    selectedCategory !== "all" ? selectedCategory : undefined
  )

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSelectedSubcategory("all")
  }

  // Loading state
  if (productsLoading || categoriesLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          <span className="ml-2 text-muted-foreground">{t('loading')}</span>
        </div>
      </div>
    )
  }

  // Error state
  if (productsError) {
    return (
      <div className="space-y-4">
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('error')}</h3>
          <p className="text-sm text-muted-foreground">{t('errorLoading')}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder={t('searchProducts')}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange("all")}
          className="capitalize whitespace-nowrap"
        >
          {t('all')}
        </Button>
        {categories.map((category) => (
          <Button
            key={category.id}
            variant={selectedCategory === category.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(category.id)}
            className="capitalize whitespace-nowrap"
          >
            {category.name}
          </Button>
        ))}
      </div>

      {subCategories.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Button
            variant={selectedSubcategory === "all" ? "default" : "outline"}
            size="sm"
            onClick={() => setSelectedSubcategory("all")}
            className="capitalize whitespace-nowrap"
          >
            {t('all')}
          </Button>
          {subCategories.map((subcategory) => (
            <Button
              key={subcategory.id}
              variant={selectedSubcategory === subcategory.id ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedSubcategory(subcategory.id)}
              className="capitalize whitespace-nowrap"
            >
              {subcategory.name}
            </Button>
          ))}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {products.map((product) => (
          <Card
            key={product.id}
            className="group overflow-hidden hover:shadow-lg transition-all duration-300 cursor-pointer"
            onClick={() => onProductSelect(product)}
          >
            <div className="aspect-square bg-muted relative overflow-hidden">
              {product.image ? (
                <img
                  src={imageUrl(product.image) || "/placeholder.svg"}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Package className="h-16 w-16 text-muted-foreground/30" />
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="bg-background/90 backdrop-blur">
                  {product.stock} {t('inStock')}
                </Badge>
              </div>
            </div>
            <div className="p-4 space-y-3">
              <div>
                <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <p className="text-xs text-muted-foreground font-mono mt-1">{product.barcode}</p>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold">${product.price.toFixed(2)}</span>
                <Button
                  size="sm"
                  className="gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => {
                    e.stopPropagation()
                    onProductSelect(product)
                  }}
                >
                  <Plus className="h-4 w-4" />
                  {t('add')}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      {products.length === 0 && !productsLoading && (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">{t('noProducts')}</h3>
          <p className="text-sm text-muted-foreground">{t('adjustFilters')}</p>
        </div>
      )}
    </div>
  )
}
