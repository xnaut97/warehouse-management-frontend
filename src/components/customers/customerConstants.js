export const CUSTOMER_GROUP_LABELS = {
    AGENT: "Đại lý",
    PROJECT: "Dự án",
    RETAIL: "Khách lẻ"
};

export const CUSTOMER_GROUPS = [
    "AGENT",
    "PROJECT",
    "RETAIL"
];

export const DEFAULT_CUSTOMER_GROUP = CUSTOMER_GROUPS[0];

export const customerGroupLabel = (group) =>
    CUSTOMER_GROUP_LABELS[group] || group || "";
