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
    "GIÁ VỐN TRUNG BÌNH",
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
    @page { size: A4 landscape; margin: 12mm; }
    * { box-sizing: border-box; }

    body {
        margin: 0;
        padding: 24px;
        background: #ffffff;
        color: #000000;
        font-family: "Times New Roman", Times, serif, Arial, sans-serif;
        font-size: 12px;
        line-height: 1.4;
    }

    .header {
        margin-bottom: 18px;
    }

    .company-info {
        font-size: 13px;
        line-height: 1.4;
    }

    .company-name {
        font-weight: bold;
        text-transform: uppercase;
        font-size: 14px;
    }

    .company-address {
        font-size: 13px;
    }

    .title-section {
        text-align: center;
        margin-top: 15px;
        margin-bottom: 22px;
    }

    .title-section h1 {
        margin: 0 0 6px 0;
        font-size: 22px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .date-line {
        font-style: italic;
        font-size: 13px;
    }

    .section-title {
        font-size: 14px;
        font-weight: bold;
        margin-top: 20px;
        margin-bottom: 6px;
        text-transform: uppercase;
    }

    table {
        width: 100%;
        margin-top: 6px;
        margin-bottom: 20px;
        border-collapse: collapse;
        table-layout: auto;
    }

    th, td {
        padding: 6px 8px;
        border: 1px solid #000000;
        vertical-align: middle;
        word-break: break-word;
        font-size: 12px;
    }

    thead th {
        font-weight: bold;
        text-align: center;
        background-color: #ffffff;
    }

    th.center, td.center { text-align: center; }
    th.num, td.num, td.right { text-align: right; }
    td.left { text-align: left; }

    tfoot td {
        font-weight: bold;
    }

    .font-bold { font-weight: bold; }

    tbody tr.lot td {
        font-style: italic;
        color: #444444;
    }

    .signatures-wrapper {
        margin-top: 30px;
        page-break-inside: avoid;
    }

    .location-date {
        text-align: right;
        font-style: italic;
        font-size: 13px;
        margin-bottom: 12px;
        padding-right: 20px;
    }

    .signatures {
        display: flex;
        justify-content: space-between;
        text-align: center;
    }

    .sig-col {
        flex: 1;
        padding: 0 10px;
    }

    .sig-title {
        font-weight: bold;
        font-size: 14px;
        margin-bottom: 2px;
    }

    .sig-sub {
        font-style: italic;
        font-size: 12px;
    }

    .sig-space {
        height: 70px;
    }

    .sig-name {
        font-weight: bold;
        font-size: 13px;
    }

    @media print {
        body { padding: 0; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
    }
`;

const itemRowHtml = (row) =>
    '<tr>' +
    `<td class="left font-bold">${escapeXml(row.label)}</td>` +
    `<td class="center">${escapeXml(row.unit)}</td>` +
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
    `<td class="left" style="padding-left: 20px;">${escapeXml(
        `↳ Lô ${lot.index}: ${lot.lotNumber}`
    )}</td>` +
    `<td colspan="4" class="center">${escapeXml(`HSD ${lot.expirationDate}`)}</td>` +
    `<td class="num">${escapeXml(formatNumber(lot.quantity))}</td>` +
    '<td colspan="2"></td>' +
    `<td class="center">${escapeXml(lot.status)}</td>` +
    "</tr>";

const sectionHtml = (title, columns, rows, withLots) => {
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
          `<td colspan="2" class="center font-bold">${escapeXml(
              `TỔNG CỘNG (${rows.length} dòng)`
          )}</td>` +
          `<td class="num font-bold">${escapeXml(
              formatNumber(totals.openingQuantity)
          )}</td>` +
          `<td class="num font-bold">${escapeXml(
              formatNumber(totals.receiptQuantity)
          )}</td>` +
          `<td class="num font-bold">${escapeXml(
              formatNumber(totals.issueQuantity)
          )}</td>` +
          `<td class="num font-bold">${escapeXml(
              formatNumber(totals.closingQuantity)
          )}</td>` +
          "<td></td>" +
          `<td class="num font-bold">${escapeXml(
              formatCurrency(totals.inventoryValue)
          )}</td>` +
          "<td></td></tr></tfoot>"
        : "";

    return (
        "<section>" +
        `<div class="section-title">${escapeXml(title)}</div>` +
        "<table><thead><tr>" +
        columns.map((label) => `<th class="center">${escapeXml(label)}</th>`).join("") +
        `</tr></thead><tbody>${body}</tbody>${foot}</table>` +
        "</section>"
    );
};

const formatShortDate = (dVal) => {
    if (!dVal) return "";
    const parts = String(dVal).split("T")[0].split("-");
    if (parts.length === 3) {
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }
    return formatDate(dVal);
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

    const formattedFromDate = formatShortDate(context.fromDate);
    const formattedToDate = formatShortDate(context.toDate);

    return (
        '<!doctype html><html lang="vi"><head><meta charset="utf-8">' +
        `<title>${escapeXml(`BÁO CÁO TỔNG HỢP NHẬP - XUẤT - TỒN (${formattedFromDate} - ${formattedToDate})`)}</title>` +
        `<style>${PRINT_STYLES}</style></head><body>` +
        '<div class="header">' +
        '<div class="company-info">' +
        '<div class="company-name">CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ SẢN XUẤT MINH HÀ</div>' +
        '<div class="company-address">Số 1 Ngõ 120 đường Trường Chinh, Phường Phương Mai, Quận Đống Đa, Thành phố Hà Nội, Việt Nam</div>' +
        '</div>' +
        '</div>' +
        '<div class="title-section">' +
        '<h1>BÁO CÁO TỔNG HỢP NHẬP - XUẤT - TỒN</h1>' +
        `<div class="date-line">Từ ngày: ${escapeXml(formattedFromDate)}   Đến ngày: ${escapeXml(formattedToDate)}</div>` +
        '</div>' +
        sectionHtml(
            "1. KHO NGUYÊN VẬT LIỆU",
            MATERIAL_COLUMNS,
            materialRows,
            false
        ) +
        sectionHtml(
            "2. KHO SẢN PHẨM",
            PRODUCT_COLUMNS,
            productRows,
            true
        ) +
        '<div class="signatures-wrapper">' +
        '<div class="location-date">Hà Nội, ngày ..... tháng ..... năm .....</div>' +
        '<div class="signatures">' +
        '<div class="sig-col">' +
        '<div class="sig-title">Giám đốc</div>' +
        '<div class="sig-sub">(Ký, ghi rõ họ tên)</div>' +
        '<div class="sig-space"></div>' +
        '<div class="sig-name">Nguyễn Thuỳ Linh</div>' +
        '</div>' +
        '<div class="sig-col">' +
        '<div class="sig-title">Người lập báo cáo</div>' +
        '<div class="sig-sub">(Ký, ghi rõ họ tên)</div>' +
        '<div class="sig-space"></div>' +
        '<div class="sig-name">Vũ Thị Xuân Hương</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        "</body></html>"
    );
};

export const printInventory = (context) => {
    printHtmlDocument(buildInventoryPrintHtml(context));
};

