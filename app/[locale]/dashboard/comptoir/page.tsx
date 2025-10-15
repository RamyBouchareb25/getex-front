"use client";

import { useState } from "react";
import { ProductScanner } from "@/components/comptoir/product-scanner";
import { ProductGrid } from "@/components/comptoir/product-grid";
import { Cart } from "@/components/comptoir/cart";
import { PaymentModal } from "@/components/comptoir/payment-modal";
import { ReceiptModal } from "@/components/comptoir/receipt-modal";
import { ReturnScanner } from "@/components/comptoir/return-scanner";
import { ReturnCart } from "@/components/comptoir/return-cart";
import { RefundModal } from "@/components/comptoir/refund-modal";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShoppingCart, RotateCcw } from "lucide-react";
import { useTranslations } from "next-intl";

export type Product = {
  id: string;
  name: string;
  price: number;
  barcode: string;
  category: string;
  subcategory?: string;
  image?: string;
  stock: number;
};

export type CartItem = Product & {
  quantity: number;
};

export default function POSPage() {
  const [activeTab, setActiveTab] = useState<"sales" | "returns">("sales");

  const [cart, setCart] = useState<CartItem[]>([]);
  const [returnCart, setReturnCart] = useState<CartItem[]>([]);
  const [showPayment, setShowPayment] = useState(false);
  const [showReceipt, setShowReceipt] = useState(false);
  const [showRefund, setShowRefund] = useState(false);
  const [includeTax, setIncludeTax] = useState(true);

  const [lastTransaction, setLastTransaction] = useState<{
    items: CartItem[];
    total: number;
    paymentMethod: string;
    transactionId: string;
    date: Date;
  } | null>(null);

  const [lastReturn, setLastReturn] = useState<{
    items: CartItem[];
    total: number;
    transactionId: string;
    date: Date;
  } | null>(null);

  const t = useTranslations("pos");

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const addToReturnCart = (product: Product) => {
    setReturnCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { ...product, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const updateReturnQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      setReturnCart((prev) => prev.filter((item) => item.id !== id));
    } else {
      setReturnCart((prev) =>
        prev.map((item) => (item.id === id ? { ...item, quantity } : item))
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((item) => item.id !== id));
  };

  const removeFromReturnCart = (id: string) => {
    setReturnCart((prev) => prev.filter((item) => item.id !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  const clearReturnCart = () => {
    setReturnCart([]);
  };

  const handleCheckout = () => {
    if (cart.length > 0) {
      setShowPayment(true);
    }
  };

  const handleCompleteReturn = () => {
    if (returnCart.length > 0) {
      setShowRefund(true);
    }
  };

  const handlePaymentComplete = (paymentMethod: string) => {
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = includeTax ? subtotal * 0.19 : 0;
    const total = subtotal + tax;

    const transaction = {
      items: [...cart],
      total,
      paymentMethod,
      transactionId: `TXN-${Date.now()}`,
      date: new Date(),
    };
    setLastTransaction(transaction);
    setShowPayment(false);
    setShowReceipt(true);
    clearCart();
  };

  const handleRefundComplete = () => {
    const subtotal = returnCart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const tax = includeTax ? subtotal * 0.19 : 0;
    const total = subtotal + tax;

    const returnTransaction = {
      items: [...returnCart],
      total,
      transactionId: `RTN-${Date.now()}`,
      date: new Date(),
    };
    setLastReturn(returnTransaction);
    setShowRefund(false);
    clearReturnCart();
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const tax = includeTax ? subtotal * 0.19 : 0;
  const total = subtotal + tax;
  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const returnSubtotal = returnCart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const returnTax = includeTax ? returnSubtotal * 0.19 : 0;
  const returnTotal = returnSubtotal + returnTax;
  const returnItemCount = returnCart.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  return (
    <div className={`flex h-screen bg-background`}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="border-b border-border bg-card">
          <div className="flex items-center justify-between px-6 py-4">
            <div>
              <h1 className="text-2xl font-bold tracking-tight">
                {t("pointOfSale")}
              </h1>
              <p className="text-sm text-muted-foreground">
                {t("modernRetail")}
              </p>
            </div>
          </div>
        </header>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as "sales" | "returns")}
          className="flex-1 flex flex-col"
        >
          <div className="border-b border-border px-6 py-2">
            <TabsList>
              <TabsTrigger value="sales" className="gap-2">
                <ShoppingCart className="h-4 w-4" />
                {t("sales")}
              </TabsTrigger>
              <TabsTrigger value="returns" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                {t("returns")}
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Sales Tab */}
          <TabsContent value="sales" className="flex-1 overflow-auto p-6 mt-0">
            <div className="space-y-6">
              <ProductScanner onProductScanned={addToCart} />

              <ProductGrid onProductSelect={addToCart} />
            </div>
          </TabsContent>

          {/* Returns Tab */}
          <TabsContent
            value="returns"
            className="flex-1 overflow-auto p-6 mt-0"
          >
            <div className="space-y-6">
              <ReturnScanner onProductScanned={addToReturnCart} />

              <ProductGrid onProductSelect={addToReturnCart} />
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Cart/Return Cart Sidebar */}
      <div className="w-96 border-l border-border bg-card flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              {activeTab === "sales" ? (
                <>
                  <ShoppingCart className="h-5 w-5" />
                  {t("cart")}
                </>
              ) : (
                <>
                  <RotateCcw className="h-5 w-5" />
                  {t("returnCart")}
                </>
              )}
            </h2>
            {activeTab === "sales" && itemCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                {itemCount} {itemCount === 1 ? t("item") : t("items")}
              </span>
            )}
            {activeTab === "returns" && returnItemCount > 0 && (
              <span className="bg-primary text-primary-foreground text-xs font-medium px-2 py-1 rounded-full">
                {returnItemCount} {returnItemCount === 1 ? t("item") : t("items")}
              </span>
            )}
          </div>
        </div>

        {activeTab === "sales" ? (
          <Cart
            items={cart}
            onUpdateQuantity={updateQuantity}
            onRemoveItem={removeFromCart}
            onClearCart={clearCart}
            onCheckout={handleCheckout}
            total={total}
            subtotal={subtotal}
            tax={tax}
            includeTax={includeTax}
            onToggleTax={() => setIncludeTax(!includeTax)}
          />
        ) : (
          <ReturnCart
            items={returnCart}
            onUpdateQuantity={updateReturnQuantity}
            onRemoveItem={removeFromReturnCart}
            onClearCart={clearReturnCart}
            onCompleteReturn={handleCompleteReturn}
            total={returnTotal}
            subtotal={returnSubtotal}
            tax={returnTax}
            includeTax={includeTax}
            onToggleTax={() => setIncludeTax(!includeTax)}
          />
        )}
      </div>

      {/* Payment Modal */}
      <PaymentModal
        open={showPayment}
        onClose={() => setShowPayment(false)}
        total={total}
        onPaymentComplete={handlePaymentComplete}
      />

      {/* Receipt Modal */}
      <ReceiptModal
        open={showReceipt}
        onClose={() => setShowReceipt(false)}
        transaction={lastTransaction}
        includeTax={includeTax}
      />

      {/* Refund Modal */}
      <RefundModal
        open={showRefund}
        onClose={() => setShowRefund(false)}
        total={returnTotal}
        onRefundComplete={handleRefundComplete}
      />
    </div>
  );
}
