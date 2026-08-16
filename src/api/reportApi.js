import api from "./axiosClient";

const reportApi = {

    getReceiptDaily: (params) =>
        api.get("/reports/receipts/daily", { params }),

    getReceiptMonthly: (params) =>
        api.get("/reports/receipts/monthly", { params }),

    getReceiptSuppliers: (params) =>
        api.get("/reports/receipts/suppliers", { params }),

    getIssueDaily: (params) =>
        api.get("/reports/issues/daily", { params }),

    getIssueCustomers: (params) =>
        api.get("/reports/issues/customers", { params }),

    getIssueMaterials: (params) =>
        api.get("/reports/issues/materials", { params }),

    getInventoryRawMaterials: (params) =>
        api.get("/reports/inventory/raw-materials", { params }),

    getInventoryHistory: (params) =>
        api.get("/reports/inventory/history", { params }),

    getStocktaking: (params) =>
        api.get("/reports/stocktaking", { params }),

    getStocktakingVariances: (params) =>
        api.get("/reports/stocktaking/variances", { params }),

    getStocktakingSummary: () =>
        api.get("/reports/stocktaking/summary"),

    getInventoryValue: (params) =>
        api.get("/reports/inventory-value", { params }),

    getOperations: (params) =>
        api.get("/reports/operations", { params }),

    getOperationsStockSummary: (params) =>
        api.get("/reports/operations/stock-summary", { params }),

    getStocktakingAccuracy: (params) =>
        api.get("/reports/stocktaking/accuracy", { params }),

    getAuditLogs: (params) =>
        api.get("/audit-logs", { params })

};

export default reportApi;
