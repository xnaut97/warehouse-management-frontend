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

export const formatDate = (value) => {
    if (!value) return "";

    return new Intl.DateTimeFormat("vi-VN").format(new Date(value));
};

const toDateInputValue = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
};

export const today = () => toDateInputValue(new Date());

export const firstDayOfMonth = () => {
    const date = new Date();

    return toDateInputValue(new Date(date.getFullYear(), date.getMonth(), 1));
};

export const unwrap = (response, fallback) =>
    response?.data?.data ?? fallback;

export const pageContent = (response) => {
    const data = unwrap(response, []);

    return Array.isArray(data)
        ? data
        : data.content ?? [];
};

export const sumBy = (items, key) =>
    items.reduce((sum, item) => sum + toNumber(item[key]), 0);
