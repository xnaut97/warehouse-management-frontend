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

export const formatPercent = (value, fractionDigits = 2) => {
    if (value === null || value === undefined || value === "") {
        return "--";
    }

    return `${new Intl.NumberFormat("vi-VN", {
        minimumFractionDigits: fractionDigits,
        maximumFractionDigits: fractionDigits
    }).format(toNumber(value))}%`;
};

export const formatMonth = (value) => {
    if (!value) return "";

    const [year, month] = String(value).split("-");

    if (!year || !month) return value;

    return `T${Number(month)}/${year}`;
};

export const formatCompactCurrency = (value) => {
    const amount = toNumber(value);
    const sign = amount < 0 ? "-" : "";
    const absolute = Math.abs(amount);

    if (absolute >= 1_000_000_000) {
        return `${sign}${formatNumber(absolute / 1_000_000_000)} tỷ`;
    }

    if (absolute >= 1_000_000) {
        return `${sign}${formatNumber(absolute / 1_000_000)} tr`;
    }

    if (absolute >= 1_000) {
        return `${sign}${formatNumber(absolute / 1_000)} ng`;
    }

    return `${sign}${formatNumber(absolute)}`;
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

export const firstDayOfMonthsAgo = (months) => {
    const date = new Date();

    return toDateInputValue(
        new Date(date.getFullYear(), date.getMonth() - months, 1)
    );
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
