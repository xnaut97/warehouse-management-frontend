import { Fragment, useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import Badge from "../common/Badge.jsx";
import EmptyState from "../common/EmptyState.jsx";

import { formatDate, formatNumber } from "./reportUtils.js";

const DOCUMENT_META = {
    GOODS_RECEIPT: {
        label: "Nhập",
        color: "green",
        path: (id) => `/receipts/${id}`
    },
    GOODS_ISSUE: {
        label: "Xuất",
        color: "yellow",
        path: (id) => `/issues/${id}`
    },
    PRODUCT_RECEIPT: {
        label: "Nhập",
        color: "green",
        path: (id) => `/product-receipts/${id}`
    },
    PRODUCT_ISSUE: {
        label: "Xuất",
        color: "yellow",
        path: (id) => `/product-issues/${id}`
    }
};

function DocumentTable({ documents, onOpen }) {

    if (documents.length === 0) {

        return (
            <p className="text-sm text-slate-500">
                Không có phiếu nhập/xuất nào trong kỳ.
            </p>
        );

    }

    return (

        <div className="overflow-x-auto rounded-xl border border-(--color-border) bg-white">

            <table className="w-full min-w-200">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        STT
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Ngày giao dịch
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Nghiệp vụ
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Mã phiếu
                    </th>

                    <th className="px-5 py-3 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Số lượng
                    </th>

                    <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">
                        Đối tượng
                    </th>

                </tr>

                </thead>

                <tbody>

                {documents.map((document, index) => {

                    const meta = DOCUMENT_META[document.documentType];

                    return (

                        <tr
                            key={`${document.documentType}-${document.documentId}`}
                            className="border-b border-pink-100 last:border-b-0"
                        >

                            <td className="px-5 py-3 text-sm text-slate-700">
                                {index + 1}
                            </td>

                            <td className="px-5 py-3 text-sm text-slate-700">
                                {formatDate(document.documentDate) || "-"}
                            </td>

                            <td className="px-5 py-3 text-sm">
                                <Badge color={meta?.color ?? "gray"}>
                                    {meta?.label ?? document.documentType}
                                </Badge>
                            </td>

                            <td className="px-5 py-3 text-sm">

                                {meta ? (

                                    <button
                                        type="button"
                                        onClick={() =>
                                            onOpen(meta.path(document.documentId))
                                        }
                                        className="font-semibold text-(--color-primary-hover) underline-offset-4 transition hover:underline"
                                    >
                                        {document.documentNo}
                                    </button>

                                ) : (

                                    <span className="text-slate-700">
                                        {document.documentNo}
                                    </span>

                                )}

                            </td>

                            <td className="px-5 py-3 text-right text-sm text-slate-700">
                                {formatNumber(document.quantity)}
                            </td>

                            <td className="px-5 py-3 text-sm text-slate-700">

                                {document.partnerName
                                    ? `${document.partnerName}${
                                        document.partnerCode
                                            ? ` (${document.partnerCode})`
                                            : ""
                                    }`
                                    : "-"}

                            </td>

                        </tr>

                    );

                })}

                </tbody>

            </table>

        </div>

    );

}

function StockSummaryTable({ items = [], totals }) {

    const navigate = useNavigate();

    const [expandedIds, setExpandedIds] = useState([]);

    const toggleExpanded = (itemId) => {

        setExpandedIds((current) =>
            current.includes(itemId)
                ? current.filter((id) => id !== itemId)
                : [...current, itemId]
        );

    };

    return (

        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">

            <table className="w-full min-w-250">

                <thead className="border-b border-pink-100">

                <tr>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        STT
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        VẬT TƯ
                    </th>

                    <th className="px-6 py-4 text-left font-semibold text-slate-700">
                        ĐVT
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỒN ĐẦU
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỔNG NHẬP
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỔNG XUẤT
                    </th>

                    <th className="px-6 py-4 text-right font-semibold text-slate-700">
                        TỒN CUỐI
                    </th>

                </tr>

                </thead>

                <tbody>

                {items.length === 0 ? (

                    <tr>

                        <td colSpan={7}>

                            <EmptyState
                                title="Chưa có dữ liệu nhập xuất tồn"
                                description="Không có vật tư nào phát sinh tồn kho hoặc chứng từ trong kỳ đã chọn."
                            />

                        </td>

                    </tr>

                ) : (

                    items.map((item, index) => {

                        const documents = item.documents ?? [];

                        const expanded = expandedIds.includes(item.itemId);

                        return (

                            <Fragment key={item.itemId}>

                                <tr
                                    onClick={() => toggleExpanded(item.itemId)}
                                    className="cursor-pointer border-b border-pink-100 transition hover:bg-pink-50"
                                >

                                    <td className="px-6 py-4 text-sm text-slate-700">

                                        <div className="flex items-center gap-2">

                                            <span className="rounded-lg p-1 text-slate-500">

                                                {expanded ? (
                                                    <ChevronDown size={18} />
                                                ) : (
                                                    <ChevronRight size={18} />
                                                )}

                                            </span>

                                            {index + 1}

                                        </div>

                                    </td>

                                    <td className="px-6 py-4 text-sm font-medium text-slate-800">
                                        {item.name} ({item.code})
                                    </td>

                                    <td className="px-6 py-4 text-sm text-slate-700">
                                        {item.unit || "-"}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                                        {formatNumber(item.openingQuantity)}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                                        {formatNumber(item.receiptQuantity)}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm text-slate-700">
                                        {formatNumber(item.issueQuantity)}
                                    </td>

                                    <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                                        {formatNumber(item.closingQuantity)}
                                    </td>

                                </tr>

                                {expanded && (

                                    <tr className="border-b border-pink-100 bg-pink-50/30">

                                        <td colSpan={7} className="px-6 py-4">

                                            <DocumentTable
                                                documents={documents}
                                                onOpen={(path) => navigate(path)}
                                            />

                                        </td>

                                    </tr>

                                )}

                            </Fragment>

                        );

                    })

                )}

                </tbody>

                {items.length > 0 && totals && (

                    <tfoot className="border-t border-pink-100 bg-pink-50/40">

                    <tr>

                        <td
                            colSpan={3}
                            className="px-6 py-4 text-sm font-semibold text-slate-700"
                        >
                            TỔNG CỘNG
                        </td>

                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                            {formatNumber(totals.openingQuantity)}
                        </td>

                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                            {formatNumber(totals.receiptQuantity)}
                        </td>

                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                            {formatNumber(totals.issueQuantity)}
                        </td>

                        <td className="px-6 py-4 text-right text-sm font-semibold text-slate-800">
                            {formatNumber(totals.closingQuantity)}
                        </td>

                    </tr>

                    </tfoot>

                )}

            </table>

        </div>

    );

}

export default StockSummaryTable;
