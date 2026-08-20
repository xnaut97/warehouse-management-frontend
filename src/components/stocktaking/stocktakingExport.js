import { escapeXml, exportToExcel } from "../../utils/excel.js";
import { printHtmlDocument } from "../../utils/print.js";

import { formatDate, formatNumber } from "../reports/reportUtils.js";

import {
    itemStatusLabel,
    stockGroupLabel,
    stocktakingStatusLabel,
    stocktakingTypeLabel
} from "./stocktakingLabels.js";

import {
    resolveBatchView,
    resolveItemView,
    resolveItemStatus
} from "./stocktakingDraft.js";

const COLUMNS = [
    "MÃ SP",
    "TÊN VẬT TƯ",
    "NHÓM VẬT TƯ",
    "ĐVT",
    "SỐ LÔ",
    "HSD",
    "SỔ SÁCH",
    "THỰC TẾ",
    "CHÊNH LỆCH",
    "TRẠNG THÁI KIỂM KÊ",
    "LÝ DO"
];

const COLUMN_WIDTHS = [16, 34, 14, 10, 18, 14, 12, 12, 13, 20, 32];

const statusText = (status) =>
    status
        ? itemStatusLabel[status] || status
        : "Chưa kiểm kê";

const varianceText = (variance) => {

    if (variance === null || variance === undefined) {
        return "-";
    }

    return `${variance > 0 ? "+" : ""}${formatNumber(variance)}`;

};

const quantityText = (quantity) =>
    quantity === null || quantity === undefined
        ? "-"
        : formatNumber(quantity);

/*
 * Flattens the stocktaking sheet into one row per item, followed by one
 * row per lot for batch-managed items. Both the Excel sheet and the print
 * layout are built from this single list so they always agree with the
 * table on screen.
 */
export const buildStocktakingRows = (stocktaking, draft, editable) =>
    (stocktaking?.items ?? []).flatMap((item) => {

        const view = resolveItemView(item, draft, editable);

        const itemRow = {
            kind: "item",
            key: `item-${item.id}`,
            code: item.code ?? "",
            name: item.name ?? "",
            group: stockGroupLabel[item.itemGroup] || "",
            unit: item.unit ?? "",
            lotNumber: "",
            expirationDate: "",
            systemQuantity: Number(item.systemQuantity ?? 0),
            physicalQuantity: view.physicalQuantity,
            variance: view.variance,
            status: view.status,
            reason: view.reason,
            batchManaged: Boolean(item.batchManaged)
        };

        if (!item.batchManaged) {
            return [itemRow];
        }

        const lotRows = (item.batches ?? []).map((batch) => {

            const batchView = resolveBatchView(batch, draft, editable);

            return {
                kind: "lot",
                key: `batch-${batch.id}`,
                code: item.code ?? "",
                name: item.name ?? "",
                group: stockGroupLabel[item.itemGroup] || "",
                unit: item.unit ?? "",
                lotNumber: batch.lotNumber ?? "",
                expirationDate: formatDate(batch.expirationDate),
                systemQuantity: Number(batch.systemQuantity ?? 0),
                physicalQuantity: batchView.physicalQuantity,
                variance: batchView.variance,
                status:
                    batch.itemStatus ??
                    resolveItemStatus(
                        batch.systemQuantity,
                        batchView.physicalQuantity
                    ),
                reason: batchView.reason,
                batchManaged: false
            };

        });

        return [itemRow, ...lotRows];

    });

const summaryOf = (rows) => {

    const itemRows = rows.filter((row) => row.kind === "item");

    return {
        total: itemRows.length,
        counted: itemRows.filter((row) => row.physicalQuantity !== null).length,
        discrepancies: itemRows.filter(
            (row) => row.variance !== null && row.variance !== 0
        ).length
    };

};

const metaEntries = (stocktaking) => [
    ["Mã phiếu", stocktaking.stocktakingNo || "-"],
    ["Ngày kiểm kê", formatDate(stocktaking.stocktakingDate) || "-"],
    ["Kho kiểm kê", stockGroupLabel[stocktaking.warehouseGroup] || "-"],
    ["Loại kiểm kê", stocktakingTypeLabel[stocktaking.type] || "-"],
    ["Người kiểm kê", stocktaking.stocktaker || "-"],
    ["Trạng thái", stocktakingStatusLabel[stocktaking.status] || "-"]
];

/* Keeps the download name safe for every filesystem. */
const fileNameFor = (stocktaking) => {

    const slug = String(stocktaking.stocktakingNo || "phieu")
        .replace(/[^\w.-]+/g, "-")
        .replace(/^-+|-+$/g, "");

    return `Kiem-ke-${slug || "phieu"}`;

};

export const exportStocktakingToExcel = (stocktaking, draft, editable) => {

    const rows = buildStocktakingRows(stocktaking, draft, editable);
    const summary = summaryOf(rows);

    const sheetRows = [
        { cells: ["PHIẾU KIỂM KÊ KHO"], bold: true },
        [],

        ...metaEntries(stocktaking).map(([label, value]) => [label, value]),

        [
            "Số dòng kiểm kê",
            `${summary.counted}/${summary.total} dòng đã có số thực tế, ` +
            `${summary.discrepancies} dòng chênh lệch`
        ],
        [],

        { cells: COLUMNS, bold: true },

        ...rows.map((row) => [
            row.kind === "lot" ? `${row.code} · lô` : row.code,
            row.name,
            row.group,
            row.unit,
            row.lotNumber,
            row.expirationDate,
            row.systemQuantity,
            row.physicalQuantity,
            row.variance,
            statusText(row.status),
            row.reason
        ])
    ];

    exportToExcel({
        fileName: fileNameFor(stocktaking),
        sheetName: "Kiem ke",
        rows: sheetRows,
        columnWidths: COLUMN_WIDTHS
    });

};

const printRowHtml = (row) => {

    const varianceClass =
        row.variance === null || row.variance === 0
            ? "variance"
            : "variance variance-off";

    const cells = [
        `<td class="code">${escapeXml(
            row.kind === "lot" ? `↳ ${row.lotNumber || "-"}` : row.code
        )}</td>`,
        `<td>${escapeXml(row.kind === "lot" ? "" : row.name)}</td>`,
        `<td>${escapeXml(row.kind === "lot" ? row.expirationDate : row.group)}</td>`,
        `<td>${escapeXml(row.kind === "lot" ? "" : row.unit)}</td>`,
        `<td class="num">${escapeXml(formatNumber(row.systemQuantity))}</td>`,
        `<td class="num">${escapeXml(quantityText(row.physicalQuantity))}</td>`,
        `<td class="num ${varianceClass}">${escapeXml(
            varianceText(row.variance)
        )}</td>`,
        `<td class="center">${escapeXml(statusText(row.status))}</td>`,
        `<td>${escapeXml(row.reason || "-")}</td>`
    ];

    return `<tr class="${row.kind}">${cells.join("")}</tr>`;

};

const PRINT_STYLES = `
    * { box-sizing: border-box; }

    body {
        margin: 0;
        padding: 24px;
        color: #374151;
        font-family: "Segoe UI", Roboto, Arial, sans-serif;
        font-size: 12px;
    }

    h1 {
        margin: 0;
        color: #374151;
        font-size: 20px;
    }

    .subtitle {
        margin-top: 4px;
        color: #6b7280;
        font-size: 12px;
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
    }

    .summary {
        margin-top: 14px;
        color: #6b7280;
    }

    table {
        width: 100%;
        margin-top: 14px;
        border-collapse: collapse;
    }

    th, td {
        padding: 7px 8px;
        border-bottom: 1px solid #f4d6e0;
        text-align: left;
        vertical-align: top;
    }

    thead th {
        border-bottom: 1.5px solid #ec7fa9;
        font-size: 11px;
        text-transform: uppercase;
    }

    tbody tr.lot td {
        color: #6b7280;
        font-size: 11px;
    }

    tbody tr.lot td.code { padding-left: 20px; }

    tbody tr.item td.code { font-weight: 600; }

    .num { text-align: right; }
    .center { text-align: center; }
    .variance-off { font-weight: 600; }

    .signatures {
        display: grid;
        grid-template-columns: repeat(3, minmax(0, 1fr));
        gap: 24px;
        margin-top: 36px;
        text-align: center;
    }

    .signatures .line {
        height: 56px;
        border-bottom: 1px solid #d1d5db;
    }

    .signatures span {
        color: #6b7280;
        font-size: 11px;
    }

    .printed-at {
        margin-top: 24px;
        color: #9ca3af;
        font-size: 10px;
    }

    @page { size: A4 landscape; margin: 12mm; }

    @media print {
        body { padding: 0; }
        thead { display: table-header-group; }
        tr { break-inside: avoid; }
    }
`;

export const buildStocktakingPrintHtml = (stocktaking, draft, editable) => {

    const rows = buildStocktakingRows(stocktaking, draft, editable);
    const summary = summaryOf(rows);

    const meta = metaEntries(stocktaking)
        .map(
            ([label, value]) =>
                `<div><dt>${escapeXml(label)}</dt>` +
                `<dd>${escapeXml(value)}</dd></div>`
        )
        .join("");

    const body = rows.length
        ? rows.map(printRowHtml).join("")
        : '<tr><td colspan="9" class="center">Chưa có dòng kiểm kê.</td></tr>';

    const title = `Phiếu kiểm kê ${stocktaking.stocktakingNo || ""}`.trim();

    const html =
        "<!doctype html><html lang=\"vi\"><head><meta charset=\"utf-8\">" +
        `<title>${escapeXml(title)}</title>` +
        `<style>${PRINT_STYLES}</style></head><body>` +
        "<h1>PHIẾU KIỂM KÊ KHO</h1>" +
        `<p class="subtitle">${escapeXml(
            stocktaking.stocktakingNo || ""
        )}</p>` +
        `<dl class="meta">${meta}</dl>` +
        `<p class="summary">${escapeXml(
            `${summary.counted}/${summary.total} dòng đã có số thực tế · ` +
            `${summary.discrepancies} dòng chênh lệch`
        )}</p>` +
        "<table><thead><tr>" +
        [
            "MÃ SP / SỐ LÔ",
            "TÊN VẬT TƯ",
            "NHÓM / HSD",
            "ĐVT",
            "SỔ SÁCH",
            "THỰC TẾ",
            "CHÊNH LỆCH",
            "TRẠNG THÁI",
            "LÝ DO"
        ]
            .map((label) => `<th>${escapeXml(label)}</th>`)
            .join("") +
        `</tr></thead><tbody>${body}</tbody></table>` +
        '<div class="signatures">' +
        "<div><div class=\"line\"></div><span>Người kiểm kê</span></div>" +
        "<div><div class=\"line\"></div><span>Thủ kho</span></div>" +
        "<div><div class=\"line\"></div><span>Phụ trách kho</span></div>" +
        "</div>" +
        `<p class="printed-at">In ngày ${escapeXml(
            formatDate(new Date())
        )}</p>` +
        "</body></html>";

    return html;

};

export const printStocktaking = (stocktaking, draft, editable) => {

    printHtmlDocument(
        buildStocktakingPrintHtml(stocktaking, draft, editable)
    );

};
