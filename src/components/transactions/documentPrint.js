import { escapeXml } from "../../utils/excel.js";
import { printHtmlDocument } from "../../utils/print.js";

import {
    formatCurrency,
    formatDate,
    formatNumber,
    toNumber
} from "../reports/reportUtils.js";

export const documentKindOf = (goodsType, transactionType) =>
    `${goodsType}_${transactionType}`;

const HEADINGS = {
    MATERIAL_RECEIPT: "PHIẾU NHẬP KHO",
    MATERIAL_ISSUE: "PHIẾU XUẤT KHO",
    PRODUCT_RECEIPT: "PHIẾU NHẬP KHO",
    PRODUCT_ISSUE: "PHIẾU XUẤT KHO"
};

const GOODS_LABELS = {
    MATERIAL_RECEIPT: "Nguyên vật liệu",
    MATERIAL_ISSUE: "Nguyên vật liệu",
    PRODUCT_RECEIPT: "Thành phẩm",
    PRODUCT_ISSUE: "Thành phẩm"
};

const ITEM_LABELS = {
    MATERIAL_RECEIPT: "MÃ NVL",
    MATERIAL_ISSUE: "MÃ NVL",
    PRODUCT_RECEIPT: "MÃ SẢN PHẨM",
    PRODUCT_ISSUE: "MÃ SẢN PHẨM"
};

const ITEM_NAME_LABELS = {
    MATERIAL_RECEIPT: "TÊN NGUYÊN VẬT LIỆU",
    MATERIAL_ISSUE: "TÊN NGUYÊN VẬT LIỆU",
    PRODUCT_RECEIPT: "TÊN SẢN PHẨM",
    PRODUCT_ISSUE: "TÊN SẢN PHẨM"
};

const STATUS_TEXTS = {
    DRAFT: "Nháp",
    CONFIRMED: "Đã xác nhận",
    CANCELLED: "Đã hủy"
};

const isReceipt = (kind) => kind.endsWith("_RECEIPT");

const isProduct = (kind) => kind.startsWith("PRODUCT_");

const purposeOf = (kind, doc) => {

    if (kind === "MATERIAL_RECEIPT") {
        return doc.supplier
            ? "Nhập mua nguyên vật liệu từ nhà cung cấp"
            : "Nhập kho nguyên vật liệu";
    }

    if (kind === "MATERIAL_ISSUE") {
        return doc.customer
            ? "Xuất bán nguyên vật liệu"
            : "Xuất nguyên vật liệu cho sản xuất";
    }

    if (kind === "PRODUCT_RECEIPT") {
        return doc.supplier
            ? "Nhập thành phẩm từ nhà cung cấp"
            : "Nhập thành phẩm từ sản xuất";
    }

    return doc.customer
        ? "Xuất bán thành phẩm cho khách hàng"
        : "Xuất kho thành phẩm";

};

const rowsOf = (kind, doc) =>
    (doc.items ?? []).map((item, index) => ({
        index: index + 1,
        code: (isProduct(kind) ? item.productCode : item.materialCode) || "-",
        name: (isProduct(kind) ? item.productName : item.materialName) || "-",
        unit: item.unit || "-",
        quantity: toNumber(item.quantity),
        lotNumber: item.lotNumber || "",
        expirationDate: item.expirationDate || "",
        unitPrice: item.unitPrice,
        amount: item.amount
    }));

const hasValue = (value) => value !== null && value !== undefined;

const uniformUnitOf = (rows) => {

    const units = new Set(rows.map((row) => row.unit));

    return units.size === 1 ? rows[0].unit : "";

};

const metaEntries = (kind, doc) => {

    const entries = [
        ["Số phiếu", (isReceipt(kind) ? doc.receiptNo : doc.issueNo) || "-"],
        [
            isReceipt(kind) ? "Ngày nhập" : "Ngày xuất",
            formatDate(
                isReceipt(kind) ? doc.receiptDate : doc.issueDate
            ) || "-"
        ],
        ["Kho", doc.warehouse || "-"],
        ["Loại hàng hóa", GOODS_LABELS[kind]],
        ["Mục đích", purposeOf(kind, doc)],
        ["Trạng thái", STATUS_TEXTS[doc.status] || doc.status || "-"]
    ];

    if (isReceipt(kind) && doc.supplier) {
        entries.push(["Nhà cung cấp", doc.supplier]);
    }

    if (!isReceipt(kind) && doc.customer) {
        entries.push(["Khách hàng", doc.customer]);
    }

    if (doc.createdBy) {
        entries.push(["Người lập", doc.createdBy]);
    }

    return entries;

};

const columnsOf = (kind, rows) => {

    const showLot = rows.some((row) => row.lotNumber);

    const showExpiration = rows.some((row) => row.expirationDate);

    const showPricing = rows.some(
        (row) => hasValue(row.unitPrice) || hasValue(row.amount)
    );

    const columns = [
        { key: "index", label: "STT", className: "center" },
        { key: "code", label: ITEM_LABELS[kind], className: "code" },
        { key: "name", label: ITEM_NAME_LABELS[kind], className: "name" },
        { key: "unit", label: "ĐVT", className: "center" },
        { key: "quantity", label: "SỐ LƯỢNG", className: "num" }
    ];

    if (showLot) {
        columns.push({ key: "lotNumber", label: "SỐ LÔ", className: "" });
    }

    if (showExpiration) {
        columns.push({ key: "expirationDate", label: "HSD", className: "center" });
    }

    if (showPricing) {
        columns.push({ key: "unitPrice", label: "ĐƠN GIÁ", className: "num" });
        columns.push({ key: "amount", label: "THÀNH TIỀN", className: "num" });
    }

    return columns;

};

const cellText = (row, key) => {

    if (key === "quantity") {
        return formatNumber(row.quantity);
    }

    if (key === "expirationDate") {
        return formatDate(row.expirationDate) || "-";
    }

    if (key === "unitPrice" || key === "amount") {
        return hasValue(row[key]) ? formatCurrency(row[key]) : "-";
    }

    if (key === "lotNumber") {
        return row.lotNumber || "-";
    }

    return String(row[key]);

};

const rowHtml = (row, columns) =>
    "<tr>" +
    columns
        .map(
            (column) =>
                `<td class="${column.className}">` +
                `${escapeXml(cellText(row, column.key))}</td>`
        )
        .join("") +
    "</tr>";

const footHtml = (rows, columns, doc) => {

    if (!rows.length) {
        return "";
    }

    const unit = uniformUnitOf(rows);

    const totalQuantity = rows.reduce(
        (total, row) => total + row.quantity,
        0
    );

    const quantityText = unit
        ? `${formatNumber(totalQuantity)} ${unit}`
        : "";

    const leadingSpan = columns.findIndex(
        (column) => column.key === "quantity"
    );

    const cells = columns.slice(leadingSpan).map((column) => {

        if (column.key === "quantity") {
            return `<td class="num">${escapeXml(quantityText)}</td>`;
        }

        if (column.key === "amount" && hasValue(doc.totalAmount)) {
            return `<td class="num">${escapeXml(
                formatCurrency(doc.totalAmount)
            )}</td>`;
        }

        return "<td></td>";

    });

    const label =
        `<td colspan="${leadingSpan}">` +
        `${escapeXml(`Tổng cộng (${rows.length} dòng)`)}</td>`;

    return `<tfoot><tr>${label}${cells.join("")}</tr></tfoot>`;

};

const signatureHtml = (kind, doc) => {

    const roles = isReceipt(kind)
        ? ["Người lập phiếu", "Người giao hàng", "Người nhận hàng", "Thủ kho"]
        : ["Người lập phiếu", "Người nhận hàng", "Người giao hàng", "Thủ kho"];

    return (
        '<div class="signatures">' +
        roles
            .map(
                (role) =>
                    "<div>" +
                    `<span class="role">${escapeXml(role)}</span>` +
                    '<div class="line"></div>' +
                    '<span class="name">' +
                    escapeXml(
                        role === "Người lập phiếu" && doc.createdBy
                            ? doc.createdBy
                            : ""
                    ) +
                    "</span>" +
                    "</div>"
            )
            .join("") +
        "</div>"
    );

};

const printStyles = (columnCount) => `
    * { box-sizing: border-box; }

    body {
        margin: 0;
        padding: 24px;
        background: #ffffff;
        color: #374151;
        font-family: "Segoe UI", Roboto, Arial, sans-serif;
        font-size: 12px;
    }

    h1 {
        margin: 0;
        color: #374151;
        font-size: 20px;
        text-align: center;
    }

    .subtitle {
        margin-top: 4px;
        color: #6b7280;
        font-size: 12px;
        text-align: center;
    }

    .meta {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 12px 24px;
        margin-top: 18px;
        padding: 14px 16px;
        border: 1px solid #f4d6e0;
        border-radius: 10px;
    }

    .meta dt {
        color: #6b7280;
        font-size: 11px;
    }

    .meta dd {
        margin: 2px 0 0;
        font-weight: 600;
        word-break: break-word;
    }

    table {
        width: 100%;
        margin-top: 14px;
        border-collapse: collapse;
        table-layout: fixed;
    }

    th, td {
        padding: 7px 8px;
        border: 1px solid #f4d6e0;
        text-align: left;
        vertical-align: top;
        word-break: break-word;
    }

    thead th {
        border-bottom: 1.5px solid #ec7fa9;
        font-size: 11px;
        text-transform: uppercase;
    }

    th.center, td.center { text-align: center; }
    th.num, td.num { text-align: right; }

    td.code { font-weight: 600; }

    col.index { width: 40px; }
    col.code { width: 112px; }
    col.unit { width: 56px; }
    col.quantity { width: 88px; }
    col.lotNumber { width: 136px; }
    col.expirationDate { width: 84px; }
    col.unitPrice { width: 100px; }
    col.amount { width: 110px; }

    tfoot td {
        border-top: 1.5px solid #ec7fa9;
        font-weight: 700;
    }

    .signatures {
        display: grid;
        grid-template-columns: repeat(${columnCount}, minmax(0, 1fr));
        gap: 24px;
        margin-top: 36px;
        text-align: center;
        break-inside: avoid;
    }

    .signatures .role {
        color: #374151;
        font-size: 11px;
        font-weight: 600;
    }

    .signatures .line {
        height: 56px;
        border-bottom: 1px solid #d1d5db;
    }

    .signatures .name {
        display: block;
        margin-top: 6px;
        color: #6b7280;
        font-size: 11px;
        min-height: 14px;
    }

    .printed-at {
        margin-top: 24px;
        color: #9ca3af;
        font-size: 10px;
    }

    @media print {
        body { padding: 0; }
        thead { display: table-header-group; }
        tr { break-inside: avoid; }
    }
`;

export const buildDocumentPrintHtml = (kind, doc) => {

    const rows = rowsOf(kind, doc);

    const columns = columnsOf(kind, rows);

    const orientation = columns.length > 7 ? "landscape" : "portrait";

    const documentNo =
        (isReceipt(kind) ? doc.receiptNo : doc.issueNo) || "";

    const meta = metaEntries(kind, doc)
        .map(
            ([label, value]) =>
                `<div><dt>${escapeXml(label)}</dt>` +
                `<dd>${escapeXml(value)}</dd></div>`
        )
        .join("");

    const body = rows.length
        ? rows.map((row) => rowHtml(row, columns)).join("")
        : `<tr><td class="center" colspan="${columns.length}">` +
          "Phiếu chưa có mặt hàng nào.</td></tr>";

    return (
        '<!doctype html><html lang="vi"><head><meta charset="utf-8">' +
        `<title>${escapeXml(`${HEADINGS[kind]} ${documentNo}`.trim())}</title>` +
        `<style>@page { size: A4 ${orientation}; margin: 12mm; }` +
        `${printStyles(4)}</style></head><body>` +
        `<h1>${escapeXml(HEADINGS[kind])}</h1>` +
        `<p class="subtitle">${escapeXml(
            `${GOODS_LABELS[kind]}${documentNo ? ` · ${documentNo}` : ""}`
        )}</p>` +
        `<dl class="meta">${meta}</dl>` +
        "<table>" +
        "<colgroup>" +
        columns.map((column) => `<col class="${column.key}">`).join("") +
        "</colgroup>" +
        "<thead><tr>" +
        columns
            .map(
                (column) =>
                    `<th class="${column.className}">` +
                    `${escapeXml(column.label)}</th>`
            )
            .join("") +
        `</tr></thead><tbody>${body}</tbody>` +
        footHtml(rows, columns, doc) +
        "</table>" +
        signatureHtml(kind, doc) +
        `<p class="printed-at">In ngày ${escapeXml(
            formatDate(new Date())
        )}</p>` +
        "</body></html>"
    );

};

export const printTransactionDocument = (kind, doc) => {

    printHtmlDocument(buildDocumentPrintHtml(kind, doc));

};
