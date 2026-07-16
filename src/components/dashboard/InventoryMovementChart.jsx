import Card from "../common/Card.jsx";
import { formatMonth, formatNumber, toNumber } from "../../utils/dashboardUtils.js";

function InventoryMovementChart({ data = [] }) {

    const chartData = data.length > 0
        ? data
        : [];

    const maxValue = Math.max(
        1,
        ...chartData.flatMap((item) => [
            toNumber(item.stockIn),
            toNumber(item.stockOut),
            Math.abs(toNumber(item.stockBalance))
        ])
    );

    const width = Math.max(520, chartData.length * 64);
    const height = 260;
    const baseline = 190;
    const barWidth = 14;
    const gap = width / Math.max(chartData.length, 1);

    const linePoints = chartData
        .map((item, index) => {
            const x = gap * index + gap / 2;
            const y = baseline - (toNumber(item.stockBalance) / maxValue) * 130;

            return `${x},${Math.max(34, Math.min(226, y))}`;
        })
        .join(" ");

    return (
        <Card className="overflow-hidden p-6">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800">
                        Biến động tồn kho
                    </h3>
                    <p className="text-sm text-gray-500">
                        Nhập kho, xuất kho và tồn cuối theo tháng
                    </p>
                </div>

                <div className="flex gap-4 text-xs text-gray-500">
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                        Nhập
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                        Xuất
                    </span>
                    <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full bg-sky-500" />
                        Tồn cuối
                    </span>
                </div>
            </div>

            {chartData.length === 0 ? (
                <p className="py-16 text-center text-sm text-gray-500">
                    Chưa có dữ liệu biến động tồn kho.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="h-72 min-w-full"
                        role="img"
                        aria-label="Biểu đồ biến động tồn kho"
                    >
                        {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                            const y = baseline - ratio * 130;

                            return (
                                <g key={ratio}>
                                    <line
                                        x1="0"
                                        x2={width}
                                        y1={y}
                                        y2={y}
                                        stroke="#f1d6df"
                                    />
                                    <text
                                        x="0"
                                        y={y - 6}
                                        fill="#9ca3af"
                                        fontSize="11"
                                    >
                                        {formatNumber(maxValue * ratio)}
                                    </text>
                                </g>
                            );
                        })}

                        {chartData.map((item, index) => {
                            const x = gap * index + gap / 2;
                            const stockInHeight = (toNumber(item.stockIn) / maxValue) * 130;
                            const stockOutHeight = (toNumber(item.stockOut) / maxValue) * 130;

                            return (
                                <g key={item.month ?? index}>
                                    <rect
                                        x={x - barWidth - 2}
                                        y={baseline - stockInHeight}
                                        width={barWidth}
                                        height={stockInHeight}
                                        rx="4"
                                        fill="#34d399"
                                    />
                                    <rect
                                        x={x + 2}
                                        y={baseline - stockOutHeight}
                                        width={barWidth}
                                        height={stockOutHeight}
                                        rx="4"
                                        fill="#fb7185"
                                    />
                                    <text
                                        x={x}
                                        y="228"
                                        textAnchor="middle"
                                        fill="#6b7280"
                                        fontSize="12"
                                    >
                                        {formatMonth(item.month)}
                                    </text>
                                </g>
                            );
                        })}

                        <polyline
                            points={linePoints}
                            fill="none"
                            stroke="#0ea5e9"
                            strokeWidth="3"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            )}
        </Card>
    );

}

export default InventoryMovementChart;
