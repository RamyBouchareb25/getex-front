"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CreditCard, Banknote, Smartphone, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  open: boolean
  onClose: () => void
  total: number
  onPaymentComplete: (method: string) => void
}

export function PaymentModal({ open, onClose, total, onPaymentComplete }: Props) {
  const [paymentMethod, setPaymentMethod] = useState<"card" | "cash" | "mobile">("card")
  const [processing, setProcessing] = useState(false)
  const [cashReceived, setCashReceived] = useState("")

  const t = useTranslations("pos")

  const handlePayment = () => {
    setProcessing(true)
    setTimeout(() => {
      onPaymentComplete(paymentMethod)
      setProcessing(false)
      setCashReceived("")
    }, 1500)
  }

  const change = cashReceived ? Number.parseFloat(cashReceived) - total : 0

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('completePayment')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Total Amount */}
          <div className="text-center p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">{t('totalAmount')}</p>
            <p className="text-4xl font-bold">${total.toFixed(2)}</p>
          </div>

          {/* Payment Method Selection */}
          <div className="space-y-3">
            <Label>{t('paymentMethod')}</Label>
            <div className="grid grid-cols-3 gap-3">
              <Button
                variant={paymentMethod === "card" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setPaymentMethod("card")}
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-xs">{t('card')}</span>
              </Button>
              <Button
                variant={paymentMethod === "cash" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setPaymentMethod("cash")}
              >
                <Banknote className="h-6 w-6" />
                <span className="text-xs">{t('cash')}</span>
              </Button>
              <Button
                variant={paymentMethod === "mobile" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setPaymentMethod("mobile")}
              >
                <Smartphone className="h-6 w-6" />
                <span className="text-xs">{t('mobile')}</span>
              </Button>
            </div>
          </div>

          {/* Cash Payment Details */}
          {paymentMethod === "cash" && (
            <div className="space-y-3">
              <div>
                <Label htmlFor="cash-received">{t('cashReceived')}</Label>
                <Input
                  id="cash-received"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={cashReceived}
                  onChange={(e) => setCashReceived(e.target.value)}
                  className="text-lg h-12"
                />
              </div>
              {change > 0 && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground">{t('changeDue')}</p>
                  <p className="text-2xl font-bold text-primary">${change.toFixed(2)}</p>
                </div>
              )}
            </div>
          )}

          {/* Card Payment Simulation */}
          {paymentMethod === "card" && (
            <div className="space-y-3">
              <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
                <CreditCard className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t('insertCard')}</p>
              </div>
            </div>
          )}

          {/* Mobile Payment Simulation */}
          {paymentMethod === "mobile" && (
            <div className="space-y-3">
              <div className="p-4 border-2 border-dashed border-border rounded-lg text-center">
                <Smartphone className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                <p className="text-sm text-muted-foreground">{t('scanQR')}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              {t('cancel')}
            </Button>
            <Button
              onClick={handlePayment}
              disabled={processing || (paymentMethod === "cash" && (!cashReceived || change < 0))}
              className="flex-1 gap-2"
            >
              {processing ? (
                <>{t('processing')}</>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t('completePaymentBtn')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
