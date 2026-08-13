import Badge from "../common/Badge.jsx";
import Card from "../common/Card.jsx";
import { formatNumber } from "../../utils/dashboardUtils.js";

function OperationAlerts({ data }) {

    const alerts = data ?? {};

    const belowMin = alerts.belowMin ?? [];
    const aboveMax = alerts.aboveMax ?? [];
    const nearExpiration = alerts.nearExpiration ?? [];

    return (
        <section>
            <div className="mb-5 space-y-1">
                <h2 className="text-2xl font-bold text-gray-800">
                    Trung tâm cảnh báo
                </h2>
                <p className="text-md text-gray-500">
                    Cảnh báo tồn kho cần xử lý ngay hôm nay.
                </p>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">

                {/* Below MIN */}
                <Card className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Dưới mức tối thiểu
                            </h3>
                            <p className="text-sm text-gray-500">
                                Hàng hóa dưới định mức an toàn
                            </p>
                        </div>
                        <Badge color={belowMin.length > 0 ? "red" : "green"}>
                            {belowMin.length} cảnh báo
                        </Badge>
                    </div>

                    {belowMin.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Không có hàng hóa dưới mức tối thiểu.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {belowMin.map((item) => (
                                <div
                                    key={item.code}
                                    className="rounded-xl border border-gray-100 p-4"
                                >
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.code}
                                            </p>
                                        </div>
                                        <Badge color="red">
                                            Thiếu {formatNumber(item.minQuantity - item.currentQuantity)} {item.unit}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-500">Hiện tại</p>
                                            <p className="font-semibold text-gray-800">
                                                {formatNumber(item.currentQuantity)} {item.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Tối thiểu</p>
                                            <p className="font-semibold text-gray-800">
                                                {formatNumber(item.minQuantity)} {item.unit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Above MAX */}
                <Card className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Vượt mức tối đa
                            </h3>
                            <p className="text-sm text-gray-500">
                                Hàng hóa vượt định mức tối đa
                            </p>
                        </div>
                        <Badge color={aboveMax.length > 0 ? "yellow" : "green"}>
                            {aboveMax.length} cảnh báo
                        </Badge>
                    </div>

                    {aboveMax.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Không có hàng hóa vượt mức tối đa.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {aboveMax.map((item) => (
                                <div
                                    key={item.code}
                                    className="rounded-xl border border-gray-100 p-4"
                                >
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.code}
                                            </p>
                                        </div>
                                        <Badge color="yellow">
                                            Vượt {formatNumber(item.currentQuantity - item.maxQuantity)} {item.unit}
                                        </Badge>
                                    </div>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <p className="text-gray-500">Hiện tại</p>
                                            <p className="font-semibold text-gray-800">
                                                {formatNumber(item.currentQuantity)} {item.unit}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-gray-500">Tối đa</p>
                                            <p className="font-semibold text-gray-800">
                                                {formatNumber(item.maxQuantity)} {item.unit}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

                {/* Near Expiration (FEFO) */}
                <Card className="p-6">
                    <div className="mb-5 flex items-center justify-between">
                        <div>
                            <h3 className="text-lg font-semibold text-gray-800">
                                Sắp hết hạn
                            </h3>
                            <p className="text-sm text-gray-500">
                                Lô hàng hết hạn trong 60 ngày (FEFO)
                            </p>
                        </div>
                        <Badge color={nearExpiration.length > 0 ? "yellow" : "green"}>
                            {nearExpiration.length} lô
                        </Badge>
                    </div>

                    {nearExpiration.length === 0 ? (
                        <p className="py-8 text-center text-sm text-gray-500">
                            Không có lô hàng sắp hết hạn.
                        </p>
                    ) : (
                        <div className="space-y-3">
                            {nearExpiration.map((item) => (
                                <div
                                    key={item.code}
                                    className="rounded-xl border border-gray-100 p-4"
                                >
                                    <div className="mb-2 flex items-start justify-between gap-3">
                                        <div>
                                            <p className="font-semibold text-gray-800">
                                                {item.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {item.code}
                                            </p>
                                        </div>
                                        <Badge color={item.daysLeft <= 30 ? "red" : "yellow"}>
                                            Còn {item.daysLeft} ngày
                                        </Badge>
                                    </div>
                                    <div className="text-sm">
                                        <p className="text-gray-500">Ngày hết hạn</p>
                                        <p className="font-semibold text-gray-800">
                                            {item.expirationDate}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </Card>

            </div>
        </section>
    );

}

export default OperationAlerts;
