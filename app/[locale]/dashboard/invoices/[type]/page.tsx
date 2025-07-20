"use client";

import { useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoiceTypePage() {
  const router = useRouter();
  const params = useParams();
  const t = useTranslations("Dashboard");
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

  return (
    <div className="container mx-auto p-8">
      <Card>
        <CardHeader>
          <CardTitle>{getDocumentTitle(documentType)}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center py-10">{t("loading")}</p>
        </CardContent>
      </Card>
    </div>
  );
}
