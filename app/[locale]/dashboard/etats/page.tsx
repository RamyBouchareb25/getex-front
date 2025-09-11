"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Users, 
  ShoppingCart, 
  Package, 
  Warehouse, 
  Building2, 
  TrendingUp, 
  UserCheck,
  Calendar,
  Filter,
  Eye,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";
import { toast } from "sonner";
import {
  generateUsersReportAction,
  generateOrdersReportAction,
  generateProductsReportAction,
  generateStockReportAction,
  generateCompaniesReportAction,
  generateSalesReportAction,
  generateUserOrdersReportAction,
  generatePDFReportAction,
  type ReportFilter
} from "@/lib/actions/etats";

interface ReportType {
  id: string;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  action: (filters?: ReportFilter) => Promise<any>;
}

export default function EtatsPage() {
  const t = useTranslations("etats");
  const tCommon = useTranslations("common");
  
  const [selectedReportType, setSelectedReportType] = useState<string>("");
  const [filters, setFilters] = useState<ReportFilter>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);

  const reportTypes: ReportType[] = [
    {
      id: "users",
      title: t("reportTypes.users.title"),
      description: t("reportTypes.users.description"),
      icon: Users,
      color: "bg-blue-500",
      action: generateUsersReportAction
    },
    {
      id: "orders",
      title: t("reportTypes.orders.title"),
      description: t("reportTypes.orders.description"),
      icon: ShoppingCart,
      color: "bg-green-500",
      action: generateOrdersReportAction
    },
    {
      id: "products",
      title: t("reportTypes.products.title"),
      description: t("reportTypes.products.description"),
      icon: Package,
      color: "bg-purple-500",
      action: generateProductsReportAction
    },
    {
      id: "stock",
      title: t("reportTypes.stock.title"),
      description: t("reportTypes.stock.description"),
      icon: Warehouse,
      color: "bg-orange-500",
      action: generateStockReportAction
    },
    {
      id: "companies",
      title: t("reportTypes.companies.title"),
      description: t("reportTypes.companies.description"),
      icon: Building2,
      color: "bg-indigo-500",
      action: generateCompaniesReportAction
    },
    {
      id: "sales",
      title: t("reportTypes.sales.title"),
      description: t("reportTypes.sales.description"),
      icon: TrendingUp,
      color: "bg-emerald-500",
      action: generateSalesReportAction
    },
    {
      id: "userOrders",
      title: t("reportTypes.userOrders.title"),
      description: t("reportTypes.userOrders.description"),
      icon: UserCheck,
      color: "bg-pink-500",
      action: (filters) => generateUserOrdersReportAction(filters?.userId || "1", filters)
    }
  ];

  const handleReportTypeSelect = (typeId: string) => {
    setSelectedReportType(typeId);
    setPreviewData(null);
    setFilters({});
  };

  const handleFilterChange = (key: keyof ReportFilter, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateReport = async (downloadPDF: boolean = false) => {
    if (!selectedReportType) {
      toast.error(t("messages.selectReportType"));
      return;
    }

    const reportType = reportTypes.find(type => type.id === selectedReportType);
    if (!reportType) return;

    setIsGenerating(true);

    try {
      toast.info(t("messages.reportGenerating"));
      
      const result = await reportType.action(filters);
      
      if (result.success) {
        setPreviewData(result.data);
        toast.success(t("reportGenerated"));

        if (downloadPDF) {
          const pdfResult = await generatePDFReportAction(result.data);
          if (pdfResult.success) {
            // Simulate PDF download
            toast.success("PDF ready for download");
            console.log("Download PDF:", pdfResult.filename);
          }
        }
      } else {
        toast.error(result.error || t("reportFailed"));
      }
    } catch (error) {
      console.error("Error generating report:", error);
      toast.error(t("messages.reportError"));
    } finally {
      setIsGenerating(false);
    }
  };

  const selectedReportTypeData = reportTypes.find(type => type.id === selectedReportType);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t("title")}</h1>
        <p className="text-muted-foreground">{t("description")}</p>
      </div>

      {/* Report Type Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {t("selectReportType")}
          </CardTitle>
          <CardDescription>
            Choose the type of report you want to generate
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {reportTypes.map((type) => (
              <Card
                key={type.id}
                className={`cursor-pointer transition-all hover:shadow-md ${
                  selectedReportType === type.id 
                    ? "ring-2 ring-primary" 
                    : "hover:bg-muted/50"
                }`}
                onClick={() => handleReportTypeSelect(type.id)}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-md ${type.color} text-white`}>
                      <type.icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-sm font-medium">
                        {type.title}
                      </CardTitle>
                    </div>
                    {selectedReportType === type.id && (
                      <CheckCircle className="h-4 w-4 text-green-500" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-xs text-muted-foreground">
                    {type.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Filters Section */}
      {selectedReportType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              {t("selectFilters")}
            </CardTitle>
            <CardDescription>
              Configure filters for your {selectedReportTypeData?.title.toLowerCase()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Date Range */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="from-date">{t("filters.from")}</Label>
                <Input
                  id="from-date"
                  type="date"
                  onChange={(e) => handleFilterChange("dateRange", {
                    ...filters.dateRange,
                    from: new Date(e.target.value)
                  })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="to-date">{t("filters.to")}</Label>
                <Input
                  id="to-date"
                  type="date"
                  onChange={(e) => handleFilterChange("dateRange", {
                    ...filters.dateRange,
                    to: new Date(e.target.value)
                  })}
                />
              </div>
            </div>

            {/* Status Filter (for orders/stock) */}
            {(selectedReportType === "orders" || selectedReportType === "stock") && (
              <div className="space-y-2">
                <Label>{t("filters.status")}</Label>
                <Select onValueChange={(value) => handleFilterChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.allStatuses")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t("filters.allStatuses")}</SelectItem>
                    <SelectItem value="pending">{tCommon("pending")}</SelectItem>
                    <SelectItem value="completed">{tCommon("completed")}</SelectItem>
                    <SelectItem value="canceled">{tCommon("canceled")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* User Filter (for user orders) */}
            {selectedReportType === "userOrders" && (
              <div className="space-y-2">
                <Label>{t("filters.user")}</Label>
                <Select onValueChange={(value) => handleFilterChange("userId", value)}>
                  <SelectTrigger>
                    <SelectValue placeholder={t("filters.selectUser")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">Ahmed Ben Ali</SelectItem>
                    <SelectItem value="2">Fatima Zohra</SelectItem>
                    <SelectItem value="3">Mohamed Amine</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Company Filter */}
            <div className="space-y-2">
              <Label>{t("filters.company")}</Label>
              <Select onValueChange={(value) => handleFilterChange("companyId", value)}>
                <SelectTrigger>
                  <SelectValue placeholder={t("filters.allCompanies")} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">{t("filters.allCompanies")}</SelectItem>
                  <SelectItem value="1">Bellat Corporation</SelectItem>
                  <SelectItem value="2">Distribution Nord</SelectItem>
                  <SelectItem value="3">Grande Surface Sud</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Applied Filters Display */}
            {Object.keys(filters).length > 0 && (
              <div className="pt-4 border-t">
                <Label className="text-sm font-medium">Applied Filters:</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {filters.dateRange?.from && (
                    <Badge variant="secondary">
                      From: {filters.dateRange.from.toLocaleDateString()}
                    </Badge>
                  )}
                  {filters.dateRange?.to && (
                    <Badge variant="secondary">
                      To: {filters.dateRange.to.toLocaleDateString()}
                    </Badge>
                  )}
                  {filters.status && (
                    <Badge variant="secondary">
                      Status: {filters.status}
                    </Badge>
                  )}
                  {filters.userId && (
                    <Badge variant="secondary">
                      User ID: {filters.userId}
                    </Badge>
                  )}
                  {filters.companyId && filters.companyId !== "all" && (
                    <Badge variant="secondary">
                      Company ID: {filters.companyId}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      {selectedReportType && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              {t("actions.generateAndDownload")}
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-3">
            <Button 
              onClick={() => generateReport(false)}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
              {t("actions.preview")}
            </Button>
            
            <Button 
              onClick={() => generateReport(true)}
              disabled={isGenerating}
              variant="default"
              className="flex items-center gap-2"
            >
              {isGenerating ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Download className="h-4 w-4" />
              )}
              {t("downloadPDF")}
            </Button>

            <Button 
              onClick={() => generateReport(false)}
              disabled={isGenerating}
              variant="outline"
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              {t("actions.refresh")}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Preview Section */}
      {previewData && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Report Preview: {previewData.title}
            </CardTitle>
            <CardDescription>
              Generated on {new Date(previewData.generatedAt).toLocaleString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Summary Stats */}
            {previewData.summary && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(previewData.summary).map(([key, value]) => (
                  <div key={key} className="p-3 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/([A-Z])/g, " $1")}
                    </p>
                    <p className="text-lg font-semibold">
                      {typeof value === "number" && key.includes("Revenue") 
                        ? `${value.toLocaleString()} DA`
                        : typeof value === "number"
                        ? value.toLocaleString()
                        : String(value)
                      }
                    </p>
                  </div>
                ))}
              </div>
            )}

            <Separator />

            {/* Data Table Preview */}
            <div>
              <h4 className="font-semibold mb-3">Data Preview (First 5 records)</h4>
              {previewData.records && previewData.records.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        {Object.keys(previewData.records[0]).map((header) => (
                          <th key={header} className="text-left p-2 capitalize">
                            {header.replace(/([A-Z])/g, " $1")}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {previewData.records.slice(0, 5).map((record: any, index: number) => (
                        <tr key={index} className="border-b">
                          {Object.values(record).map((value: any, cellIndex) => (
                            <td key={cellIndex} className="p-2">
                              {typeof value === "object" ? JSON.stringify(value) : String(value)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <AlertTriangle className="h-5 w-5 mr-2" />
                  {t("noDataAvailable")}
                </div>
              )}
            </div>

            {previewData.records && previewData.records.length > 5 && (
              <p className="text-sm text-muted-foreground">
                ... and {previewData.records.length - 5} more records
              </p>
            )}
          </CardContent>
        </Card>
      )}

      {/* Status Messages */}
      {isGenerating && (
        <Card>
          <CardContent className="flex items-center justify-center py-8">
            <div className="flex items-center gap-3 text-muted-foreground">
              <RefreshCw className="h-5 w-5 animate-spin" />
              <span>{t("generating")}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {!selectedReportType && (
        <Card>
          <CardContent className="flex items-center justify-center py-12">
            <div className="text-center space-y-3">
              <FileText className="h-12 w-12 text-muted-foreground mx-auto" />
              <div>
                <h3 className="font-medium">{t("selectReportType")}</h3>
                <p className="text-sm text-muted-foreground">
                  Choose a report type from the options above to get started
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
