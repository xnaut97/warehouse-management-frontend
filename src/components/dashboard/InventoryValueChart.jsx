import Card from "../common/Card.jsx";
import { formatCurrency, formatNumber, toNumber } from "../../utils/dashboardUtils.js";

function InventoryValueChart({ data }) {

    const rawMaterials = toNumber(data?.rawMaterialInventory);
    const finishedProducts = toNumber(data?.finishedProductInventory);
    const total = Math.max(rawMaterials + finishedProducts, 1);

    const rawPercent = (rawMaterials / total) * 100;
    const finishedPercent = (finishedProducts / total) * 100;

    return (
        <Card className="p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Giá trị tồn kho
                </h3>
                <p className="text-sm text-gray-500">
                    Tổng giá trị và cơ cấu mặt hàng đang theo dõi
                </p>
            </div>

            <div className="mb-6 rounded-2xl bg-pink-50 p-5">
                <p className="text-sm text-gray-500">
                    Tổng giá trị tồn kho
                </p>
                <p className="mt-2 text-3xl font-bold text-gray-800">
                    {formatCurrency(data?.inventoryValue)}
                </p>
            </div>

            <div className="space-y-5">
                <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">
                            Nguyên vật liệu
                        </span>
                        <span className="text-gray-500">
                            {formatNumber(rawMaterials)}
                        </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-pink-400"
                            style={{ width: `${rawPercent}%` }}
                        />
                    </div>
                </div>

                <div>
                    <div className="mb-2 flex items-center justify-between text-sm">
                        <span className="font-medium text-gray-700">
                            Sản phẩm
                        </span>
                        <span className="text-gray-500">
                            {formatNumber(finishedProducts)}
                        </span>
                    </div>
                    <div className="h-3 overflow-hidden rounded-full bg-gray-100">
                        <div
                            className="h-full rounded-full bg-sky-400"
                            style={{ width: `${finishedPercent}%` }}
                        />
                    </div>
                </div>
            </div>
        </Card>
    );

}

export default InventoryValueChart;
