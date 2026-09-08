import { escapeXml } from "../../utils/excel.js";
import { printHtmlDocument } from "../../utils/print.js";

import {
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
            ? "Xuất điều chuyển thành phẩm để bán hàng"
            : "Xuất nguyên vật liệu cho sản xuất";
    }

    if (kind === "PRODUCT_RECEIPT") {
        return doc.supplier
            ? "Nhập thành phẩm từ nhà cung cấp"
            : "Nhập thành phẩm từ sản xuất";
    }

    return doc.customer
        ? "Xuất điều chuyển thành phẩm để bán hàng"
        : "Xuất kho thành phẩm";
};

const formatVietnameseFullDate = (dateVal) => {
    if (!dateVal) return "Ngày ... tháng ... năm ...";

    const d = new Date(dateVal);
    if (isNaN(d.getTime())) return "Ngày ... tháng ... năm ...";

    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();

    return `Ngày ${day} tháng ${month} năm ${year}`;
};

const rowsOf = (kind, doc) =>
    (doc.items ?? []).map((item, index) => ({
        index: index + 1,
        code: (isProduct(kind) ? item.productCode : item.materialCode) || item.code || "-",
        name: (isProduct(kind) ? item.productName : item.materialName) || item.name || "-",
        unit: item.unit || "-",
        quantity: toNumber(item.quantity),
        lotNumber: item.lotNumber || "",
        hsd: item.hsd || (item.expirationDate ? formatDate(item.expirationDate) : "") || (item.manufactureDate ? formatDate(item.manufactureDate) : "") || ""
    }));

const printStyles = () => `
    * { box-sizing: border-box; }

    body {
        margin: 0;
        padding: 24px;
        background: #ffffff;
        color: #000000;
        font-family: "Times New Roman", Times, serif, Arial, sans-serif;
        font-size: 13px;
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

    .title-section {
        text-align: center;
        margin-bottom: 20px;
    }

    .title-section h1 {
        margin: 0 0 4px 0;
        font-size: 22px;
        font-weight: bold;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .date-line {
        font-style: italic;
        font-size: 13px;
        margin-bottom: 2px;
    }

    .doc-no {
        font-style: italic;
        font-size: 13px;
    }

    .meta-section {
        margin-bottom: 14px;
        font-size: 13px;
        line-height: 1.7;
    }

    .meta-line {
        margin-bottom: 2px;
    }

    .meta-line strong {
        font-weight: bold;
    }

    table {
        width: 100%;
        margin-top: 12px;
        margin-bottom: 8px;
        border-collapse: collapse;
        table-layout: fixed;
    }

    th, td {
        padding: 6px 8px;
        border: 1px solid #000000;
        vertical-align: middle;
        word-break: break-word;
        font-size: 13px;
    }

    thead th {
        font-weight: bold;
        text-align: center;
    }

    th.center, td.center { text-align: center; }
    th.num, td.num, td.right { text-align: right; }
    td.left { text-align: left; }

    tfoot td {
        font-weight: bold;
    }

    .attached-vouchers {
        margin-top: 8px;
        margin-bottom: 24px;
        font-size: 13px;
    }

    .signatures {
        display: flex;
        justify-content: space-between;
        margin-top: 28px;
        text-align: center;
        page-break-inside: avoid;
    }

    .sig-col {
        flex: 1;
        padding: 0 4px;
    }

    .sig-title {
        font-weight: bold;
        font-size: 13px;
    }

    .sig-sub {
        font-style: italic;
        font-size: 12px;
    }

    .sig-space {
        height: 64px;
    }

    .sig-name {
        font-weight: bold;
        font-size: 12px;
        min-height: 16px;
    }

    @media print {
        body { padding: 0; }
        thead { display: table-header-group; }
        tr { page-break-inside: avoid; }
    }
`;

export const buildDocumentPrintHtml = (kind, doc) => {
    const rows = rowsOf(kind, doc);
    const documentNo = (isReceipt(kind) ? doc.receiptNo : doc.issueNo) || "";
    const rawDate = (isReceipt(kind) ? doc.receiptDate : doc.issueDate) || new Date();
    const formattedFullDate = formatVietnameseFullDate(rawDate);

    const recipientName = doc.customer || doc.recipientName || doc.receiverName || doc.receiver || doc.supplier || doc.createdBy || "";
    const address = doc.customerAddress || doc.department || doc.address || doc.location || doc.supplierAddress || "";
    const reason = doc.reason || doc.note || doc.purpose || purposeOf(kind, doc);
    const warehouse = doc.warehouse || doc.warehouseName || "";

    const totalQuantity = rows.reduce((total, row) => total + row.quantity, 0);

    const companyName = doc.companyName || "CÔNG TY CỔ PHẦN TM&DV TUẤN DUY";
    const companyAddress = doc.companyAddress || "TDP Thượng Tùng - Tân An - Bắc Giang";
    const companyPhone = doc.companyPhone || "0964 234 686";

    const bodyHtml = rows.length
        ? rows.map(
            (row) =>
                "<tr>" +
                `<td class="center">${row.index}</td>` +
                `<td class="left">${escapeXml(row.name)}</td>` +
                `<td class="center">${escapeXml(row.unit)}</td>` +
                `<td class="num">${escapeXml(formatNumber(row.quantity))}</td>` +
                `<td class="center">${escapeXml(row.lotNumber || "-")}</td>` +
                `<td class="center">${escapeXml(row.hsd || "-")}</td>` +
                "</tr>"
        ).join("")
        : `<tr><td class="center" colspan="6">Phiếu chưa có mặt hàng nào.</td></tr>`;

    const footHtml = `<tfoot>` +
        `<tr>` +
        `<td colspan="3" class="center font-bold">Tổng số lượng</td>` +
        `<td class="num font-bold">${escapeXml(formatNumber(totalQuantity))}</td>` +
        `<td colspan="2"></td>` +
        `</tr>` +
        `</tfoot>`;

    const originalVouchers = doc.originalVouchers || doc.attachedVouchers || doc.originalVouchersText || "01 Lệnh điều chuyển.";

    return (
        '<!doctype html><html lang="vi"><head><meta charset="utf-8">' +
        `<title>${escapeXml(`${HEADINGS[kind] || "PHIẾU XUẤT KHO"} ${documentNo}`.trim())}</title>` +
        `<style>@page { size: A4 portrait; margin: 12mm; }` +
        `${printStyles()}</style></head><body>` +
        '<div class="header">' +
        '<div class="company-info">' +
        `<div class="company-name">${escapeXml(companyName)}</div>` +
        `<div>Địa chỉ: ${escapeXml(companyAddress)}</div>` +
        `<div>Điện thoại liên hệ: ${escapeXml(companyPhone)}</div>` +
        '</div>' +
        '</div>' +
        '<div class="title-section">' +
        `<h1>${escapeXml(HEADINGS[kind] || "PHIẾU XUẤT KHO")}</h1>` +
        `<div class="date-line">${escapeXml(formattedFullDate)}</div>` +
        `<div class="doc-no">Số: ${escapeXml(documentNo)}</div>` +
        '</div>' +
        '<div class="meta-section">' +
        `<div class="meta-line">- Họ tên người ${isReceipt(kind) ? "giao" : "nhận"} hàng: <strong>${escapeXml(recipientName)}</strong></div>` +
        `<div class="meta-line">- Địa chỉ (bộ phận): <strong>${escapeXml(address)}</strong></div>` +
        `<div class="meta-line">- Lý do ${isReceipt(kind) ? "nhập" : "xuất"} kho: <strong>${escapeXml(reason)}</strong></div>` +
        `<div class="meta-line">- ${isReceipt(kind) ? "Nhập" : "Xuất"} tại kho: <strong>${escapeXml(warehouse)}</strong></div>` +
        '</div>' +
        '<table>' +
        '<colgroup>' +
        '<col style="width: 45px;">' +
        '<col style="width: auto;">' +
        '<col style="width: 65px;">' +
        '<col style="width: 85px;">' +
        '<col style="width: 100px;">' +
        '<col style="width: 100px;">' +
        '</colgroup>' +
        '<thead><tr>' +
        '<th class="center">STT</th>' +
        '<th class="center">Tên, nhãn hiệu, quy cách vật tư, sản phẩm</th>' +
        '<th class="center">ĐVT</th>' +
        '<th class="center">Số lượng</th>' +
        '<th class="center">Lô</th>' +
        '<th class="center">HSD</th>' +
        '</tr></thead>' +
        `<tbody>${bodyHtml}</tbody>` +
        footHtml +
        '</table>' +
        '<div class="attached-vouchers">' +
        `- Số chứng từ gốc kèm theo: ${escapeXml(originalVouchers)}` +
        '</div>' +
        '<div class="signatures">' +
        '<div class="sig-col">' +
        '<div class="sig-title">Người lập phiếu</div>' +
        '<div class="sig-sub">(Ký, họ tên)</div>' +
        '<div class="sig-space"></div>' +
        `<div class="sig-name">${escapeXml(doc.createdBy || "")}</div>` +
        '</div>' +
        '<div class="sig-col">' +
        `<div class="sig-title">Người ${isReceipt(kind) ? "giao" : "nhận"} hàng</div>` +
        '<div class="sig-sub">(Ký, họ tên)</div>' +
        '<div class="sig-space"></div>' +
        `<div class="sig-name">${escapeXml(recipientName)}</div>` +
        '</div>' +
        '<div class="sig-col">' +
        '<div class="sig-title">Thủ kho</div>' +
        '<div class="sig-sub">(Ký, họ tên)</div>' +
        '<div class="sig-space"></div>' +
        '<div class="sig-name"></div>' +
        '</div>' +
        '<div class="sig-col">' +
        '<div class="sig-title">Kế toán trưởng</div>' +
        '<div class="sig-sub">(Hoặc bộ phận có nhu cầu)</div>' +
        '<div class="sig-sub">(Ký, họ tên)</div>' +
        '<div class="sig-space"></div>' +
        '<div class="sig-name"></div>' +
        '</div>' +
        '</div>' +
        '</body></html>'
    );
};

export const printTransactionDocument = (kind, doc) => {
    printHtmlDocument(buildDocumentPrintHtml(kind, doc));
};

export const buildTransactionSummaryPrintHtml = ({
    transactionType,
    fromDate,
    toDate,
    records = []
}) => {
    const isReceipt = transactionType === "RECEIPT";
    const documentTitle = isReceipt
        ? "BẢNG KÊ CHỨNG TỪ PHIẾU NHẬP"
        : "BẢNG KÊ CHỨNG TỪ PHIẾU XUẤT";

    const formatShortDate = (dStr) => {
        if (!dStr) return "";
        const parts = String(dStr).split("T")[0].split("-");
        if (parts.length === 3) {
            return `${parts[2]}/${parts[1]}/${parts[0]}`;
        }
        return dStr;
    };

    const formattedFromDate = formatShortDate(fromDate);
    const formattedToDate = formatShortDate(toDate);

    let totalAmountSum = 0;

    const tableRowsHtml = records.length
        ? records.map((item) => {
            const docNo = (isReceipt ? item.receiptNo : item.issueNo) || "-";
            const warehouse = item.warehouse || "—";
            const dateVal = formatShortDate((isReceipt ? item.receiptDate : item.issueDate) || item.createdAt);
            const party = (isReceipt ? item.supplier : item.customer) || "—";
            const amount = item.totalAmount !== null && item.totalAmount !== undefined ? Number(item.totalAmount) : null;
            if (amount !== null && !isNaN(amount)) {
                totalAmountSum += amount;
            }

            if (isReceipt) {
                return (
                    "<tr>" +
                    `<td class="center">${escapeXml(docNo)}</td>` +
                    `<td class="left">${escapeXml(warehouse)}</td>` +
                    `<td class="center">${escapeXml(dateVal)}</td>` +
                    `<td class="left">${escapeXml(party)}</td>` +
                    `<td class="right">${amount !== null ? escapeXml(amount.toLocaleString("vi-VN") + " ₫") : "—"}</td>` +
                    "</tr>"
                );
            } else {
                return (
                    "<tr>" +
                    `<td class="center">${escapeXml(docNo)}</td>` +
                    `<td class="left">${escapeXml(warehouse)}</td>` +
                    `<td class="center">${escapeXml(dateVal)}</td>` +
                    `<td class="left">${escapeXml(party)}</td>` +
                    "</tr>"
                );
            }
        }).join("")
        : `<tr><td colSpan="${isReceipt ? 5 : 4}" class="center">Không có dữ liệu phiếu nào trong khoảng thời gian này.</td></tr>`;

    const tableHeaderHtml = isReceipt ? (
        "<thead><tr>" +
        '<th class="center">MÃ PHIẾU</th>' +
        '<th class="center">KHO</th>' +
        '<th class="center">NGÀY NHẬP</th>' +
        '<th class="center">NHÀ CUNG CẤP</th>' +
        '<th class="center">TỔNG TIỀN</th>' +
        "</tr></thead>"
    ) : (
        "<thead><tr>" +
        '<th class="center">MÃ PHIẾU</th>' +
        '<th class="center">KHO</th>' +
        '<th class="center">NGÀY XUẤT</th>' +
        '<th class="center">KHÁCH HÀNG</th>' +
        "</tr></thead>"
    );

    const tableFootHtml = isReceipt ? (
        "<tfoot><tr>" +
        '<td colSpan="4" class="center font-bold">Tổng cộng</td>' +
        `<td class="right font-bold">${escapeXml(totalAmountSum.toLocaleString("vi-VN") + " ₫")}</td>` +
        "</tr></tfoot>"
    ) : (
        "<tfoot><tr>" +
        '<td colSpan="3" class="center font-bold">Tổng cộng</td>' +
        `<td class="center font-bold">${records.length} phiếu</td>` +
        "</tr></tfoot>"
    );

    return (
        '<!doctype html><html lang="vi"><head><meta charset="utf-8">' +
        `<title>${escapeXml(documentTitle)}</title>` +
        `<style>
            @page { size: A4 portrait; margin: 12mm; }
            * { box-sizing: border-box; }
            body {
                margin: 0;
                padding: 24px;
                background: #ffffff;
                color: #000000;
                font-family: "Times New Roman", Times, serif, Arial, sans-serif;
                font-size: 13px;
                line-height: 1.4;
            }
            .header { margin-bottom: 20px; }
            .company-info { font-size: 13px; line-height: 1.4; }
            .company-name { font-weight: bold; text-transform: uppercase; font-size: 14px; }
            .company-address { font-size: 13px; }
            .title-section { text-align: center; margin-top: 15px; margin-bottom: 24px; }
            .title-section h1 { margin: 0 0 6px 0; font-size: 22px; font-weight: bold; text-transform: uppercase; letter-spacing: 0.5px; }
            .date-line { font-style: italic; font-size: 13px; }
            table { width: 100%; margin-top: 16px; margin-bottom: 24px; border-collapse: collapse; table-layout: fixed; }
            th, td { padding: 8px 10px; border: 1px solid #000000; vertical-align: middle; word-break: break-word; font-size: 13px; }
            thead th { font-weight: bold; text-align: center; }
            th.center, td.center { text-align: center; }
            th.right, td.right { text-align: right; }
            th.left, td.left { text-align: left; }
            tfoot td { font-weight: bold; }
            .font-bold { font-weight: bold; }
            .signatures-wrapper { margin-top: 30px; page-break-inside: avoid; }
            .location-date { text-align: right; font-style: italic; font-size: 13px; margin-bottom: 12px; padding-right: 24px; }
            .signatures { display: flex; justify-content: space-between; text-align: center; }
            .sig-col { flex: 1; padding: 0 10px; }
            .sig-title { font-weight: bold; font-size: 14px; margin-bottom: 2px; }
            .sig-sub { font-style: italic; font-size: 12px; }
            .sig-space { height: 75px; }
            .sig-name { font-weight: bold; font-size: 13px; }
            @media print {
                body { padding: 0; }
                thead { display: table-header-group; }
                tr { page-break-inside: avoid; }
            }
        </style></head><body>` +
        '<div class="header">' +
        '<div class="company-info">' +
        '<div class="company-name">CÔNG TY CỔ PHẦN CÔNG NGHỆ VÀ SẢN XUẤT MINH HÀ</div>' +
        '<div class="company-address">Số 1 Ngõ 120 đường Trường Chinh, Phường Phương Mai, Quận Đống Đa, Thành phố Hà Nội, Việt Nam</div>' +
        '</div>' +
        '</div>' +
        '<div class="title-section">' +
        `<h1>${escapeXml(documentTitle)}</h1>` +
        `<div class="date-line">Từ ngày: ${escapeXml(formattedFromDate)}   Đến ngày: ${escapeXml(formattedToDate)}</div>` +
        '</div>' +
        '<table>' +
        tableHeaderHtml +
        `<tbody>${tableRowsHtml}</tbody>` +
        tableFootHtml +
        '</table>' +
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
        '</body></html>'
    );
};

export const printTransactionSummary = (params) => {
    printHtmlDocument(buildTransactionSummaryPrintHtml(params));
};


