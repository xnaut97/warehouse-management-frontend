import Badge from "../common/Badge.jsx";
import AlertSeverityBadge from "./AlertSeverityBadge.jsx";
import { formatDate } from "../reports/reportUtils.js";
import {
    ALERT_TYPE_LABELS,
    GROUP_SHORT_LABELS,
    RISK_GROUP_LABELS
} from "./alertConstants.js";

function AlertTable({ alerts = [] }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="w-full min-w-[1080px]">
                <thead className="border-b border-pink-100">
                    <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            STT
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            MỨC ĐỘ
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            NHÓM CẢNH BÁO
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            MÃ - NVL/SẢN PHẨM
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            SỐ LÔ
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            HSD
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            TÌNH TRẠNG CHI TIẾT
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {alerts.map((alert, index) => (
                        <tr
                            key={`${alert.type}-${alert.warehouseId}-${alert.itemCode}-${alert.lotNumber ?? "no-lot"}-${index}`}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >
                            <td className="px-5 py-4 text-sm text-gray-500">
                                {index + 1}
                            </td>

                            <td className="px-5 py-4">
                                <AlertSeverityBadge severity={alert.severity} />
                            </td>

                            <td className="px-5 py-4">
                                <div className="text-sm font-medium text-gray-700">
                                    {RISK_GROUP_LABELS[alert.riskGroup] ?? alert.riskGroup}
                                </div>
                                <div className="mt-1 text-xs text-gray-400">
                                    {ALERT_TYPE_LABELS[alert.type] ?? alert.type}
                                </div>
                            </td>

                            <td className="px-5 py-4">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700">
                                        {alert.itemCode}
                                    </span>
                                    <Badge
                                        color={
                                            alert.group === "PRODUCT"
                                                ? "pink"
                                                : "gray"
                                        }
                                    >
                                        {GROUP_SHORT_LABELS[alert.group] ?? alert.group}
                                    </Badge>
                                </div>
                                <div className="mt-1 text-xs text-gray-500">
                                    {alert.itemName}
                                </div>
                                <div className="mt-1 text-xs text-gray-400">
                                    {alert.warehouseName}
                                </div>
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                                {alert.lotNumber ?? "--"}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                                {alert.expirationDate
                                    ? formatDate(alert.expirationDate)
                                    : "--"}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-600">
                                {alert.detail}

                                {alert.lotNumber && !alert.lotTracked && (
                                    <div className="mt-1 text-xs text-gray-400">
                                        Lô nguyên vật liệu ghi nhận theo phiếu nhập,
                                        hệ thống chưa theo dõi tồn theo lô.
                                    </div>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AlertTable;
