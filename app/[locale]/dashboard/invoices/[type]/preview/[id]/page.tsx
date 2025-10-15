"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Printer, ArrowLeft } from "lucide-react";

import { getInvoicesForOrderAction } from "@/lib/actions/invoices";
import SalamiLoadingAnimation from "@/components/ui/salami-loading";

type CompanyInfo = {
  name: string;
  address: string;
  phone: string;
  email: string;
};

type UserInfo = {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  email?: string;
};

type ProductInfo = {
  name: string;
};

type OrderItem = {
  product: ProductInfo;
  quantity: number;
  price: number | string;
};

type InvoiceData = {
  company: CompanyInfo;
  user: UserInfo;
  shippingAddress?: string;
  orderItems: OrderItem[];
  total: number;
  note?: string;
  cancelReason?: string;
  chauffeur?: { name?: string };
  camion?: { matricule?: string };
};



export default function InvoicePreviewPage() {
  const t = useTranslations("dashboard");
  const tInvoices = useTranslations("invoices");
  const tCommon = useTranslations("common");
  const router = useRouter();
  const params = useParams();
  const orderId = params.id as string;
  const documentType = params.type as string;
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvoiceData = async () => {
      try {
        setLoading(true);
        const response = await getInvoicesForOrderAction(orderId, documentType);
        if (response.success && response.data) {
          // Compose company info (could be static or from API)
          const company: CompanyInfo = {
            name: response.data.company?.name || "Jacket's Club",
            address: response.data.company?.address || "123 Company Street",
            phone: response.data.company?.phone || "(123) 456-7890",
            email: response.data.company?.email || "contact@jacketsclub.com",
          };
          // Compose user info
          const user: UserInfo = {
            firstName: response.data.user?.firstName || "",
            lastName: response.data.user?.lastName || "",
            phoneNumber: response.data.user?.phoneNumber,
            email: response.data.user?.email,
          };
          // Compose order items
          const orderItems: OrderItem[] = (response.data.orderItems || []).map((item: any) => ({
            product: { name: item.product?.name || "Product" },
            quantity: item.quantity,
            price: item.price,
          }));
          // Compose invoice data
          const invoice: InvoiceData = {
            company,
            user,
            shippingAddress: response.data.shippingAddress,
            orderItems,
            total: response.data.total || 0,
            note: response.data.note,
            cancelReason: response.data.cancelReason,
            chauffeur: response.data.chauffeur,
            camion: response.data.camion,
          };
          setInvoiceData(invoice);
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
        return tInvoices("bonLivraison");
      case "bon-commande":
        return tInvoices("bonCommande");
      case "bon-retour":
        return tInvoices("bonRetour");
      case "bon-reception":
        return tInvoices("bonReception");
      case "facture":
        return tInvoices("facture");
      case "facture-proforma":
        return tInvoices("factureProforma");
      case "facture-avoir":
        return tInvoices("factureAvoir");
      default:
        return tInvoices("document");
    }
  };

  const handlePrint = async () => {
    try {
      window.open(`/api/orders/${orderId}/print/${documentType}`, "_blank");
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
          <SalamiLoadingAnimation size="md" showLoading={true} />
        </div>
      </div>
    );
  }

  if (error || !invoiceData) {
    return (
      <div className="container mx-auto p-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-red-500">{tCommon("error")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || tInvoices("failedToLoadInvoice")}</p>
            {(documentType === "bon-reception" || documentType === "facture-avoir") && (
              <p className="mt-2 text-muted-foreground">
                {tInvoices("documentUnderDevelopment")}
              </p>
            )}
          </CardContent>
          <CardFooter>
            <Button onClick={handleBack} variant="outline" className="flex items-center">
              <ArrowLeft className="mr-2 h-4 w-4" />
              {tCommon("back")}
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">{tInvoices("documentPreview", { document: getDocumentTitle(documentType) })}</h1>
        <div className="flex space-x-4">
          <Button onClick={handleBack} variant="outline" className="flex items-center">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tCommon("back")}
          </Button>
          <Button onClick={handlePrint} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            {tCommon("print")}
          </Button>
        </div>
      </div>

      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="border-b">
          <CardTitle>{tInvoices("documentWithOrderNumber", { 
            document: getDocumentTitle(documentType), 
            orderId: orderId 
          })}</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          {/* This will be a placeholder until we get actual preview data */}
          <div className="space-y-6">
            {/* Header Information */}
            <div className="flex justify-between">
              <div>
                <h3 className="font-bold text-lg">{tInvoices("companyInformation")}</h3>
                <p>{invoiceData.company.name}</p>
                <p>{tInvoices("address")}: {invoiceData.company.address}</p>
                <p>{tCommon("phone")}: {invoiceData.company.phone}</p>
                <p>{tCommon("email")}: {invoiceData.company.email}</p>
              </div>
              <div className="text-right">
                <h3 className="font-bold text-lg">{tInvoices("documentDetails")}</h3>
                <p>{tInvoices("documentNumber")}: {documentType.toUpperCase()}-{orderId}</p>
                <p>{tCommon("date")}: {new Date().toLocaleDateString()}</p>
                <p>{tInvoices("orderReference")}: #{orderId}</p>
              </div>
            </div>

            {/* Customer Information */}
            <div>
              <h3 className="font-bold text-lg">{tInvoices("customerInformation")}</h3>
              <p>{tCommon("name")}: {invoiceData.user.firstName} {invoiceData.user.lastName}</p>
              <p>{tInvoices("address")}: {invoiceData.shippingAddress || "N/A"}</p>
              <p>{tCommon("phone")}: {invoiceData.user.phoneNumber || "N/A"}</p>
              <p>{tCommon("email")}: {invoiceData.user.email || "N/A"}</p>
            </div>

            {/* Items Table */}
            <div>
              <h3 className="font-bold text-lg mb-2">{tInvoices("items")}</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800">
                    <th className="border p-2 text-left">{tInvoices("item")}</th>
                    <th className="border p-2 text-right">{tInvoices("quantity")}</th>
                    <th className="border p-2 text-right">{tInvoices("price")}</th>
                    <th className="border p-2 text-right">{tCommon("total")}</th>
                  </tr>
                </thead>
                <tbody>
                  {invoiceData.orderItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="border p-2">{item.product.name}</td>
                      <td className="border p-2 text-right">{item.quantity}</td>
                      <td className="border p-2 text-right">{parseFloat(item.price as string).toFixed(2)} DZD</td>
                      <td className="border p-2 text-right">{(parseFloat(item.price as string) * item.quantity).toFixed(2)} DZD</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot>
                  <tr className="font-bold">
                    <td colSpan={3} className="border p-2 text-right">{tInvoices("subtotal")}</td>
                    <td className="border p-2 text-right">{invoiceData.total?.toFixed(2) || "0.00"} DZD</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={3} className="border p-2 text-right">{tInvoices("tax")}</td>
                    <td className="border p-2 text-right">{(invoiceData.total ? invoiceData.total * 0.19 : 0).toFixed(2)} DZD</td>
                  </tr>
                  <tr className="font-bold">
                    <td colSpan={3} className="border p-2 text-right">{tCommon("total")}</td>
                    <td className="border p-2 text-right">{(invoiceData.total ? invoiceData.total * 1.19 : 0).toFixed(2)} DZD</td>
                  </tr>
                </tfoot>
              </table>
            </div>

            {/* Notes */}
            {invoiceData.note && (
              <div>
                <h3 className="font-bold text-lg">{tCommon("notes")}</h3>
                <p>{invoiceData.note}</p>
              </div>
            )}
            
            {/* Additional sections based on document type */}
            {documentType === "bon-livraison" && (
              <div>
                <h3 className="font-bold text-lg">{tInvoices("deliveryInformation")}</h3>
                <p>{tInvoices("deliveryDate")}: {new Date().toLocaleDateString()}</p>
                <p>{tInvoices("carrier")}: {invoiceData.chauffeur?.name || "N/A"}</p>
                <p>{tInvoices("vehicle")}: {invoiceData.camion?.matricule || "N/A"}</p>
              </div>
            )}
            
            {documentType === "bon-retour" && invoiceData.cancelReason && (
              <div>
                <h3 className="font-bold text-lg">{tInvoices("returnReason")}</h3>
                <p>{invoiceData.cancelReason}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between border-t p-6">
          <div>
            <p className="text-sm text-muted-foreground">
              {tInvoices("thankYou")}
            </p>
          </div>
          <Button onClick={handlePrint} className="flex items-center">
            <Printer className="mr-2 h-4 w-4" />
            {tCommon("print")}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
