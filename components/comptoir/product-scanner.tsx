"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScanBarcode, CheckCircle2 } from "lucide-react"
import { useProducts } from "@/hooks/use-products"
import type { Product } from "@/app/[locale]/dashboard/comptoir/page"
import { useTranslations } from "next-intl"

type Props = {
  onProductScanned: (product: Product) => void
}

export function ProductScanner({ onProductScanned }: Props) {
  const [manualCode, setManualCode] = useState("")
  const [lastScanned, setLastScanned] = useState<Product | null>(null)
  const [showSuccess, setShowSuccess] = useState(false)

  const t = useTranslations('pos')
  const { products } = useProducts({ search: manualCode })

  const handleManualScan = () => {
    if (!manualCode.trim()) return

    const product = products.find((p) => p.barcode.toLowerCase() === manualCode.toLowerCase())

    if (product) {
      onProductScanned(product)
      setLastScanned(product)
      setShowSuccess(true)
      setManualCode("")
      setTimeout(() => setShowSuccess(false), 2000)
    } else {
      alert("Product not found")
    }
  }

  return (
    <div className="space-y-4">
      <Card className="p-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10 flex-shrink-0">
            <ScanBarcode className="h-5 w-5 text-primary" />
          </div>
          <Input
            placeholder={t('enterBarcode')}
            value={manualCode}
            onChange={(e) => setManualCode(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleManualScan()}
            className="flex-1 font-mono"
            autoFocus
          />
          <Button onClick={handleManualScan} className="px-6">
            {t('scan')}
          </Button>
        </div>
      </Card>

      {/* Success Notification */}
      {showSuccess && lastScanned && (
        <Card className="p-4 bg-primary text-primary-foreground slide-up">
          <div className="flex items-center gap-3">
            <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
            <div className="flex-1 min-w-0">
              <h4 className="font-semibold text-sm">{t('productAdded')}</h4>
              <p className="text-sm opacity-90 truncate">{lastScanned.name}</p>
            </div>
            <span className="text-lg font-bold flex-shrink-0">${lastScanned.price.toFixed(2)}</span>
          </div>
        </Card>
      )}
    </div>
  )
}
