export const CHART_COLORS = [
    "#ec7fa9",
    "#0ea5e9",
    "#34d399",
    "#f59e0b",
    "#a78bfa",
    "#fb7185",
    "#22d3ee",
    "#f97316"
];

export const GROUP_COLORS = {
    MATERIAL: "#ec7fa9",
    PRODUCT: "#0ea5e9"
};

export const GROUP_LABELS = {
    MATERIAL: "Nguyên vật liệu",
    PRODUCT: "Sản phẩm"
};

export const WEEKDAY_LABELS = {
    MONDAY: "Thứ 2",
    TUESDAY: "Thứ 3",
    WEDNESDAY: "Thứ 4",
    THURSDAY: "Thứ 5",
    FRIDAY: "Thứ 6",
    SATURDAY: "Thứ 7",
    SUNDAY: "Chủ nhật"
};

export const colorAt = (index) =>
    CHART_COLORS[index % CHART_COLORS.length];

export const AXIS_COLOR = "#f1d6df";

export const LABEL_COLOR = "#6b7280";
