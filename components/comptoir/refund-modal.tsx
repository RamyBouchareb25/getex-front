"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { CreditCard, DollarSign, CheckCircle2 } from "lucide-react"
import { useTranslations } from "next-intl"

type Props = {
  open: boolean
  onClose: () => void
  total: number
  onRefundComplete: () => void
}

export function RefundModal({ open, onClose, total, onRefundComplete }: Props) {
  const [refundMethod, setRefundMethod] = useState<"original" | "credit">("original")
  const [processing, setProcessing] = useState(false)

  const t = useTranslations("pos")

  const handleRefund = () => {
    setProcessing(true)
    setTimeout(() => {
      onRefundComplete()
      setProcessing(false)
    }, 1500)
  }

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t('returnSuccessful')}</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Refund Amount */}
          <div className="text-center p-6 bg-muted rounded-lg">
            <p className="text-sm text-muted-foreground mb-2">{t('refundAmount')}</p>
            <p className="text-4xl font-bold">${total.toFixed(2)}</p>
          </div>

          {/* Refund Method Selection */}
          <div className="space-y-3">
            <Label>{t('refundMethod')}</Label>
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant={refundMethod === "original" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setRefundMethod("original")}
              >
                <CreditCard className="h-6 w-6" />
                <span className="text-xs text-center">{t('originalPayment')}</span>
              </Button>
              <Button
                variant={refundMethod === "credit" ? "default" : "outline"}
                className="h-20 flex-col gap-2"
                onClick={() => setRefundMethod("credit")}
              >
                <DollarSign className="h-6 w-6" />
                <span className="text-xs text-center">{t('storeCredit')}</span>
              </Button>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose} className="flex-1 bg-transparent">
              {t('cancel')}
            </Button>
            <Button onClick={handleRefund} disabled={processing} className="flex-1 gap-2">
              {processing ? (
                <>{t('refundProcessing')}</>
              ) : (
                <>
                  <CheckCircle2 className="h-4 w-4" />
                  {t('completeRefund')}
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
