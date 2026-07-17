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

    getInventoryRawMaterials: () =>
        api.get("/reports/inventory/raw-materials"),

    getInventoryHistory: (params) =>
        api.get("/reports/inventory/history", { params }),

    getStocktaking: () =>
        api.get("/reports/stocktaking"),

    getStocktakingVariances: () =>
        api.get("/reports/stocktaking/variances"),

    getStocktakingSummary: () =>
        api.get("/reports/stocktaking/summary"),

    getAuditLogs: (params) =>
        api.get("/audit-logs", { params })

};

export default reportApi;
