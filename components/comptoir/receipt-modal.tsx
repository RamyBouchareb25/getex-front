"use client"

import { useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Printer, Download, Mail, CheckCircle2 } from "lucide-react"
import type { CartItem } from "@/app/[locale]/dashboard/comptoir/page"
import { useTranslations } from "next-intl"

type Props = {
  open: boolean
  onClose: () => void
  transaction: {
    items: CartItem[]
    total: number
    paymentMethod: string
    transactionId: string
    date: Date
  } | null
  includeTax: boolean
}

export function ReceiptModal({ open, onClose, transaction, includeTax }: Props) {
  const receiptRef = useRef<HTMLDivElement>(null)
  const t = useTranslations('pos')

  if (!transaction) return null

  const subtotal = transaction.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const tax = includeTax ? subtotal * 0.19 : 0
  const total = subtotal + tax

  const handlePrint = () => {
    if (receiptRef.current) {
      const printWindow = window.open("", "", "width=800,height=600")
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Receipt</title>
              <style>
                body { font-family: monospace; padding: 20px; }
                .receipt { max-width: 400px; margin: 0 auto; }
                .text-center { text-align: center; }
                .flex { display: flex; justify-content: space-between; }
                .separator { border-top: 1px dashed #000; margin: 10px 0; }
                .bold { font-weight: bold; }
                .small { font-size: 12px; }
              </style>
            </head>
            <body>
              ${receiptRef.current.innerHTML}
            </body>
          </html>
        `)
        printWindow.document.close()
        printWindow.print()
      }
    }
  }

  const handleDownload = () => {
    alert("Receipt downloaded as PDF")
  }

  const handleEmail = () => {
    alert("Receipt sent to customer email")
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            {t('paymentSuccessful')}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div ref={receiptRef} className="bg-card border border-border rounded-lg p-6 space-y-4 font-mono text-sm">
            {/* Header */}
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg">{t('retailStore')}</h3>
              <p className="text-xs text-muted-foreground">123 Main Street</p>
              <p className="text-xs text-muted-foreground">{transaction.date.toLocaleString()}</p>
            </div>

            <Separator />

            {/* Transaction ID */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t('transactionId')}</p>
              <p className="font-semibold">{transaction.transactionId}</p>
            </div>

            <Separator />

            {/* Items */}
            <div className="space-y-2">
              {transaction.items.map((item) => (
                <div key={item.id} className="space-y-1">
                  <div className="flex justify-between">
                    <span className="flex-1">{item.name}</span>
                    <span>${(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground pl-2">
                    {item.quantity} x ${item.price.toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <Separator />

            {/* Totals */}
            <div className="space-y-1">
              <div className="flex justify-between text-xs">
                <span>{t('subtotal')}</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              {includeTax && (
                <div className="flex justify-between text-xs">
                  <span>{t('tax')} (19%)</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              )}
              <Separator className="my-2" />
              <div className="flex justify-between font-bold text-base">
                <span>{t('total').toUpperCase()}</span>
                <span>${total.toFixed(2)}</span>
              </div>
            </div>

            <Separator />

            {/* Payment Method */}
            <div className="text-center">
              <p className="text-xs text-muted-foreground">{t('paymentMethod')}</p>
              <p className="font-semibold capitalize">{transaction.paymentMethod}</p>
            </div>

            <div className="text-center text-xs text-muted-foreground pt-4">
              <p>{t('thankYou')}</p>
              <p>{t('comeAgain')}</p>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-3 gap-2">
            <Button variant="outline" size="sm" onClick={handlePrint} className="gap-2 bg-transparent">
              <Printer className="h-4 w-4" />
              {t('print')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleDownload} className="gap-2 bg-transparent">
              <Download className="h-4 w-4" />
              {t('pdf')}
            </Button>
            <Button variant="outline" size="sm" onClick={handleEmail} className="gap-2 bg-transparent">
              <Mail className="h-4 w-4" />
              {t('email')}
            </Button>
          </div>

          <Button onClick={onClose} className="w-full">
            {t('newTransaction')}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
