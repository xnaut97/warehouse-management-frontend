import { useCallback, useEffect, useMemo, useState } from "react";
import { ClipboardCheck, CircleDollarSign } from "lucide-react";

import PageHeader from "../../components/common/PageHeader.jsx";
import Loading from "../../components/common/Loading.jsx";
import ReportFilters, {
    FilterField,
    FilterInput,
    FilterSelect
} from "../../components/reports/ReportFilters.jsx";
import ReportErrorState from "../../components/reports/ReportErrorState.jsx";
import ReportKpiCard from "../../components/reports/ReportKpiCard.jsx";
import ChartCard from "../../components/reports/charts/ChartCard.jsx";
import PieChartComponent from "../../components/reports/charts/PieChart.jsx";
import HorizontalBarChart from "../../components/reports/charts/HorizontalBarChart.jsx";
import { GROUP_COLORS } from "../../components/reports/charts/chartTheme.js";
import {
    firstDayOfMonthsAgo,
    formatCurrency,
    formatNumber,
    formatPercent,
    today,
    toNumber,
    unwrap
} from "../../components/reports/reportUtils.js";
import useReportData from "../../hooks/useReportData.js";
import reportApi from "../../api/reportApi.js";
import warehouseApi from "../../api/warehouseApi.js";

const ACCURACY_MESSAGES = {
    NO_COMPLETED_STOCKTAKING:
        "Kỳ đã chọn chưa có phiếu kiểm kê nào được chốt số lượng thực tế.",
    ZERO_BOOK_QUANTITY:
        "Số lượng sổ sách của các phiếu kiểm kê trong kỳ bằng 0 nên không tính được tỷ lệ chính xác."
};

const UNSPECIFIED_REASON = "Chưa ghi nhận nguyên nhân";

function StocktakingAccuracyReport() {

    const [fromDate, setFromDate] = useState(() => firstDayOfMonthsAgo(11));
    const [toDate, setToDate] = useState(today);
    const [warehouseId, setWarehouseId] = useState("");
    const [warehouses, setWarehouses] = useState([]);

    useEffect(() => {

        let active = true;

        warehouseApi
            .getAllWarehouses({ page: 0, size: 50 })
            .then((response) => {
                if (!active) return;

                const payload = unwrap(response, []);

                setWarehouses(
                    Array.isArray(payload)
                        ? payload
                        : payload?.content ?? []
                );
            })
            .catch(() => {
                if (active) {
                    setWarehouses([]);
                }
            });

        return () => {
            active = false;
        };

    }, []);

    const request = useCallback(
        () => reportApi.getStocktakingAccuracy({
            fromDate,
            toDate,
            warehouseId: warehouseId === "" ? undefined : warehouseId
        }),
        [fromDate, toDate, warehouseId]
    );

    const { data, loading, error, reload } = useReportData(
        request,
        [fromDate, toDate, warehouseId]
    );

    const warehouseSlices = useMemo(
        () => (data?.warehouses ?? []).map((item) => ({
            label: item.warehouseName,
            value: toNumber(item.absoluteVarianceValue),
            color: GROUP_COLORS[item.group]
        })),
        [data]
    );

    const reasonBars = useMemo(
        () => (data?.reasons ?? []).map((item) => ({
            label: item.unspecified
                ? UNSPECIFIED_REASON
                : item.reason,
            value: toNumber(item.itemCount),
            absoluteVarianceQuantity: toNumber(item.absoluteVarianceQuantity),
            absoluteVarianceValue: toNumber(item.absoluteVarianceValue)
        })),
        [data]
    );

    const accuracy = data?.accuracy;

    const varianceValue = data?.varianceValue;

    return (
        <div>
            <PageHeader
                title="Báo cáo kiểm kê & tỷ lệ chính xác kho"
                description="Chỉ tổng hợp từ các phiếu kiểm kê đã chốt số lượng thực tế hoặc đã cân bằng tồn kho."
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

                <FilterField label="Kho">
                    <FilterSelect
                        value={warehouseId}
                        onChange={(event) => setWarehouseId(event.target.value)}
                    >
                        <option value="">Tất cả kho</option>

                        {warehouses.map((warehouse) => (
                            <option
                                key={warehouse.id}
                                value={warehouse.id}
                            >
                                {warehouse.name}
                            </option>
                        ))}
                    </FilterSelect>
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
                            title="Tỷ lệ chính xác tồn kho"
                            value={formatPercent(accuracy?.accuracyPercent)}
                            icon={<ClipboardCheck size={22} />}
                            unavailable={!accuracy?.available}
                            unavailableMessage={
                                ACCURACY_MESSAGES[accuracy?.unavailableReason] ??
                                "Chưa đủ dữ liệu kiểm kê để tính tỷ lệ chính xác."
                            }
                            description="(Tổng dòng - Dòng lệch) / Tổng dòng * 100%"
                            rows={[
                                {
                                    label: "SL thực tế",
                                    value: formatNumber(accuracy?.totalPhysicalQuantity)
                                },
                                {
                                    label: "SL sổ sách",
                                    value: formatNumber(accuracy?.totalSystemQuantity)
                                },
                                {
                                    label: "Dòng lệch / Tổng dòng",
                                    value: `${formatNumber(accuracy?.discrepancyItems)} / ${formatNumber(accuracy?.totalItems)}`
                                },
                                {
                                    label: "Số phiếu kiểm kê",
                                    value: formatNumber(accuracy?.completedStocktakings)
                                }
                            ]}
                        />

                        <ReportKpiCard
                            title="Giá trị vốn chênh lệch sau kiểm kê"
                            value={formatCurrency(varianceValue?.netVarianceValue)}
                            icon={<CircleDollarSign size={22} />}
                            tone={
                                toNumber(varianceValue?.netVarianceValue) < 0
                                    ? "negative"
                                    : "positive"
                            }
                            description="Chênh lệch thuần được tính theo đơn giá nguyên vật liệu và giá vốn bình quân của sản phẩm."
                            rows={[
                                {
                                    label: "Giá trị lệch tuyệt đối",
                                    value: formatCurrency(varianceValue?.absoluteVarianceValue)
                                },
                                {
                                    label: "SL lệch thuần",
                                    value: formatNumber(varianceValue?.netVarianceQuantity)
                                },
                                {
                                    label: "SL lệch tuyệt đối",
                                    value: formatNumber(varianceValue?.absoluteVarianceQuantity)
                                }
                            ]}
                        />
                    </div>

                    <ChartCard
                        title="Tỷ lệ chênh lệch theo Kho"
                        description="Phân bổ giá trị chênh lệch tuyệt đối sau kiểm kê giữa các kho."
                        isEmpty={warehouseSlices.every((item) => item.value <= 0)}
                        emptyMessage="Chưa ghi nhận chênh lệch kiểm kê trong kỳ đã chọn."
                    >
                        <PieChartComponent
                            data={warehouseSlices}
                            formatValue={formatCurrency}
                        />
                    </ChartCard>

                    <ChartCard
                        title="Top nguyên nhân gây sai lệch kiểm kê"
                        description="Nguyên nhân được tổng hợp từ ghi chú trên từng dòng kiểm kê và từng lô hàng."
                        isEmpty={reasonBars.length === 0}
                        emptyMessage="Chưa có dòng kiểm kê nào bị lệch trong kỳ đã chọn."
                    >
                        <HorizontalBarChart
                            data={reasonBars}
                            formatValue={(value) => `${formatNumber(value)} dòng`}
                            secondaryLabel={(item) =>
                                `${formatNumber(item.absoluteVarianceQuantity)} đơn vị · ${formatCurrency(item.absoluteVarianceValue)}`
                            }
                        />
                    </ChartCard>
                </div>
            )}
        </div>
    );
}

export default StocktakingAccuracyReport;
