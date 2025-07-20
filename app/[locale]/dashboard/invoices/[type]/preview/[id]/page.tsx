"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, ArrowLeft } from "lucide-react";
import { getInvoicesForOrderAction } from "@/lib/actions/invoices";

interface InvoicePreviewProps {
  params: {
    id: string;
    type: string;
  };
}

export default function InvoicePreviewPage() {
  const t = useTranslations("Dashboard");
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const documentType = params.type as string;
  const [invoiceData, setInvoiceData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        const response = await getInvoicesForOrderAction(orderId, documentType);
        if (response.success && response.data) {
          setInvoiceData(response.data);
          setError(null);
        } else {
          setError(response.message || "Failed to load invoice data");
        }
      } catch (err) {
        setError("An error occurred while fetching invoice data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (orderId && documentType) {
      fetchInvoiceData();
    }
  }, [orderId, documentType]);

  const getDocumentTitle = (type: string) => {
    switch (type) {
      case "bon-livraison":
        return t("bonLivraison", {defaultValue: "Bon de Livraison"});
      case "bon-commande":
        return t("bonCommande", {defaultValue: "Bon de Commande"});
      case "bon-retour":
        return t("bonRetour", {defaultValue: "Bon de Retour"});
      case "bon-reception":
        return t("bonReception", {defaultValue: "Bon de Reception"});
      case "facture":
        return t("facture", {defaultValue: "Facture"});
      case "facture-proforma":
        return t("factureProforma", {defaultValue: "Facture Proforma"});
      case "facture-avoir":
        return t("factureAvoir", {defaultValue: "Facture Avoir"});
      default:
        return t("document", {defaultValue: "Document"});
    }
  };

  const handlePrint = async () => {
    try {
      window.open(`/api/order/${orderId}/print/${documentType}`, "_blank");
    } catch (error) {
      console.error("Error printing document:", error);
    }
  };

  const handleBack = () => {
    router.back();
  };

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Failed to load invoice data"}</p>
            {(documentType === "bon-reception" || documentType === "facture-avoir") && (
              <p className="mt-2 text-muted-foreground">
                Note: This document type is currently under development.
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleBack} variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{getDocumentTitle(documentType)} Preview</h1>
        <div className="flex space-x-4">
          <Button onClick={handleBack} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button onClick={handlePrint} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="border-b">
          <CardTitle>{getDocumentTitle(documentType)} - Order #{orderId}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* This will be a placeholder until we get actual preview data */}
          <div className="space-y-6">
            {/* Header Information */}
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">Company Information</h3>
                <p>BELLAT</p>
                <p>Address: 123 Company Street</p>
                <p>Phone: (123) 456-7890</p>
                <p>Email: contact@bellat.com</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg">Document Details</h3>
                <p>Document #: {documentType.toUpperCase()}-{orderId}</p>
                <p>Date: {new Date().toLocaleDateString()}</p>
                <p>Order Reference: #{orderId}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="font-bold text-lg">Customer Information</h3>
              <p>Name: {invoiceData.user?.firstName} {invoiceData.user?.lastName}</p>
              <p>Address: {invoiceData.shippingAddress || "N/A"}</p>
              <p>Phone: {invoiceData.user?.phoneNumber || "N/A"}</p>
              <p>Email: {invoiceData.user?.email || "N/A"}</p>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="font-bold text-lg mb-2">Items</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border p-2 text-left">Item</th>
                    <th className="border p-2 text-right">Quantity</th>
                    <th className="border p-2 text-right">Price</th>
                    <th className="border p-2 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.orderItems?.map((item: any, index: number) => (
                    <tr key={index} className="border-b">
                      <td className="border p-2">{item.product?.name || "Product"}</td>
                      <td className="border p-2 text-right">{item.quantity}</td>
                      <td className="border p-2 text-right">${parseFloat(item.price).toFixed(2)}</td>
                      <td className="border p-2 text-right">${(parseFloat(item.price) * item.quantity).toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={3} className="border p-2 text-right">Subtotal</td>
                    <td className="border p-2 text-right">${invoiceData.total?.toFixed(2) || "0.00"}</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={3} className="border p-2 text-right">Tax (0%)</td>
                    <td className="border p-2 text-right">$0.00</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={3} className="border p-2 text-right">Total</td>
                    <td className="border p-2 text-right">${invoiceData.total?.toFixed(2) || "0.00"}</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
            {invoiceData.note && (
              <div>
                <h3 className="font-bold text-lg">Notes</h3>
                <p>{invoiceData.note}</p>
              </div>
            )}
            
            {/* Additional sections based on document type */}
            {documentType === "bon-livraison" && (
              <div>
                <h3 className="font-bold text-lg">Delivery Information</h3>
                <p>Delivery Date: {new Date().toLocaleDateString()}</p>
                <p>Carrier: {invoiceData.chauffeur?.name || "N/A"}</p>
                <p>Vehicle: {invoiceData.camion?.matricule || "N/A"}</p>
              </div>
            )}
            
            {documentType === "bon-retour" && invoiceData.cancelReason && (
              <div>
                <h3 className="font-bold text-lg">Return Reason</h3>
                <p>{invoiceData.cancelReason}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <div>
            <p className="text-sm text-muted-foreground">
              Thank you for your business.
            </p>
          </div>
          <Button onClick={handlePrint} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            Print
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
