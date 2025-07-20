"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import InvoicesList from "@/components/invoices/invoices-list";

export default function InvoicesPage() {
  const t = useTranslations("dashboard");
  const [selectedTab, setSelectedTab] = useState<string>("bon-livraison");
  
  // Effect to handle URL fragment for tab selection
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      if (hash && documentTypes.some(docType => docType.id === hash)) {
        setSelectedTab(hash);
      }
    }
  }, []);

  // Define all invoice document types
  const documentTypes = [
    { id: "bon-livraison", label: t("bonLivraison", {defaultValue: "Bon de Livraison"}) },
    { id: "bon-commande", label: t("bonCommande", {defaultValue: "Bon de Commande"}) },
    { id: "bon-retour", label: t("bonRetour", {defaultValue: "Bon de Retour"}) },
    { id: "bon-reception", label: t("bonReception", {defaultValue: "Bon de Reception"}) },
    { id: "facture", label: t("facture", {defaultValue: "Facture"}) },
    { id: "facture-proforma", label: t("factureProforma", {defaultValue: "Facture Proforma"}) },
    { id: "facture-avoir", label: t("factureAvoir", {defaultValue: "Facture Avoir"}) },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{t("invoices")}</h1>
      
      <Tabs defaultValue="bon-livraison" onValueChange={setSelectedTab}>
        <TabsList className="grid grid-cols-2 md:grid-cols-7 mb-8">
          {documentTypes.map((docType) => (
            <TabsTrigger key={docType.id} value={docType.id}>
              {docType.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {documentTypes.map((docType) => (
          <TabsContent key={docType.id} value={docType.id}>
            <Card>
              <CardHeader>
                <CardTitle>{docType.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <InvoicesList documentType={docType.id} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
