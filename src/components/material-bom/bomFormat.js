export const formatQuantity = (value) =>
    value === null || value === undefined
        ? "—"
        : new Intl.NumberFormat("vi-VN", {
            maximumFractionDigits: 4
        }).format(Number(value));

export const formatRatio = (value) =>
    value === null || value === undefined
        ? "—"
        : `${new Intl.NumberFormat("vi-VN", {
            maximumFractionDigits: 2
        }).format(Number(value))} %`;
