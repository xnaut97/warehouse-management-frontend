import { useCallback, useEffect, useMemo, useState } from "react";
import {
    TriangleAlert,
    CircleAlert,
    Eye,
    Boxes,
    CalendarClock,
    CircleSlash
} from "lucide-react";

import PageHeader from "../components/common/PageHeader.jsx";
import Loading from "../components/common/Loading.jsx";
import EmptyState from "../components/common/EmptyState.jsx";
import ReportFilters, {
    FilterField,
    FilterSelect
} from "../components/reports/ReportFilters.jsx";
import ReportErrorState from "../components/reports/ReportErrorState.jsx";
import ReportKpiCard from "../components/reports/ReportKpiCard.jsx";
import ChartCard from "../components/reports/charts/ChartCard.jsx";
import StackedBarChart from "../components/reports/charts/StackedBarChart.jsx";
import {
    GROUP_COLORS,
    GROUP_LABELS
} from "../components/reports/charts/chartTheme.js";
import {
    formatCurrency,
    formatNumber,
    unwrap
} from "../components/reports/reportUtils.js";
import AlertTable from "../components/alerts/AlertTable.jsx";
import NearExpiryLotTable from "../components/alerts/NearExpiryLotTable.jsx";
import { ALERT_TYPE_OPTIONS } from "../components/alerts/alertConstants.js";
import useReportData from "../hooks/useReportData.js";
import alertApi from "../api/alertApi.js";
import warehouseApi from "../api/warehouseApi.js";

const CHART_SERIES = [
    {
        key: "materialQuantity",
        label: GROUP_LABELS.MATERIAL,
        color: GROUP_COLORS.MATERIAL
    },
    {
        key: "productQuantity",
        label: GROUP_LABELS.PRODUCT,
        color: GROUP_COLORS.PRODUCT
    }
];

function AlertsPage() {

    const [warehouseId, setWarehouseId] = useState("");
    const [type, setType] = useState("");
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

    const alertRequest = useCallback(
        () => alertApi.getAlerts({
            warehouseId: warehouseId === "" ? undefined : warehouseId,
            type: type === "" ? undefined : type
        }),
        [warehouseId, type]
    );

    const lotRequest = useCallback(
        () => alertApi.getLotOverview({
            warehouseId: warehouseId === "" ? undefined : warehouseId
        }),
        [warehouseId]
    );

    const {
        data: alertData,
        loading: alertLoading,
        error: alertError,
        reload: reloadAlerts
    } = useReportData(alertRequest, [warehouseId, type]);

    const {
        data: lotData,
        loading: lotLoading,
        error: lotError,
        reload: reloadLots
    } = useReportData(lotRequest, [warehouseId]);

    const chartData = useMemo(
        () => (lotData?.expiryDistribution ?? []).map((bucket) => ({
            label: bucket.label,
            subLabel: `${bucket.materialLots + bucket.productLots} lô`,
            materialQuantity: bucket.materialQuantity,
            productQuantity: bucket.productQuantity
        })),
        [lotData]
    );

    const chartIsEmpty = chartData.every(
        (bucket) =>
            Number(bucket.materialQuantity) === 0 &&
            Number(bucket.productQuantity) === 0
    );

    const summary = alertData?.summary;
    const alerts = alertData?.alerts ?? [];
    const kpi = lotData?.kpi;
    const topLots = lotData?.topNearExpiryLots ?? [];

    return (
        <div>
            <PageHeader
                title="Trung tâm cảnh báo"
                description="Theo dõi ngưỡng cung ứng, rủi ro chất lượng và kiểm soát nội bộ theo dữ liệu tồn kho thời điểm hiện tại."
            />

            <ReportFilters>
                <FilterField label="Kho">
                    <FilterSelect
                        value={warehouseId}
                        onChange={(event) => setWarehouseId(event.target.value)}
                    >
                        <option value="">Tất cả</option>

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

                <FilterField label="Loại rủi ro">
                    <FilterSelect
                        value={type}
                        onChange={(event) => setType(event.target.value)}
                    >
                        {ALERT_TYPE_OPTIONS.map((option) => (
                            <option
                                key={option.value}
                                value={option.value}
                            >
                                {option.label}
                            </option>
                        ))}
                    </FilterSelect>
                </FilterField>
            </ReportFilters>

            {alertLoading && <Loading rows={6} />}

            {!alertLoading && alertError && (
                <ReportErrorState
                    message={alertError}
                    onRetry={reloadAlerts}
                />
            )}

            {!alertLoading && !alertError && alertData && (
                <div className="space-y-6">
                    <div className="grid gap-6 md:grid-cols-3">
                        <ReportKpiCard
                            title="Tất cả cảnh báo"
                            value={formatNumber(summary?.total)}
                            icon={<TriangleAlert size={22} />}
                            description="Tổng số cảnh báo đang mở theo bộ lọc hiện tại."
                        />

                        <ReportKpiCard
                            title="🔴 Nguy cấp (Cần xử lý ngay)"
                            value={formatNumber(summary?.critical)}
                            icon={<CircleAlert size={22} />}
                            tone="negative"
                            description="Hết tồn, lô đã/sắp hết hạn trong 60 ngày hoặc phiếu kiểm kê đã chốt lệch chờ cân bằng."
                        />

                        <ReportKpiCard
                            title="🟡 Cần chú ý (Theo dõi)"
                            value={formatNumber(summary?.warning)}
                            icon={<Eye size={22} />}
                            description="Dưới Min, vượt Max, lô cận date 60 - 90 ngày hoặc phiếu kiểm kê đang thực hiện."
                        />
                    </div>

                    {alerts.length === 0 ? (
                        <EmptyState
                            title="Không có cảnh báo"
                            description="Không có cảnh báo nào theo bộ lọc hiện tại."
                        />
                    ) : (
                        <AlertTable alerts={alerts} />
                    )}
                </div>
            )}

            <div className="mt-10 space-y-6">
                <h2 className="text-lg font-semibold text-gray-800">
                    Theo dõi lô hàng &amp; hạn sử dụng
                </h2>

                {lotLoading && <Loading rows={4} />}

                {!lotLoading && lotError && (
                    <ReportErrorState
                        message={lotError}
                        onRetry={reloadLots}
                    />
                )}

                {!lotLoading && !lotError && lotData && (
                    <>
                        <div className="grid gap-6 md:grid-cols-3">
                            <ReportKpiCard
                                title="Tổng số Lô đang tồn"
                                value={formatNumber(kpi?.totalLotsInStock)}
                                icon={<Boxes size={22} />}
                                description="Số lô có số lượng tồn lớn hơn 0."
                                rows={[
                                    {
                                        label: "Lô chưa khai báo HSD",
                                        value: formatNumber(kpi?.lotsWithoutExpiry)
                                    }
                                ]}
                            />

                            <ReportKpiCard
                                title="Số Lô Báo động đỏ"
                                value={formatNumber(kpi?.redAlertLots)}
                                icon={<CalendarClock size={22} />}
                                tone="negative"
                                description="Lô có HSD còn tối đa 60 ngày tính từ hôm nay."
                            />

                            <ReportKpiCard
                                title="Số Lô quá hạn"
                                value={formatNumber(kpi?.expiredLots)}
                                icon={<CircleSlash size={22} />}
                                tone="negative"
                                description="Lô có HSD trước ngày hiện tại nhưng vẫn còn tồn, không được phép xuất."
                                rows={[
                                    {
                                        label: "Giá trị vốn đọng",
                                        value: formatCurrency(kpi?.expiredLotValue)
                                    }
                                ]}
                            />
                        </div>

                        <ChartCard
                            title="Phân bổ hàng tồn kho theo khoảng thời gian cận date"
                            description="Số lượng tồn của các lô còn hạn sử dụng, tách theo nguyên vật liệu và sản phẩm."
                            legend={[
                                {
                                    label: GROUP_LABELS.MATERIAL,
                                    color: GROUP_COLORS.MATERIAL
                                },
                                {
                                    label: GROUP_LABELS.PRODUCT,
                                    color: GROUP_COLORS.PRODUCT
                                }
                            ]}
                            isEmpty={chartIsEmpty}
                            emptyMessage="Chưa có lô hàng nào khai báo hạn sử dụng."
                        >
                            <StackedBarChart
                                data={chartData}
                                series={CHART_SERIES}
                                formatValue={formatNumber}
                                formatTooltip={formatNumber}
                            />
                        </ChartCard>

                        <div>
                            <h3 className="mb-4 text-base font-semibold text-gray-800">
                                Top lô hàng cận date
                            </h3>

                            {topLots.length === 0 ? (
                                <EmptyState
                                    title="Chưa có lô cận date"
                                    description="Chưa có lô hàng nào khai báo hạn sử dụng."
                                />
                            ) : (
                                <NearExpiryLotTable lots={topLots} />
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default AlertsPage;
