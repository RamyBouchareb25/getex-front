"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoiceTypePage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("Dashboard");
  const tInvoices = useTranslations("invoices");
  const tCommon = useTranslations("common");
  const documentType = params.type as string;
  const locale = params.locale as string;

  useEffect(() => {
    // Redirect to main invoices page with the correct tab selected
    const hash = `#${documentType}`; // Use fragment to indicate which tab to select
    router.replace(`/${locale}/dashboard/invoices${hash}`);
  }, [router, documentType, locale]);

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

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>{getDocumentTitle(documentType)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10">{tCommon("loading")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
