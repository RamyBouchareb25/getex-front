"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react"
import type { CartItem } from "@/app/[locale]/dashboard/comptoir/page"
import { useTranslations } from "next-intl"

type Props = {
  items: CartItem[]
  onUpdateQuantity: (id: string, quantity: number) => void
  onRemoveItem: (id: string) => void
  onClearCart: () => void
  onCheckout: () => void
  total: number
  subtotal: number
  tax: number
  includeTax: boolean
  onToggleTax: () => void
}

export function Cart({
  items,
  onUpdateQuantity,
  onRemoveItem,
  onClearCart,
  onCheckout,
  total,
  subtotal,
  tax,
  includeTax,
  onToggleTax,
}: Props) {
  const t = useTranslations("pos")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState("")

  const handleQuantityChange = (id: string, value: string) => {
    const numValue = Number.parseInt(value)
    if (!isNaN(numValue) && numValue > 0) {
      onUpdateQuantity(id, numValue)
    }
    setEditingId(null)
    setEditValue("")
  }

  const handleQuantityClick = (id: string, currentQuantity: number) => {
    setEditingId(id)
    setEditValue(currentQuantity.toString())
  }

  if (items.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-center space-y-3">
          <ShoppingBag className="h-16 w-16 text-muted-foreground/30 mx-auto" />
          <h3 className="font-semibold text-lg">{t('cartEmpty')}</h3>
          <p className="text-sm text-muted-foreground">{t('scanToAdd')}</p>
        </div>
      </div>
    )
  }

  return (
    <>
      <ScrollArea className="flex-1 px-4">
        <div className="space-y-4 py-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="space-y-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors slide-up"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-sm line-clamp-2">{item.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    ${item.price.toFixed(2)} {t('each')}
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 flex-shrink-0"
                  onClick={() => onRemoveItem(item.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  {editingId === item.id ? (
                    <Input
                      type="number"
                      value={editValue}
                      onChange={(e) => setEditValue(e.target.value)}
                      onBlur={() => handleQuantityChange(item.id, editValue)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          handleQuantityChange(item.id, editValue)
                        } else if (e.key === "Escape") {
                          setEditingId(null)
                          setEditValue("")
                        }
                      }}
                      className="w-16 h-8 text-center font-semibold"
                      autoFocus
                    />
                  ) : (
                    <button
                      onClick={() => handleQuantityClick(item.id, item.quantity)}
                      className="w-16 h-8 text-center font-semibold hover:bg-muted rounded transition-colors"
                    >
                      {item.quantity}
                    </button>
                  )}
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8 bg-transparent"
                    onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                </div>
                <span className="font-bold">${(item.price * item.quantity).toFixed(2)}</span>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      <div className="border-t border-border p-4 space-y-4">
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{t('subtotal')}</span>
            <span className="font-medium">${subtotal.toFixed(2)}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Checkbox id="tax" checked={includeTax} onCheckedChange={onToggleTax} />
              <Label htmlFor="tax" className="text-muted-foreground cursor-pointer">
                {t('taxOptional')} (19%)
              </Label>
            </div>
            <span className="font-medium">${tax.toFixed(2)}</span>
          </div>

          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>{t('total')}</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </div>

        <div className="space-y-2">
          <Button onClick={onCheckout} size="lg" className="w-full">
            {t("checkout")}
          </Button>
          <Button onClick={onClearCart} variant="outline" size="sm" className="w-full bg-transparent">
            {t("clearCart")}
          </Button>
        </div>
      </div>
    </>
  )
}
