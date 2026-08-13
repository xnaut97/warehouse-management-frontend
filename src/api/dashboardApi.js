import api from "./axiosClient";

const dashboardApi = {

    getOverview: () =>
        api.get("/dashboard/overview"),

    getSummary: () =>
        api.get("/dashboard/summary"),

    getInventoryAnalysis: () =>
        api.get("/dashboard/inventory-analysis"),

    getInventoryVariance: () =>
        api.get("/dashboard/inventory-variance"),

    getDecisionSupport: () =>
        api.get("/dashboard/decision-support"),

    getMonthlyReceipts: () =>
        api.get("/dashboard/monthly-receipts"),

    getMonthlyIssues: () =>
        api.get("/dashboard/monthly-issues"),

    getInventoryTrend: () =>
        api.get("/dashboard/inventory-trend"),

    getOperationAlerts: () =>
        api.get("/dashboard/operation-alerts"),

    getRecentTransactions: () =>
        api.get("/dashboard/recent-transactions"),
};

export default dashboardApi;
