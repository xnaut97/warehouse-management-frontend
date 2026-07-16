export const toNumber = (value) => Number(value ?? 0);

export const formatNumber = (value) =>
    new Intl.NumberFormat("vi-VN", {
        maximumFractionDigits: 2
    }).format(toNumber(value));

export const formatCurrency = (value) =>
    new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0
    }).format(toNumber(value));

export const formatMonth = (value) => {
    if (!value) return "";

    const [year, month] = String(value).split("-");

    if (!year || !month) return value;

    return `T${Number(month)}/${year}`;
};

export const getApiData = (response, fallback) =>
    response?.data?.data ?? fallback;
