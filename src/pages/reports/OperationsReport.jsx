import { useCallback, useMemo, useState } from "react";

import PageHeader from "../../components/common/PageHeader.jsx";
import Loading from "../../components/common/Loading.jsx";
import ReportFilters, {
    FilterField,
    FilterInput,
    FilterSelect
} from "../../components/reports/ReportFilters.jsx";
import ReportErrorState from "../../components/reports/ReportErrorState.jsx";
import StockSummaryTable from "../../components/reports/StockSummaryTable.jsx";
import {
    firstDayOfMonth,
    today
} from "../../components/reports/reportUtils.js";
import useReportData from "../../hooks/useReportData.js";
import reportApi from "../../api/reportApi.js";

const STOCK_GROUPS = [
    {
        value: "MATERIAL",
        label: "Nguyên vật liệu"
    },
    {
        value: "PRODUCT",
        label: "Sản phẩm"
    }
];

function OperationsReport() {

    const [fromDate, setFromDate] = useState(firstDayOfMonth);
    const [toDate, setToDate] = useState(today);
    const [stockGroup, setStockGroup] = useState("MATERIAL");

    const request = useCallback(
        () => reportApi.getOperationsStockSummary({
            fromDate,
            toDate,
            stockGroup
        }),
        [fromDate, toDate, stockGroup]
    );

    const { data, loading, error, reload } = useReportData(
        request,
        [fromDate, toDate, stockGroup]
    );

    const totals = useMemo(
        () => (data
            ? {
                openingQuantity: data.totalOpeningQuantity,
                receiptQuantity: data.totalReceiptQuantity,
                issueQuantity: data.totalIssueQuantity,
                closingQuantity: data.totalClosingQuantity
            }
            : null),
        [data]
    );

    return (
        <div>
            <PageHeader
                title="Bảng báo cáo tổng hợp nhập xuất tồn"
                description="Tổng hợp tồn đầu, tổng nhập, tổng xuất và tồn cuối của từng vật tư trong kỳ. Mở rộng một dòng để xem các phiếu nhập/xuất liên quan."
            />

            <ReportFilters>
                <FilterField label="Từ ngày">
                    <FilterInput
                        type="date"
                        value={fromDate}
                        max={toDate}
                        onChange={(event) => setFromDate(event.target.value)}
                    />
                </FilterField>

                <FilterField label="Đến ngày">
                    <FilterInput
                        type="date"
                        value={toDate}
                        min={fromDate}
                        onChange={(event) => setToDate(event.target.value)}
                    />
                </FilterField>

                <FilterField label="Loại vật tư">
                    <FilterSelect
                        value={stockGroup}
                        onChange={(event) => setStockGroup(event.target.value)}
                    >
                        {STOCK_GROUPS.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </FilterSelect>
                </FilterField>
            </ReportFilters>

            {loading && <Loading rows={8} />}

            {!loading && error && (
                <ReportErrorState
                    message={error}
                    onRetry={reload}
                />
            )}

            {!loading && !error && data && (
                <div className="space-y-4">
                    {data.warehouseName && (
                        <p className="text-sm text-(--color-text-secondary)">
                            Kho: <span className="font-semibold text-(--color-text)">
                                {data.warehouseName}
                            </span>
                        </p>
                    )}

                    <StockSummaryTable
                        items={data.items ?? []}
                        totals={totals}
                    />
                </div>
            )}
        </div>
    );
}

export default OperationsReport;
