export const STOCKTAKING_STATUS = {
    IN_PROGRESS: "IN_PROGRESS",
    COUNT_CONFIRMED: "COUNT_CONFIRMED",
    STOCK_BALANCED: "STOCK_BALANCED"
};

export const stocktakingStatusLabel = {
    IN_PROGRESS: "Đang kiểm kê",
    COUNT_CONFIRMED: "Đã chốt số liệu",
    STOCK_BALANCED: "Đã cân bằng kho"
};

export const stocktakingStatusColor = {
    IN_PROGRESS: "yellow",
    COUNT_CONFIRMED: "pink",
    STOCK_BALANCED: "green"
};

export const stocktakingTypeLabel = {
    PERIODIC: "Định kỳ",
    AD_HOC: "Đột xuất"
};

export const stockGroupLabel = {
    MATERIAL: "NVL",
    PRODUCT: "Sản phẩm"
};

export const itemStatusLabel = {
    MATCHED: "Khớp dữ liệu",
    DISCREPANCY: "Chênh lệch"
};

export const itemStatusColor = {
    MATCHED: "green",
    DISCREPANCY: "red"
};

export const isEditable = (status) =>
    status === STOCKTAKING_STATUS.IN_PROGRESS;

export const canConfirm = (status) =>
    status === STOCKTAKING_STATUS.IN_PROGRESS;

export const canBalance = (status) =>
    status === STOCKTAKING_STATUS.COUNT_CONFIRMED;
