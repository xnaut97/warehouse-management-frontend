import { useCallback, useMemo, useState } from "react";
import { CircleDollarSign, PieChart as PieChartIcon, RefreshCcw } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import Loading from "../../components/common/Loading.jsx";
import ReportFilters, { FilterField, FilterInput } from "../../components/reports/ReportFilters.jsx";
import ReportErrorState from "../../components/reports/ReportErrorState.jsx";
import ReportKpiCard from "../../components/reports/ReportKpiCard.jsx";
import ChartCard from "../../components/reports/charts/ChartCard.jsx";
import LineChart from "../../components/reports/charts/LineChart.jsx";
import PieChartComponent from "../../components/reports/charts/PieChart.jsx";
import { GROUP_COLORS, GROUP_LABELS } from "../../components/reports/charts/chartTheme.js";
import {
    formatCompactCurrency,
    firstDayOfMonthsAgo,
    formatCurrency,
    formatMonth,
    formatNumber,
    formatPercent,
    today,
    toNumber
} from "../../components/reports/reportUtils.js";
import useReportData from "../../hooks/useReportData.js";
import reportApi from "../../api/reportApi.js";

const TURNOVER_MESSAGES = {
    NO_INVENTORY_VALUE_IN_PERIOD:
        "Kỳ đã chọn nằm ngoài 12 tháng gần nhất nên chưa có giá trị tồn kho để tính vòng quay.",
    ZERO_AVERAGE_INVENTORY:
        "Giá trị tồn kho bình quân của kỳ bằng 0 nên không tính được vòng quay."
};

function InventoryValueReport() {

    const [fromDate, setFromDate] = useState(() => firstDayOfMonthsAgo(11));
    const [toDate, setToDate] = useState(today);

    const request = useCallback(
        () => reportApi.getInventoryValue({ fromDate, toDate }),
        [fromDate, toDate]
    );

    const { data, loading, error, reload } = useReportData(
        request,
        [fromDate, toDate]
    );

    const monthlyTrend = useMemo(
        () => (data?.monthlyTrend ?? []).map((item) => ({
            label: formatMonth(item.month),
            value: toNumber(item.totalValue)
        })),
        [data]
    );

    const groupSlices = useMemo(
        () => (data?.groups ?? []).map((item) => ({
            label: GROUP_LABELS[item.group] ?? item.group,
            value: toNumber(item.value),
            color: GROUP_COLORS[item.group]
        })),
        [data]
    );

    const turnover = data?.turnover;

    const hasValue = toNumber(data?.totalInventoryValue) > 0;

    return (
        <div>
            <PageHeader
                title="Báo cáo giá trị vốn lưu động & tồn kho"
                description="Giá trị tồn kho được tính theo đơn giá nguyên vật liệu và giá vốn bình quân của sản phẩm."
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
                    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                        <ReportKpiCard
                            title="Tổng giá trị tồn kho toàn nhà máy"
                            value={formatCurrency(data.totalInventoryValue)}
                            icon={<CircleDollarSign size={22} />}
                            rows={[
                                {
                                    label: "Kho nguyên vật liệu",
                                    value: formatCurrency(data.materialValue)
                                },
                                {
                                    label: "Kho sản phẩm",
                                    value: formatCurrency(data.productValue)
                                }
                            ]}
                        />

                        <ReportKpiCard
                            title="Tỷ trọng vốn lưu động"
                            value={`${formatPercent(data.materialPercentage)} / ${formatPercent(data.productPercentage)}`}
                            description="Tỷ trọng giá trị tồn kho giữa kho nguyên vật liệu và kho sản phẩm."
                            icon={<PieChartIcon size={22} />}
                            unavailable={!hasValue}
                            unavailableMessage="Chưa có giá trị tồn kho để tính tỷ trọng."
                            rows={[
                                {
                                    label: "Kho Nguyên vật liệu",
                                    value: formatPercent(data.materialPercentage)
                                },
                                {
                                    label: "Kho Sản phẩm",
                                    value: formatPercent(data.productPercentage)
                                }
                            ]}
                        />

                        <ReportKpiCard
                            title="Vòng quay hàng tồn kho"
                            value={`${formatNumber(turnover?.ratio)} vòng`}
                            icon={<RefreshCcw size={22} />}
                            unavailable={!turnover?.available}
                            unavailableMessage={
                                TURNOVER_MESSAGES[turnover?.unavailableReason] ??
                                "Chưa đủ dữ liệu xuất kho và tồn kho để tính vòng quay."
                            }
                            description={`Giá vốn xuất kho / Giá trị tồn kho bình quân trong ${formatNumber(turnover?.periodMonths)} tháng.`}
                            rows={[
                                {
                                    label: "Giá vốn hàng xuất kho",
                                    value: formatCurrency(turnover?.costOfGoodsIssued)
                                },
                                {
                                    label: "Tồn kho bình quân",
                                    value: formatCurrency(turnover?.averageInventoryValue)
                                }
                            ]}
                        />
                    </div>

                    <ChartCard
                        title="Biến động Tổng giá trị Vốn tồn kho theo 12 tháng"
                        description="Giá trị tồn kho cuối mỗi tháng, suy ngược từ tồn kho hiện tại và các phiếu nhập, xuất, kiểm kê đã hoàn tất."
                        isEmpty={monthlyTrend.length === 0}
                        footer="Đơn vị hiển thị trên trục: ng = nghìn, tr = triệu, tỷ = tỷ đồng."
                    >
                        <LineChart
                            data={monthlyTrend}
                            formatValue={formatCompactCurrency}
                            formatTooltip={formatCurrency}
                        />
                    </ChartCard>

                    <ChartCard
                        title="Cơ cấu Vốn theo Nhóm vật tư"
                        description="Phân bổ giá trị tồn kho giữa kho nguyên vật liệu và kho sản phẩm."
                        isEmpty={groupSlices.every((item) => item.value <= 0)}
                        emptyMessage="Chưa có giá trị tồn kho để phân tích cơ cấu vốn."
                    >
                        <PieChartComponent
                            data={groupSlices}
                            innerRadius={62}
                            formatValue={formatCurrency}
                            centerLabel="Tổng giá trị"
                            centerValue={formatCompactCurrency(data.totalInventoryValue)}
                        />
                    </ChartCard>
                </div>
            )}
        </div>
    );
}

export default InventoryValueReport;
