"use server";
import { serverApi } from "../axios-interceptor";

// Types for report data
export interface ReportFilter {
  dateRange?: {
    from: Date;
    to: Date;
  };
  status?: string;
  userId?: string;
  companyId?: string;
  productId?: string;
  categoryId?: string;
}

export interface ReportData {
  id: string;
  title: string;
  description: string;
  type: string;
  data: any;
  createdAt: Date;
  parameters: ReportFilter;
}

// Mock data generators
const generateMockUsers = () => [
  { id: "1", name: "Ahmed Ben Ali", email: "ahmed@example.com", role: "ADMIN", company: "Jacket's Club Corp", createdAt: "2024-01-15" },
  { id: "2", name: "Fatima Zohra", email: "fatima@example.com", role: "POINT_DE_VENTE", company: "Distribution Nord", createdAt: "2024-02-20" },
  { id: "3", name: "Mohamed Amine", email: "mohamed@example.com", role: "GROSSISTE", company: "Grossiste Sud", createdAt: "2024-03-10" },
];

const generateMockOrders = () => [
  { id: "ORD-001", customer: "Ahmed Ben Ali", total: 15000, status: "COMPLETED", items: 5, createdAt: "2024-11-01" },
  { id: "ORD-002", customer: "Fatima Zohra", total: 8500, status: "PENDING", items: 3, createdAt: "2024-11-05" },
  { id: "ORD-003", customer: "Mohamed Amine", total: 23000, status: "SHIPPING", items: 8, createdAt: "2024-11-08" },
];

const generateMockProducts = () => [
  { id: "PRD-001", name: "Couscous Premium", category: "Céréales", stock: 150, price: 450, createdAt: "2024-01-10" },
  { id: "PRD-002", name: "Huile d'Olive Extra", category: "Huiles", stock: 75, price: 1200, createdAt: "2024-02-15" },
  { id: "PRD-003", name: "Lait UHT", category: "Produits Laitiers", stock: 200, price: 120, createdAt: "2024-03-20" },
];

const generateMockStock = () => [
  { productId: "PRD-001", productName: "Couscous Premium", currentStock: 150, minStock: 50, owner: "Jacket's Club Stock", status: "IN_STOCK" },
  { productId: "PRD-002", productName: "Huile d'Olive Extra", currentStock: 15, minStock: 20, owner: "Jacket's Club Stock", status: "LOW_STOCK" },
  { productId: "PRD-003", productName: "Lait UHT", currentStock: 0, minStock: 30, owner: "Distribution Nord", status: "OUT_OF_STOCK" },
];

const generateMockCompanies = () => [
  { id: "CMP-001", name: "Jacket's Club Corporation", type: "GROSSISTE", users: 15, orders: 45, revenue: 1250000 },
  { id: "CMP-002", name: "Distribution Nord", type: "POINT_DE_VENTE", users: 8, orders: 32, revenue: 850000 },
  { id: "CMP-003", name: "Grande Surface Sud", type: "GRANDE_SURFACE", users: 12, orders: 78, revenue: 2100000 },
];

// Report generation actions
export const generateUsersReportAction = async (filters: ReportFilter = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await serverApi.post("/reports/users", filters);
    
    // Return mock data for now
    const mockData = generateMockUsers();
    
    return {
      success: true,
      data: {
        title: "Rapport des Utilisateurs",
        type: "users",
        generatedAt: new Date(),
        filters,
        records: mockData,
        summary: {
          totalUsers: mockData.length,
          adminUsers: mockData.filter(u => u.role === "ADMIN").length,
          activeCompanies: new Set(mockData.map(u => u.company)).size,
        }
      }
    };
  } catch (error) {
    console.error("Error generating users report:", error);
    return { success: false, error: "Failed to generate users report" };
  }
};

export const generateOrdersReportAction = async (filters: ReportFilter = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await serverApi.post("/reports/orders", filters);
    
    // Return mock data for now
    const mockData = generateMockOrders();
    
    return {
      success: true,
      data: {
        title: "Rapport des Commandes",
        type: "orders",
        generatedAt: new Date(),
        filters,
        records: mockData,
        summary: {
          totalOrders: mockData.length,
          totalRevenue: mockData.reduce((sum, order) => sum + order.total, 0),
          averageOrderValue: mockData.reduce((sum, order) => sum + order.total, 0) / mockData.length,
          completedOrders: mockData.filter(o => o.status === "COMPLETED").length,
        }
      }
    };
  } catch (error) {
    console.error("Error generating orders report:", error);
    return { success: false, error: "Failed to generate orders report" };
  }
};

export const generateProductsReportAction = async (filters: ReportFilter = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await serverApi.post("/reports/products", filters);
    
    // Return mock data for now
    const mockData = generateMockProducts();
    
    return {
      success: true,
      data: {
        title: "Rapport des Produits",
        type: "products",
        generatedAt: new Date(),
        filters,
        records: mockData,
        summary: {
          totalProducts: mockData.length,
          totalStockValue: mockData.reduce((sum, product) => sum + (product.stock * product.price), 0),
          categories: new Set(mockData.map(p => p.category)).size,
          lowStockProducts: mockData.filter(p => p.stock < 100).length,
        }
      }
    };
  } catch (error) {
    console.error("Error generating products report:", error);
    return { success: false, error: "Failed to generate products report" };
  }
};

export const generateStockReportAction = async (filters: ReportFilter = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await serverApi.post("/reports/stock", filters);
    
    // Return mock data for now
    const mockData = generateMockStock();
    
    return {
      success: true,
      data: {
        title: "Rapport du Stock",
        type: "stock",
        generatedAt: new Date(),
        filters,
        records: mockData,
        summary: {
          totalItems: mockData.length,
          inStock: mockData.filter(s => s.status === "IN_STOCK").length,
          lowStock: mockData.filter(s => s.status === "LOW_STOCK").length,
          outOfStock: mockData.filter(s => s.status === "OUT_OF_STOCK").length,
        }
      }
    };
  } catch (error) {
    console.error("Error generating stock report:", error);
    return { success: false, error: "Failed to generate stock report" };
  }
};

export const generateCompaniesReportAction = async (filters: ReportFilter = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await serverApi.post("/reports/companies", filters);
    
    // Return mock data for now
    const mockData = generateMockCompanies();
    
    return {
      success: true,
      data: {
        title: "Rapport des Entreprises",
        type: "companies",
        generatedAt: new Date(),
        filters,
        records: mockData,
        summary: {
          totalCompanies: mockData.length,
          totalRevenue: mockData.reduce((sum, company) => sum + company.revenue, 0),
          totalUsers: mockData.reduce((sum, company) => sum + company.users, 0),
          totalOrders: mockData.reduce((sum, company) => sum + company.orders, 0),
        }
      }
    };
  } catch (error) {
    console.error("Error generating companies report:", error);
    return { success: false, error: "Failed to generate companies report" };
  }
};

export const generateUserOrdersReportAction = async (userId: string, filters: ReportFilter = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await serverApi.post(`/reports/users/${userId}/orders`, filters);
    
    // Return mock data for now
    const mockUser = generateMockUsers().find(u => u.id === userId);
    const mockOrders = generateMockOrders().filter(o => o.customer === mockUser?.name);
    
    return {
      success: true,
      data: {
        title: `Rapport des Commandes - ${mockUser?.name}`,
        type: "user-orders",
        generatedAt: new Date(),
        filters: { ...filters, userId },
        user: mockUser,
        records: mockOrders,
        summary: {
          totalOrders: mockOrders.length,
          totalRevenue: mockOrders.reduce((sum, order) => sum + order.total, 0),
          completedOrders: mockOrders.filter(o => o.status === "COMPLETED").length,
        }
      }
    };
  } catch (error) {
    console.error("Error generating user orders report:", error);
    return { success: false, error: "Failed to generate user orders report" };
  }
};

export const generateSalesReportAction = async (filters: ReportFilter = {}) => {
  try {
    // TODO: Replace with actual API call
    // const response = await serverApi.post("/reports/sales", filters);
    
    // Return mock data for now
    const mockData = [
      { date: "2024-11-01", revenue: 15000, orders: 12, products: 45 },
      { date: "2024-11-02", revenue: 18500, orders: 15, products: 52 },
      { date: "2024-11-03", revenue: 12300, orders: 9, products: 38 },
      { date: "2024-11-04", revenue: 22100, orders: 18, products: 67 },
      { date: "2024-11-05", revenue: 19800, orders: 16, products: 59 },
    ];
    
    return {
      success: true,
      data: {
        title: "Rapport des Ventes",
        type: "sales",
        generatedAt: new Date(),
        filters,
        records: mockData,
        summary: {
          totalRevenue: mockData.reduce((sum, day) => sum + day.revenue, 0),
          totalOrders: mockData.reduce((sum, day) => sum + day.orders, 0),
          totalProducts: mockData.reduce((sum, day) => sum + day.products, 0),
          averageDailyRevenue: mockData.reduce((sum, day) => sum + day.revenue, 0) / mockData.length,
        }
      }
    };
  } catch (error) {
    console.error("Error generating sales report:", error);
    return { success: false, error: "Failed to generate sales report" };
  }
};

// PDF generation action (placeholder)
export const generatePDFReportAction = async (reportData: any) => {
  try {
    // TODO: Implement PDF generation
    // This could use libraries like jsPDF, Puppeteer, or a backend service
    console.log("Generating PDF for report:", reportData.title);
    
    // For now, return a mock PDF URL or blob
    return {
      success: true,
      pdfUrl: `/api/reports/pdf/${reportData.type}-${Date.now()}.pdf`,
      filename: `${reportData.title.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.pdf`
    };
  } catch (error) {
    console.error("Error generating PDF:", error);
    return { success: false, error: "Failed to generate PDF report" };
  }
};
