import Card from "../common/Card.jsx";
import { formatCurrency, formatNumber, toNumber } from "../../utils/dashboardUtils.js";

function VarianceChart({ items = [] }) {

    const chartItems = items.slice(0, 8);
    const maxValue = Math.max(
        1,
        ...chartItems.map((item) => Math.abs(toNumber(item.varianceQuantity)))
    );

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Top mặt hàng chênh lệch lớn
                </h3>
                <p className="text-sm text-gray-500">
                    Xếp theo số lượng chênh lệch kiểm kê
                </p>
            </div>

            {chartItems.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-500">
                    Chưa có dữ liệu chênh lệch kiểm kê.
                </p>
            ) : (
                <div className="space-y-4">
                    {chartItems.map((item) => {
                        const quantity = toNumber(item.varianceQuantity);
                        const percent = Math.abs(quantity) / maxValue * 100;
                        const isNegative = quantity < 0;

                        return (
                            <div key={`${item.materialCode}-${item.materialName}`}>
                                <div className="mb-2 flex items-start justify-between gap-4 text-sm">
                                    <div>
                                        <p className="font-medium text-gray-800">
                                            {item.materialName}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {item.materialCode}
                                        </p>
                                    </div>
                                    <div className="text-right">
                                        <p className={isNegative ? "font-semibold text-red-600" : "font-semibold text-emerald-600"}>
                                            {formatNumber(quantity)}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {formatCurrency(item.varianceValue)}
                                        </p>
                                    </div>
                                </div>
                                <div className="h-2.5 overflow-hidden rounded-full bg-gray-100">
                                    <div
                                        className={isNegative ? "h-full rounded-full bg-red-400" : "h-full rounded-full bg-emerald-400"}
                                        style={{ width: `${percent}%` }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </Card>
    );

}

export default VarianceChart;
