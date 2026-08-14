import { useCallback, useMemo, useState } from "react";
import { ArrowDownUp, Scale } from "lucide-react";

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

const WASTE_MESSAGES = {
    NO_BOM_STANDARD_IN_PERIOD:
        "Kỳ đã chọn chưa có phiếu nhập kho thành phẩm gắn định mức BOM nên chưa xác định được lượng tiêu hao tiêu chuẩn."
};

const CONSUMPTION_SERIES = [
    {
        key: "actualQuantity",
        label: "Thực tế xuất kho",
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
        color: CHART_COLORS[2]
    },
    {
        key: "issueCount",
        label: "Phiếu xuất",
        color: CHART_COLORS[5]
    }
];

function OperationsReport() {

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

    const consumption = useMemo(
        () => (data?.materialComparisons ?? [])
            .filter((item) =>
                toNumber(item.actualQuantity) > 0 ||
                toNumber(item.standardQuantity) > 0)
            .map((item) => ({
                label: item.materialCode,
                subLabel: item.unit,
                materialName: item.materialName,
                actualQuantity: toNumber(item.actualQuantity),
                standardQuantity: toNumber(item.standardQuantity)
            })),
        [data]
    );

    const monthlyVolume = useMemo(
        () => (data?.documentVolume?.monthly ?? []).map((item) => ({
            label: formatMonth(item.month),
            receiptCount: toNumber(item.receiptCount),
            issueCount: toNumber(item.issueCount)
        })),
        [data]
    );

    const weekdayFrequency = data?.weekdayFrequency ?? [];

    const hasWeekdayData = weekdayFrequency.some(
        (item) => toNumber(item.totalCount) > 0
    );

    const wasteRate = data?.wasteRate;

    const volume = data?.documentVolume;

    return (
        <div>
            <PageHeader
                title="Báo cáo hiệu quả vận hành & định mức"
                description="So sánh nguyên vật liệu xuất kho thực tế với định mức BOM và theo dõi khối lượng chứng từ đã xử lý."
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
                            title="Tỷ lệ hao hụt NVL thực tế vs định mức"
                            value={formatPercent(wasteRate?.wasteRatePercent)}
                            icon={<Scale size={22} />}
                            tone={
                                toNumber(wasteRate?.wasteRatePercent) > 0
                                    ? "negative"
                                    : "positive"
                            }
                            unavailable={!wasteRate?.available}
                            unavailableMessage={
                                WASTE_MESSAGES[wasteRate?.unavailableReason] ??
                                "Chưa đủ dữ liệu định mức BOM để tính tỷ lệ hao hụt."
                            }
                            description="(Số lượng thực tế - Số lượng định mức) / Số lượng định mức. Định mức lấy từ BOM theo sản lượng thành phẩm nhập kho trong kỳ."
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
                            title="Tổng số phiếu Nhập - Xuất đã xử lý"
                            value={formatNumber(volume?.totalDocuments)}
                            icon={<ArrowDownUp size={22} />}
                            description="Chỉ tính các phiếu đã ở trạng thái xác nhận trong kỳ báo cáo."
                            rows={[
                                {
                                    label: "Phiếu nhập kho",
                                    value: formatNumber(volume?.totalReceipts)
                                },
                                {
                                    label: "Phiếu xuất kho",
                                    value: formatNumber(volume?.totalIssues)
                                },
                                {
                                    label: "Nguyên vật liệu / Sản phẩm",
                                    value: `${formatNumber(
                                        toNumber(volume?.materialReceipts) +
                                        toNumber(volume?.materialIssues)
                                    )} / ${formatNumber(
                                        toNumber(volume?.productReceipts) +
                                        toNumber(volume?.productIssues)
                                    )}`
                                }
                            ]}
                        />
                    </div>

                    <ChartCard
                        title="Số phiếu Nhập - Xuất đã xử lý theo tháng"
                        description="Số lượng chứng từ nhập kho và xuất kho đã xác nhận theo từng tháng trong kỳ."
                        legend={DOCUMENT_SERIES.map((item) => ({
                            label: item.label,
                            color: item.color
                        }))}
                        isEmpty={monthlyVolume.every(
                            (item) => item.receiptCount === 0 && item.issueCount === 0
                        )}
                    >
                        <ClusteredBarChart
                            data={monthlyVolume}
                            series={DOCUMENT_SERIES}
                            formatValue={formatNumber}
                            formatTooltip={formatNumber}
                        />
                    </ChartCard>

                    <ChartCard
                        title="Nguyên vật liệu xuất thực tế vs Định mức BOM tiêu chuẩn"
                        description="Đối chiếu khối lượng nguyên vật liệu đã xuất kho với định mức tiêu hao tiêu chuẩn theo BOM."
                        legend={CONSUMPTION_SERIES.map((item) => ({
                            label: item.label,
                            color: item.color
                        }))}
                        isEmpty={consumption.length === 0}
                        emptyMessage="Chưa có nguyên vật liệu nào phát sinh xuất kho hoặc định mức trong kỳ."
                        footer="Mỗi cột là một mã nguyên vật liệu, đơn vị tính hiển thị bên dưới mã."
                    >
                        <ClusteredBarChart
                            data={consumption}
                            series={CONSUMPTION_SERIES}
                            formatValue={formatNumber}
                            formatTooltip={formatNumber}
                        />
                    </ChartCard>

                    <ChartCard
                        title="Tần suất nhập/xuất kho theo các ngày trong tuần"
                        description="Số phiếu nhập và xuất đã xác nhận, gom theo thứ trong tuần."
                        isEmpty={!hasWeekdayData}
                    >
                        <WeekdayHeatmap data={weekdayFrequency} />
                    </ChartCard>
                </div>
            )}
        </div>
    );
}

export default OperationsReport;
