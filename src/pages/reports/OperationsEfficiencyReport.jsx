import { useCallback, useMemo, useState } from "react";
import { FileStack, TrendingDown } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import Loading from "../../components/common/Loading.jsx";
import ReportFilters, { FilterField, FilterInput } from "../../components/reports/ReportFilters.jsx";
import ReportErrorState from "../../components/reports/ReportErrorState.jsx";
import ReportKpiCard from "../../components/reports/ReportKpiCard.jsx";
import ChartCard from "../../components/reports/charts/ChartCard.jsx";
import ClusteredBarChart from "../../components/reports/charts/ClusteredBarChart.jsx";
import WeekdayHeatmap from "../../components/reports/charts/WeekdayHeatmap.jsx";
import { CHART_COLORS } from "../../components/reports/charts/chartTheme.js";
import {
    firstDayOfMonthsAgo,
    formatMonth,
    formatNumber,
    formatPercent,
    today,
    toNumber
} from "../../components/reports/reportUtils.js";
import useReportData from "../../hooks/useReportData.js";
import reportApi from "../../api/reportApi.js";

const MAX_COMPARED_MATERIALS = 12;

const WASTE_MESSAGES = {
    NO_BOM_STANDARD_IN_PERIOD:
        "Kỳ đã chọn chưa có phiếu nhập thành phẩm gắn định mức BOM nên chưa tính được tỷ lệ hao hụt."
};

const CONSUMPTION_SERIES = [
    {
        key: "actualQuantity",
        label: "Xuất thực tế",
        color: CHART_COLORS[0]
    },
    {
        key: "standardQuantity",
        label: "Định mức BOM",
        color: CHART_COLORS[1]
    }
];

const DOCUMENT_SERIES = [
    {
        key: "receiptCount",
        label: "Phiếu nhập",
        color: CHART_COLORS[0]
    },
    {
        key: "issueCount",
        label: "Phiếu xuất",
        color: CHART_COLORS[1]
    }
];

function OperationsEfficiencyReport() {

    const [fromDate, setFromDate] = useState(() => firstDayOfMonthsAgo(11));
    const [toDate, setToDate] = useState(today);

    const request = useCallback(
        () => reportApi.getOperations({ fromDate, toDate }),
        [fromDate, toDate]
    );

    const { data, loading, error, reload } = useReportData(
        request,
        [fromDate, toDate]
    );

    const wasteRate = data?.wasteRate;
    const documentVolume = data?.documentVolume;

    const comparisons = useMemo(
        () => [...(data?.materialComparisons ?? [])]
            .map((item) => ({
                label: item.materialName ?? item.materialCode,
                subLabel: item.unit,
                actualQuantity: toNumber(item.actualQuantity),
                standardQuantity: toNumber(item.standardQuantity)
            }))
            .sort((left, right) =>
                Math.max(right.actualQuantity, right.standardQuantity) -
                Math.max(left.actualQuantity, left.standardQuantity)
            )
            .slice(0, MAX_COMPARED_MATERIALS),
        [data]
    );

    const totalComparisons = data?.materialComparisons?.length ?? 0;

    const monthlyDocuments = useMemo(
        () => (documentVolume?.monthly ?? []).map((item) => ({
            label: formatMonth(item.month),
            receiptCount: toNumber(item.receiptCount),
            issueCount: toNumber(item.issueCount)
        })),
        [documentVolume]
    );

    const weekdayFrequency = data?.weekdayFrequency ?? [];

    const hasWeekdayData = weekdayFrequency.some(
        (item) => toNumber(item.totalCount) > 0
    );

    const hasComparisonData = comparisons.some(
        (item) => item.actualQuantity > 0 || item.standardQuantity > 0
    );

    const hasMonthlyData = monthlyDocuments.some(
        (item) => item.receiptCount > 0 || item.issueCount > 0
    );

    const wasteTone = toNumber(wasteRate?.wasteRatePercent) > 0
        ? "negative"
        : "positive";

    return (
        <div>
            <PageHeader
                title="Báo cáo hiệu quả vận hành & định mức"
                description="So sánh lượng nguyên vật liệu xuất kho thực tế với định mức BOM của sản phẩm đã nhập kho trong kỳ, kèm khối lượng chứng từ nhập xuất đã xử lý."
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
            </ReportFilters>

            {loading && <Loading rows={6} />}

            {!loading && error && (
                <ReportErrorState
                    message={error}
                    onRetry={reload}
                />
            )}

            {!loading && !error && data && (
                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-2">
                        <ReportKpiCard
                            title="Tỷ lệ hao hụt NVL thực tế so với định mức"
                            value={formatPercent(wasteRate?.wasteRatePercent)}
                            tone={wasteTone}
                            icon={<TrendingDown size={22} />}
                            unavailable={!wasteRate?.available}
                            unavailableMessage={
                                WASTE_MESSAGES[wasteRate?.unavailableReason] ??
                                "Chưa đủ dữ liệu định mức BOM và xuất kho để tính tỷ lệ hao hụt."
                            }
                            description={`(Thực tế - Định mức) / Định mức, tính trên ${formatNumber(wasteRate?.comparedMaterials)} nguyên vật liệu có định mức trong kỳ.`}
                            rows={[
                                {
                                    label: "Thực tế xuất kho",
                                    value: formatNumber(wasteRate?.totalActualQuantity)
                                },
                                {
                                    label: "Định mức BOM",
                                    value: formatNumber(wasteRate?.totalStandardQuantity)
                                },
                                {
                                    label: "Hao hụt theo giá trị",
                                    value: formatPercent(wasteRate?.wasteRateByValuePercent)
                                }
                            ]}
                        />

                        <ReportKpiCard
                            title="Tổng số phiếu nhập - xuất đã xử lý"
                            value={formatNumber(documentVolume?.totalDocuments)}
                            icon={<FileStack size={22} />}
                            description="Số phiếu nhập và phiếu xuất đã xác nhận trong kỳ báo cáo đã chọn."
                            rows={[
                                {
                                    label: "Phiếu nhập",
                                    value: formatNumber(documentVolume?.totalReceipts)
                                },
                                {
                                    label: "Phiếu xuất",
                                    value: formatNumber(documentVolume?.totalIssues)
                                }
                            ]}
                        />
                    </div>

                    <ChartCard
                        title="Nguyên vật liệu xuất thực tế so với định mức BOM tiêu chuẩn"
                        description="Lượng xuất kho thực tế của từng nguyên vật liệu đặt cạnh lượng tiêu hao tiêu chuẩn theo định mức BOM."
                        legend={CONSUMPTION_SERIES}
                        isEmpty={!hasComparisonData}
                        emptyMessage="Chưa có dữ liệu xuất kho hoặc định mức BOM trong khoảng thời gian đã chọn."
                        footer={
                            totalComparisons > MAX_COMPARED_MATERIALS
                                ? `Hiển thị ${MAX_COMPARED_MATERIALS} nguyên vật liệu có sản lượng lớn nhất trong tổng số ${formatNumber(totalComparisons)} nguyên vật liệu.`
                                : undefined
                        }
                    >
                        <ClusteredBarChart
                            data={comparisons}
                            series={CONSUMPTION_SERIES}
                        />
                    </ChartCard>

                    <ChartCard
                        title="Tần suất nhập/xuất kho theo các ngày trong tuần"
                        description="Số phiếu nhập và phiếu xuất đã xác nhận, gom theo thứ trong tuần của ngày chứng từ."
                        isEmpty={!hasWeekdayData}
                        emptyMessage="Chưa có phiếu nhập xuất nào trong khoảng thời gian đã chọn."
                    >
                        <WeekdayHeatmap data={weekdayFrequency} />
                    </ChartCard>

                    <ChartCard
                        title="Số phiếu nhập - xuất đã xử lý theo tháng"
                        description="Khối lượng chứng từ đã xác nhận của từng tháng trong kỳ báo cáo."
                        legend={DOCUMENT_SERIES}
                        isEmpty={!hasMonthlyData}
                        emptyMessage="Chưa có phiếu nhập xuất nào trong khoảng thời gian đã chọn."
                    >
                        <ClusteredBarChart
                            data={monthlyDocuments}
                            series={DOCUMENT_SERIES}
                        />
                    </ChartCard>
                </div>
            )}
        </div>
    );
}

export default OperationsEfficiencyReport;
