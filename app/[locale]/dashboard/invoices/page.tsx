"use client";
import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter, useSearchParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Filter, Calendar, X } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import InvoicesList from "@/components/invoices/invoices-list";

// Define OrderStatus enum to match the backend
enum OrderStatus {
  PENDING = "PENDING",
  ACCEPTED = "ACCEPTED",
  REJECTED = "REJECTED",
  CANCELED = "CANCELED",
  PREPARING = "PREPARING",
  SHIPPING = "SHIPPING",
  COMPLETED = "COMPLETED",
  RETURNED = "RETURNED",
}

export default function InvoicesPage() {
  const t = useTranslations("dashboard");
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const [selectedTab, setSelectedTab] = useState<string>("bon-livraison");
  const [searchTerm, setSearchTerm] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string>("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isGlobalSearchMode, setIsGlobalSearchMode] = useState(false);

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
  
  // Initialize state from URL params
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hash = window.location.hash.replace('#', '');
      const urlTab = searchParams.get('tab');
      const urlSearch = searchParams.get('search');
      const urlGlobalSearch = searchParams.get('globalSearch');
      const urlStatus = searchParams.get('status');
      const urlStartDate = searchParams.get('startDate');
      const urlEndDate = searchParams.get('endDate');
      
      if (hash && documentTypes.some(docType => docType.id === hash)) {
        setSelectedTab(hash);
      } else if (urlTab && documentTypes.some(docType => docType.id === urlTab)) {
        setSelectedTab(urlTab);
      }
      
      if (urlSearch) setSearchTerm(urlSearch);
      if (urlGlobalSearch) {
        setGlobalSearch(urlGlobalSearch);
        setIsGlobalSearchMode(true);
      }
      if (urlStatus) setSelectedStatus(urlStatus);
      if (urlStartDate) setStartDate(urlStartDate);
      if (urlEndDate) setEndDate(urlEndDate);
    }
  }, []);

  // Update URL when filters change
  const updateURL = () => {
    const params = new URLSearchParams();
    
    if (selectedTab !== "bon-livraison") params.set('tab', selectedTab);
    if (isGlobalSearchMode && globalSearch) params.set('globalSearch', globalSearch);
    else if (searchTerm) params.set('search', searchTerm);
    if (selectedStatus) params.set('status', selectedStatus);
    if (startDate) params.set('startDate', startDate);
    if (endDate) params.set('endDate', endDate);

    const newUrl = `/dashboard/invoices${params.toString() ? `?${params.toString()}` : ''}`;
    router.push(newUrl, { scroll: false });
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      updateURL();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, globalSearch, selectedStatus, startDate, endDate, selectedTab, isGlobalSearchMode]);

  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: OrderStatus.PENDING, label: "Pending" },
    { value: OrderStatus.ACCEPTED, label: "Accepted" },
    { value: OrderStatus.REJECTED, label: "Rejected" },
    { value: OrderStatus.CANCELED, label: "Canceled" },
    { value: OrderStatus.PREPARING, label: "Preparing" },
    { value: OrderStatus.SHIPPING, label: "Shipping" },
    { value: OrderStatus.COMPLETED, label: "Completed" },
    { value: OrderStatus.RETURNED, label: "Returned" },
  ];

  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    // Clear category-specific search when switching tabs
    if (!isGlobalSearchMode) {
      setSearchTerm("");
    }
  };

  const toggleSearchMode = () => {
    setIsGlobalSearchMode(!isGlobalSearchMode);
    setSearchTerm("");
    setGlobalSearch("");
  };

  const clearFilters = () => {
    setSearchTerm("");
    setGlobalSearch("");
    setSelectedStatus("");
    setStartDate("");
    setEndDate("");
    setIsGlobalSearchMode(false);
  };

  const hasActiveFilters = searchTerm || globalSearch || selectedStatus || startDate || endDate;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">{t("invoices")}</h1>
        
        {/* Search Controls */}
        <div className="flex items-center space-x-4">
          {/* Global vs Category Search Toggle */}
          <Button
            variant={isGlobalSearchMode ? "default" : "outline"}
            size="sm"
            onClick={toggleSearchMode}
            className="flex items-center space-x-2"
          >
            <Search className="h-4 w-4" />
            <span>{isGlobalSearchMode ? "Global Search" : "Category Search"}</span>
          </Button>

          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={isGlobalSearchMode ? "Search all invoices..." : `Search in ${documentTypes.find(d => d.id === selectedTab)?.label}...`}
              value={isGlobalSearchMode ? globalSearch : searchTerm}
              onChange={(e) => isGlobalSearchMode ? setGlobalSearch(e.target.value) : setSearchTerm(e.target.value)}
              className="pl-10 w-80"
            />
          </div>

          {/* Advanced Filters */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="flex items-center space-x-2"
              >
                <Filter className="h-4 w-4" />
                <span>Filters</span>
                {hasActiveFilters && (
                  <span className="ml-1 rounded-full bg-primary w-2 h-2" />
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      {statusOptions.map((status) => (
                        <SelectItem key={status.value} value={status.value}>
                          {status.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Date Range</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="startDate" className="text-xs">From</Label>
                      <Input
                        id="startDate"
                        type="date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor="endDate" className="text-xs">To</Label>
                      <Input
                        id="endDate"
                        type="date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearFilters}
                    disabled={!hasActiveFilters}
                  >
                    Clear Filters
                  </Button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 mb-4 p-4 bg-muted rounded-lg">
          <span className="text-sm font-medium">Active filters:</span>
          
          {(searchTerm || globalSearch) && (
            <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-md text-sm">
              <Search className="h-3 w-3" />
              <span>{isGlobalSearchMode ? `Global: "${globalSearch}"` : `Category: "${searchTerm}"`}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => isGlobalSearchMode ? setGlobalSearch("") : setSearchTerm("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {selectedStatus && (
            <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-md text-sm">
              <span>Status: {statusOptions.find(s => s.value === selectedStatus)?.label}</span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => setSelectedStatus("")}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          {(startDate || endDate) && (
            <div className="flex items-center gap-1 bg-background px-2 py-1 rounded-md text-sm">
              <Calendar className="h-3 w-3" />
              <span>
                {startDate && endDate ? `${startDate} to ${endDate}` : 
                 startDate ? `From ${startDate}` : 
                 `Until ${endDate}`}
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="h-4 w-4 p-0"
                onClick={() => {
                  setStartDate("");
                  setEndDate("");
                }}
              >
                <X className="h-3 w-3" />
              </Button>
            </div>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto"
          >
            Clear All
          </Button>
        </div>
      )}
      
      <Tabs value={selectedTab} onValueChange={handleTabChange}>
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
                <InvoicesList 
                  documentType={isGlobalSearchMode ? "all" : docType.id}
                  searchTerm={isGlobalSearchMode ? globalSearch : searchTerm}
                  status={selectedStatus}
                  startDate={startDate}
                  endDate={endDate}
                />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}
