import { escapeXml, exportToExcel } from "../../utils/excel.js";
import { printHtmlDocument } from "../../utils/print.js";

import {
    formatCurrency,
    formatDate,
    formatNumber,
    sumBy,
    toNumber
} from "../reports/reportUtils.js";

const MATERIAL_COLUMNS = [
    "NVL",
    "ĐVT",
    "TỒN ĐẦU",
    "SL NHẬP",
    "SL XUẤT",
    "TỒN CUỐI",
    "GIÁ NHẬP TRUNG BÌNH",
    "TỔNG VỐN TỒN",
    "TRẠNG THÁI"
];

const PRODUCT_COLUMNS = [
    "SẢN PHẨM",
    "ĐVT",
    "TỒN ĐẦU",
    "SL NHẬP",
    "SL XUẤT",
    "TỒN CUỐI",
    "GIÁ XUẤT TRUNG BÌNH",
    "TỔNG VỐN TỒN",
    "TRẠNG THÁI"
];

const LOT_COLUMNS = [
    "SẢN PHẨM",
    "STT",
    "SỐ LÔ",
    "HSD",
    "TỒN LÔ",
    "TRẠNG THÁI"
];

const ITEM_COLUMN_WIDTHS = [38, 10, 12, 12, 12, 12, 20, 18, 16];

const LOT_COLUMN_WIDTHS = [38, 6, 20, 14, 12, 14];

const thresholdStatusText = (status) =>
    ({
        NORMAL: "Bình thường",
        BELOW_MIN: "Cảnh báo min",
        ABOVE_MAX: "Cảnh báo max"
    })[status] || status || "-";

const expiryStatusText = (status) =>
    ({
        FEFO: "FEFO",
        SAFE: "An toàn"
    })[status] || status || "-";

const itemLabel = (item) =>
    item.code
        ? `${item.name ?? ""} (${item.code})`.trim()
        : item.name ?? "";

const buildItemRows = (items, statusOf) =>
    items.map((item) => ({
        label: itemLabel(item),
        unit: item.unit || "-",
        openingQuantity: toNumber(item.openingQuantity),
        receiptQuantity: toNumber(item.receiptQuantity),
        issueQuantity: toNumber(item.issueQuantity),
        closingQuantity: toNumber(item.closingQuantity),
        averagePrice: toNumber(item.averagePrice),
        inventoryValue: toNumber(item.inventoryValue),
        status: statusOf(item),
        lots: (item.lots ?? []).map((lot, index) => ({
            index: index + 1,
            lotNumber: lot.lotNumber || "-",
            expirationDate: formatDate(lot.expirationDate) || "-",
            quantity: toNumber(lot.quantity),
            status: expiryStatusText(lot.status)
        }))
    }));

const materialStatusOf = (item) => thresholdStatusText(item.thresholdStatus);

const productStatusOf = (item) => expiryStatusText(item.expiryStatus);

const totalsOf = (rows) => ({
    openingQuantity: sumBy(rows, "openingQuantity"),
    receiptQuantity: sumBy(rows, "receiptQuantity"),
    issueQuantity: sumBy(rows, "issueQuantity"),
    closingQuantity: sumBy(rows, "closingQuantity"),
    inventoryValue: sumBy(rows, "inventoryValue")
});

const periodText = (context) =>
    `${formatDate(context.fromDate) || "-"} - ` +
    `${formatDate(context.toDate) || "-"}`;

const metaEntries = (context) => {

    const entries = [
        ["Kỳ báo cáo", periodText(context)],
        ["Kho nguyên vật liệu", context.materialWarehouseName || "-"],
        ["Kho sản phẩm", context.productWarehouseName || "-"]
    ];

    if (context.search?.trim()) {
        entries.push(["Từ khoá tìm kiếm", context.search.trim()]);
    }

    return entries;

};

const fileNameFor = (context) => {

    const slug = (value) => String(value || "").replace(/[^\w-]+/g, "-");

    return `Ton-kho-${slug(context.fromDate)}-den-${slug(context.toDate)}`
        .replace(/-+$/g, "");

};

const sectionSheetRows = (title, columns, rows, context) => {

    const totals = totalsOf(rows);

    return [
        { cells: [title], bold: true },
        [],

        ...metaEntries(context).map(([label, value]) => [label, value]),
        [],

        { cells: columns, bold: true },

        ...rows.map((row) => [
            row.label,
            row.unit,
            row.openingQuantity,
            row.receiptQuantity,
            row.issueQuantity,
            row.closingQuantity,
            row.averagePrice,
            row.inventoryValue,
            row.status
        ]),

        rows.length
            ? {
                cells: [
                    `TỔNG CỘNG (${rows.length} dòng)`,
                    "",
                    totals.openingQuantity,
                    totals.receiptQuantity,
                    totals.issueQuantity,
                    totals.closingQuantity,
                    "",
                    totals.inventoryValue,
                    ""
                ],
                bold: true
            }
            : ["Không có dữ liệu tồn kho trong kỳ đã chọn."]
    ];

};

const lotSheetRows = (productRows, context) => {

    const rows = productRows.flatMap((product) =>
        product.lots.map((lot) => [
            product.label,
            lot.index,
            lot.lotNumber,
            lot.expirationDate,
            lot.quantity,
            lot.status
        ])
    );

    if (!rows.length) {
        return null;
    }

    return [
        { cells: ["CHI TIẾT LÔ SẢN PHẨM CÒN TỒN"], bold: true },
        [],

        ...metaEntries(context).map(([label, value]) => [label, value]),
        [],

        { cells: LOT_COLUMNS, bold: true },

        ...rows
    ];

};

export const exportInventoryToExcel = (context) => {

    const materialRows = buildItemRows(
        context.materials ?? [],
        materialStatusOf
    );

    const productRows = buildItemRows(
        context.products ?? [],
        productStatusOf
    );

    const lotRows = lotSheetRows(productRows, context);

    const sheets = [
        {
            name: "Kho NVL",
            rows: sectionSheetRows(
                "KHO NVL",
                MATERIAL_COLUMNS,
                materialRows,
                context
            ),
            columnWidths: ITEM_COLUMN_WIDTHS
        },
        {
            name: "Kho San pham",
            rows: sectionSheetRows(
                "KHO SẢN PHẨM",
                PRODUCT_COLUMNS,
                productRows,
                context
            ),
            columnWidths: ITEM_COLUMN_WIDTHS
        }
    ];

    if (lotRows) {

        sheets.push({
            name: "Lo san pham",
            rows: lotRows,
            columnWidths: LOT_COLUMN_WIDTHS
        });

    }

    exportToExcel({
        fileName: fileNameFor(context),
        sheets
    });

};

const PRINT_STYLES = `
    * { box-sizing: border-box; }

    body {
        margin: 0;
        padding: 24px;
        background: #ffffff;
        color: #374151;
        font-family: "Segoe UI", Roboto, Arial, sans-serif;
        font-size: 11px;
    }

    h1 {
        margin: 0;
        color: #374151;
        font-size: 20px;
    }

    h2 {
        margin: 0;
        color: #374151;
        font-size: 15px;
    }

    .subtitle {
        margin-top: 4px;
        color: #6b7280;
        font-size: 11px;
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
        font-size: 10px;
    }

    .meta dd {
        margin: 2px 0 0;
        font-weight: 600;
    }

    section { margin-top: 22px; }

    section + section { break-before: page; }

    table {
        width: 100%;
        margin-top: 10px;
        border-collapse: collapse;
    }

    th, td {
        padding: 6px 8px;
        border-bottom: 1px solid #f4d6e0;
        text-align: left;
        vertical-align: top;
    }

    thead th {
        border-bottom: 1.5px solid #ec7fa9;
        font-size: 10px;
        text-transform: uppercase;
    }

    tbody tr.item td.label { font-weight: 600; }

    tbody tr.lot td {
        color: #6b7280;
        font-size: 10px;
    }

    tbody tr.lot td.label { padding-left: 24px; }

    tfoot td {
        border-top: 1.5px solid #ec7fa9;
        font-weight: 700;
    }

    .num { text-align: right; }
    .center { text-align: center; }

    .printed-at {
        margin-top: 24px;
        color: #9ca3af;
        font-size: 10px;
    }

    @page { size: A4 landscape; margin: 10mm; }

    @media print {
        body { padding: 0; }
        thead { display: table-header-group; }
        tr { break-inside: avoid; }
    }
`;

const itemRowHtml = (row) =>
    '<tr class="item">' +
    `<td class="label">${escapeXml(row.label)}</td>` +
    `<td>${escapeXml(row.unit)}</td>` +
    `<td class="num">${escapeXml(formatNumber(row.openingQuantity))}</td>` +
    `<td class="num">${escapeXml(formatNumber(row.receiptQuantity))}</td>` +
    `<td class="num">${escapeXml(formatNumber(row.issueQuantity))}</td>` +
    `<td class="num">${escapeXml(formatNumber(row.closingQuantity))}</td>` +
    `<td class="num">${escapeXml(formatCurrency(row.averagePrice))}</td>` +
    `<td class="num">${escapeXml(formatCurrency(row.inventoryValue))}</td>` +
    `<td class="center">${escapeXml(row.status)}</td>` +
    "</tr>";

const lotRowHtml = (lot) =>
    '<tr class="lot">' +
    `<td class="label">${escapeXml(
        `↳ Lô ${lot.index}: ${lot.lotNumber}`
    )}</td>` +
    `<td colspan="4">${escapeXml(`HSD ${lot.expirationDate}`)}</td>` +
    `<td class="num">${escapeXml(formatNumber(lot.quantity))}</td>` +
    '<td colspan="2"></td>' +
    `<td class="center">${escapeXml(lot.status)}</td>` +
    "</tr>";

const sectionHtml = (title, description, columns, rows, withLots) => {

    const totals = totalsOf(rows);

    const body = rows.length
        ? rows
            .map(
                (row) =>
                    itemRowHtml(row) +
                    (withLots ? row.lots.map(lotRowHtml).join("") : "")
            )
            .join("")
        : `<tr><td class="center" colspan="${columns.length}">` +
          "Không có dữ liệu tồn kho trong kỳ đã chọn.</td></tr>";

    const foot = rows.length
        ? "<tfoot><tr>" +
          `<td colspan="2">${escapeXml(
              `TỔNG CỘNG (${rows.length} dòng)`
          )}</td>` +
          `<td class="num">${escapeXml(
              formatNumber(totals.openingQuantity)
          )}</td>` +
          `<td class="num">${escapeXml(
              formatNumber(totals.receiptQuantity)
          )}</td>` +
          `<td class="num">${escapeXml(
              formatNumber(totals.issueQuantity)
          )}</td>` +
          `<td class="num">${escapeXml(
              formatNumber(totals.closingQuantity)
          )}</td>` +
          "<td></td>" +
          `<td class="num">${escapeXml(
              formatCurrency(totals.inventoryValue)
          )}</td>` +
          "<td></td></tr></tfoot>"
        : "";

    return (
        "<section>" +
        `<h2>${escapeXml(title)}</h2>` +
        `<p class="subtitle">${escapeXml(description)}</p>` +
        "<table><thead><tr>" +
        columns.map((label) => `<th>${escapeXml(label)}</th>`).join("") +
        `</tr></thead><tbody>${body}</tbody>${foot}</table>` +
        "</section>"
    );

};

export const buildInventoryPrintHtml = (context) => {

    const materialRows = buildItemRows(
        context.materials ?? [],
        materialStatusOf
    );

    const productRows = buildItemRows(
        context.products ?? [],
        productStatusOf
    );

    const meta = metaEntries(context)
        .map(
            ([label, value]) =>
                `<div><dt>${escapeXml(label)}</dt>` +
                `<dd>${escapeXml(value)}</dd></div>`
        )
        .join("");

    const period = periodText(context);

    return (
        '<!doctype html><html lang="vi"><head><meta charset="utf-8">' +
        `<title>${escapeXml(`Bao cao ton kho ${period}`)}</title>` +
        `<style>${PRINT_STYLES}</style></head><body>` +
        "<h1>BÁO CÁO TỒN KHO</h1>" +
        `<p class="subtitle">${escapeXml(`Kỳ ${period}`)}</p>` +
        `<dl class="meta">${meta}</dl>` +
        sectionHtml(
            "KHO NVL",
            "Tồn kho nguyên vật liệu trong kỳ.",
            MATERIAL_COLUMNS,
            materialRows,
            false
        ) +
        sectionHtml(
            "KHO SẢN PHẨM",
            "Tồn kho thành phẩm trong kỳ, kèm các lô còn tồn theo thứ tự hạn dùng.",
            PRODUCT_COLUMNS,
            productRows,
            true
        ) +
        `<p class="printed-at">In ngày ${escapeXml(
            formatDate(new Date())
        )}</p>` +
        "</body></html>"
    );

};

export const printInventory = (context) => {

    printHtmlDocument(buildInventoryPrintHtml(context));

};
