/*
 * Minimal, dependency-free XLSX writer.
 *
 * Builds an Office Open XML workbook (a ZIP archive of XML parts) in the
 * browser and triggers a download. Entries are stored uncompressed, which
 * keeps the writer small and is fine for the report-sized sheets we export.
 */

const CRC_TABLE = (() => {
    const table = new Uint32Array(256);

    for (let i = 0; i < 256; i += 1) {
        let value = i;

        for (let bit = 0; bit < 8; bit += 1) {
            value = value & 1 ? 0xedb88320 ^ (value >>> 1) : value >>> 1;
        }

        table[i] = value >>> 0;
    }

    return table;
})();

const crc32 = (bytes) => {
    let crc = 0xffffffff;

    for (let i = 0; i < bytes.length; i += 1) {
        crc = CRC_TABLE[(crc ^ bytes[i]) & 0xff] ^ (crc >>> 8);
    }

    return (crc ^ 0xffffffff) >>> 0;
};

const encoder = new TextEncoder();

/* DOS date/time used by the ZIP local and central headers. */
const dosDateTime = (date) => ({
    time:
        (date.getHours() << 11) |
        (date.getMinutes() << 5) |
        (Math.floor(date.getSeconds() / 2) & 0x1f),
    date:
        ((date.getFullYear() - 1980) << 9) |
        ((date.getMonth() + 1) << 5) |
        date.getDate()
});

const zipSync = (files) => {
    const stamp = dosDateTime(new Date());

    const locals = [];
    const centrals = [];

    let offset = 0;

    files.forEach(({ name, content }) => {
        const nameBytes = encoder.encode(name);
        const data = encoder.encode(content);
        const crc = crc32(data);

        const local = new Uint8Array(30 + nameBytes.length + data.length);
        const localView = new DataView(local.buffer);

        localView.setUint32(0, 0x04034b50, true);
        localView.setUint16(4, 20, true);
        localView.setUint16(6, 0x0800, true);
        localView.setUint16(8, 0, true);
        localView.setUint16(10, stamp.time, true);
        localView.setUint16(12, stamp.date, true);
        localView.setUint32(14, crc, true);
        localView.setUint32(18, data.length, true);
        localView.setUint32(22, data.length, true);
        localView.setUint16(26, nameBytes.length, true);
        localView.setUint16(28, 0, true);

        local.set(nameBytes, 30);
        local.set(data, 30 + nameBytes.length);

        const central = new Uint8Array(46 + nameBytes.length);
        const centralView = new DataView(central.buffer);

        centralView.setUint32(0, 0x02014b50, true);
        centralView.setUint16(4, 20, true);
        centralView.setUint16(6, 20, true);
        centralView.setUint16(8, 0x0800, true);
        centralView.setUint16(10, 0, true);
        centralView.setUint16(12, stamp.time, true);
        centralView.setUint16(14, stamp.date, true);
        centralView.setUint32(16, crc, true);
        centralView.setUint32(20, data.length, true);
        centralView.setUint32(24, data.length, true);
        centralView.setUint16(28, nameBytes.length, true);
        centralView.setUint16(30, 0, true);
        centralView.setUint16(32, 0, true);
        centralView.setUint16(34, 0, true);
        centralView.setUint16(36, 0, true);
        centralView.setUint32(38, 0, true);
        centralView.setUint32(42, offset, true);

        central.set(nameBytes, 46);

        locals.push(local);
        centrals.push(central);

        offset += local.length;
    });

    const centralSize = centrals.reduce((sum, part) => sum + part.length, 0);

    const end = new Uint8Array(22);
    const endView = new DataView(end.buffer);

    endView.setUint32(0, 0x06054b50, true);
    endView.setUint16(4, 0, true);
    endView.setUint16(6, 0, true);
    endView.setUint16(8, centrals.length, true);
    endView.setUint16(10, centrals.length, true);
    endView.setUint32(12, centralSize, true);
    endView.setUint32(16, offset, true);
    endView.setUint16(20, 0, true);

    const parts = [...locals, ...centrals, end];

    const archive = new Uint8Array(
        parts.reduce((sum, part) => sum + part.length, 0)
    );

    let cursor = 0;

    parts.forEach((part) => {
        archive.set(part, cursor);
        cursor += part.length;
    });

    return archive;
};

export const escapeXml = (value) =>
    String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;")
        /* Control characters are not valid inside an XML 1.0 document. */
        // eslint-disable-next-line no-control-regex -- stripping them is the point
        .replace(/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/g, "");

const columnName = (index) => {
    let name = "";
    let remaining = index;

    do {
        name = String.fromCharCode(65 + (remaining % 26)) + name;
        remaining = Math.floor(remaining / 26) - 1;
    } while (remaining >= 0);

    return name;
};

const STYLE_DEFAULT = 0;
const STYLE_BOLD = 1;

const cellXml = (reference, value, style) => {
    const styleAttribute = style ? ` s="${style}"` : "";

    if (value === null || value === undefined || value === "") {
        return `<c r="${reference}"${styleAttribute}/>`;
    }

    if (typeof value === "number" && Number.isFinite(value)) {
        return `<c r="${reference}"${styleAttribute}><v>${value}</v></c>`;
    }

    return (
        `<c r="${reference}"${styleAttribute} t="inlineStr">` +
        `<is><t xml:space="preserve">${escapeXml(value)}</t></is></c>`
    );
};

const rowXml = (cells, rowNumber, style) => {
    const content = cells
        .map((value, index) =>
            cellXml(`${columnName(index)}${rowNumber}`, value, style)
        )
        .join("");

    return `<row r="${rowNumber}">${content}</row>`;
};

const sheetXml = (rows, columnWidths) => {
    const cols = columnWidths?.length
        ? "<cols>" +
          columnWidths
              .map(
                  (width, index) =>
                      `<col min="${index + 1}" max="${index + 1}" ` +
                      `width="${width}" customWidth="1"/>`
              )
              .join("") +
          "</cols>"
        : "";

    const body = rows
        .map((row, index) =>
            rowXml(
                Array.isArray(row) ? row : row.cells ?? [],
                index + 1,
                !Array.isArray(row) && row.bold ? STYLE_BOLD : STYLE_DEFAULT
            )
        )
        .join("");

    return (
        '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
        '<worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
        cols +
        `<sheetData>${body}</sheetData>` +
        "</worksheet>"
    );
};

const STYLES_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main">' +
    '<fonts count="2">' +
    '<font><sz val="11"/><name val="Calibri"/></font>' +
    '<font><b/><sz val="11"/><name val="Calibri"/></font>' +
    "</fonts>" +
    '<fills count="2">' +
    '<fill><patternFill patternType="none"/></fill>' +
    '<fill><patternFill patternType="gray125"/></fill>' +
    "</fills>" +
    '<borders count="1">' +
    "<border><left/><right/><top/><bottom/><diagonal/></border>" +
    "</borders>" +
    '<cellStyleXfs count="1">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0"/>' +
    "</cellStyleXfs>" +
    '<cellXfs count="2">' +
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="0" xfId="0"/>' +
    '<xf numFmtId="0" fontId="1" fillId="0" borderId="0" xfId="0" applyFont="1"/>' +
    "</cellXfs>" +
    '<cellStyles count="1">' +
    '<cellStyle name="Normal" xfId="0" builtinId="0"/>' +
    "</cellStyles>" +
    "</styleSheet>";

const CONTENT_TYPES_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">' +
    '<Default Extension="rels" ' +
    'ContentType="application/vnd.openxmlformats-package.relationships+xml"/>' +
    '<Default Extension="xml" ContentType="application/xml"/>' +
    '<Override PartName="/xl/workbook.xml" ' +
    'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' +
    '<Override PartName="/xl/worksheets/sheet1.xml" ' +
    'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>' +
    '<Override PartName="/xl/styles.xml" ' +
    'ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/>' +
    "</Types>";

const ROOT_RELS_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" ' +
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" ' +
    'Target="xl/workbook.xml"/>' +
    "</Relationships>";

const WORKBOOK_RELS_XML =
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' +
    '<Relationship Id="rId1" ' +
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" ' +
    'Target="worksheets/sheet1.xml"/>' +
    '<Relationship Id="rId2" ' +
    'Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" ' +
    'Target="styles.xml"/>' +
    "</Relationships>";

/* Excel rejects these characters in a sheet name and caps it at 31 chars. */
const safeSheetName = (name) =>
    (String(name || "Sheet1").replace(/[\\/?*[\]:]/g, " ").trim() || "Sheet1")
        .slice(0, 31);

const workbookXml = (sheetName) =>
    '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
    '<workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" ' +
    'xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships">' +
    "<sheets>" +
    `<sheet name="${escapeXml(safeSheetName(sheetName))}" sheetId="1" r:id="rId1"/>` +
    "</sheets>" +
    "</workbook>";

export const buildWorkbook = ({ sheetName, rows = [], columnWidths }) =>
    zipSync([
        { name: "[Content_Types].xml", content: CONTENT_TYPES_XML },
        { name: "_rels/.rels", content: ROOT_RELS_XML },
        { name: "xl/workbook.xml", content: workbookXml(sheetName) },
        { name: "xl/_rels/workbook.xml.rels", content: WORKBOOK_RELS_XML },
        { name: "xl/styles.xml", content: STYLES_XML },
        {
            name: "xl/worksheets/sheet1.xml",
            content: sheetXml(rows, columnWidths)
        }
    ]);

export const downloadBlob = (blob, fileName) => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = fileName;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);
};

/*
 * A row is either a plain array of cell values or
 * { cells: [...], bold: true } for header and summary lines.
 * Finite numbers are written as real numeric cells.
 */
export const exportToExcel = ({
                                  fileName,
                                  sheetName = "Sheet1",
                                  rows = [],
                                  columnWidths
                              }) => {
    const workbook = buildWorkbook({ sheetName, rows, columnWidths });

    downloadBlob(
        new Blob([workbook], {
            type:
                "application/vnd.openxmlformats-officedocument." +
                "spreadsheetml.sheet"
        }),
        fileName.endsWith(".xlsx") ? fileName : `${fileName}.xlsx`
    );
};
