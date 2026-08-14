import Badge from "../common/Badge.jsx";
import {
    formatCurrency,
    formatDate,
    formatNumber
} from "../reports/reportUtils.js";
import { GROUP_SHORT_LABELS } from "./alertConstants.js";

function NearExpiryLotTable({ lots = [] }) {
    return (
        <div className="overflow-x-auto rounded-2xl border border-(--color-border) bg-white shadow-sm">
            <table className="w-full min-w-[1080px]">
                <thead className="border-b border-pink-100">
                    <tr>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            Mã vật tư
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            Tên vật tư
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            Phân loại
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            Số Lô
                        </th>
                        <th className="px-5 py-4 text-left text-sm font-semibold text-gray-600">
                            HSD
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                            SL Tồn Lô
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                            Giá trung bình
                        </th>
                        <th className="px-5 py-4 text-right text-sm font-semibold text-gray-600">
                            Giá trị vốn đọng
                        </th>
                    </tr>
                </thead>

                <tbody>
                    {lots.map((lot, index) => (
                        <tr
                            key={`${lot.warehouseId}-${lot.itemCode}-${lot.lotNumber}-${index}`}
                            className="border-b border-pink-100 transition hover:bg-pink-50"
                        >
                            <td className="px-5 py-4 text-sm font-semibold text-gray-700">
                                {lot.itemCode}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                                {lot.itemName}
                                <div className="mt-1 text-xs text-gray-400">
                                    {lot.warehouseName}
                                </div>
                            </td>

                            <td className="px-5 py-4">
                                <Badge
                                    color={
                                        lot.group === "PRODUCT"
                                            ? "pink"
                                            : "gray"
                                    }
                                >
                                    {GROUP_SHORT_LABELS[lot.group] ?? lot.group}
                                </Badge>
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                                {lot.lotNumber ?? "--"}
                            </td>

                            <td className="px-5 py-4 text-sm text-gray-700">
                                {formatDate(lot.expirationDate)}

                                <div className="mt-1 text-xs text-gray-400">
                                    {lot.daysToExpiry < 0
                                        ? `Quá hạn ${Math.abs(lot.daysToExpiry)} ngày`
                                        : `Còn ${lot.daysToExpiry} ngày`}
                                </div>
                            </td>

                            <td className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                                {formatNumber(lot.lotQuantity)} {lot.unit}

                                {!lot.lotTracked && (
                                    <div className="mt-1 text-xs font-normal text-gray-400">
                                        SL nhập theo phiếu
                                    </div>
                                )}
                            </td>

                            <td className="px-5 py-4 text-right text-sm text-gray-700">
                                {formatCurrency(lot.averagePrice)}
                            </td>

                            <td className="px-5 py-4 text-right text-sm font-semibold text-gray-700">
                                {formatCurrency(lot.stockValue)}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default NearExpiryLotTable;
