export const SEVERITY_LABELS = {
    CRITICAL: "Nguy cấp",
    WARNING: "Cần chú ý"
};

export const SEVERITY_COLORS = {
    CRITICAL: "red",
    WARNING: "yellow"
};

export const SEVERITY_DOTS = {
    CRITICAL: "🔴",
    WARNING: "🟡"
};

export const RISK_GROUP_LABELS = {
    SUPPLY_THRESHOLD: "Ngưỡng cung ứng",
    QUALITY_RISK: "Rủi ro chất lượng",
    INTERNAL_CONTROL: "Kiểm soát nội bộ"
};

export const ALERT_TYPE_LABELS = {
    BELOW_MIN: "Dưới Min",
    ABOVE_MAX: "Vượt Max",
    NEAR_EXPIRY: "Cận Date - FEFO",
    STOCKTAKING_VARIANCE: "Sai lệch Kiểm kê"
};

export const ALERT_TYPE_OPTIONS = [
    { value: "", label: "Tất cả nhóm rủi ro" },
    { value: "BELOW_MIN", label: ALERT_TYPE_LABELS.BELOW_MIN },
    { value: "ABOVE_MAX", label: ALERT_TYPE_LABELS.ABOVE_MAX },
    { value: "NEAR_EXPIRY", label: ALERT_TYPE_LABELS.NEAR_EXPIRY },
    {
        value: "STOCKTAKING_VARIANCE",
        label: ALERT_TYPE_LABELS.STOCKTAKING_VARIANCE
    }
];

export const GROUP_SHORT_LABELS = {
    MATERIAL: "NVL",
    PRODUCT: "Sản phẩm"
};
