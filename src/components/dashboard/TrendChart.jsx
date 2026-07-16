import Card from "../common/Card.jsx";
import { formatMonth, formatNumber, toNumber } from "../../utils/dashboardUtils.js";

function TrendChart({ data = [] }) {

    const chartData = data;
    const maxValue = Math.max(
        1,
        ...chartData.map((item) => Math.abs(toNumber(item.stockBalance)))
    );

    const width = Math.max(520, chartData.length * 60);
    const height = 220;
    const baseline = 150;
    const step = width / Math.max(chartData.length - 1, 1);

    const points = chartData
        .map((item, index) => {
            const x = chartData.length === 1
                ? width / 2
                : index * step;
            const y = baseline - (toNumber(item.stockBalance) / maxValue) * 100;

            return `${x},${Math.max(32, Math.min(184, y))}`;
        })
        .join(" ");

    return (
        <Card className="overflow-hidden p-6">
            <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-800">
                    Xu hướng tồn kho theo thời gian
                </h3>
                <p className="text-sm text-gray-500">
                    Tồn cuối được tính từ nhập kho trừ xuất kho
                </p>
            </div>

            {chartData.length === 0 ? (
                <p className="py-12 text-center text-sm text-gray-500">
                    Chưa có dữ liệu xu hướng tồn kho.
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <svg
                        viewBox={`0 0 ${width} ${height}`}
                        className="h-64 min-w-full"
                        role="img"
                        aria-label="Biểu đồ xu hướng tồn kho"
                    >
                        <line
                            x1="0"
                            x2={width}
                            y1={baseline}
                            y2={baseline}
                            stroke="#f1d6df"
                            strokeDasharray="6 6"
                        />

                        <polyline
                            points={points}
                            fill="none"
                            stroke="#ec7fa9"
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                        />

                        {chartData.map((item, index) => {
                            const x = chartData.length === 1
                                ? width / 2
                                : index * step;
                            const y = baseline - (toNumber(item.stockBalance) / maxValue) * 100;

                            return (
                                <g key={item.month ?? index}>
                                    <circle
                                        cx={x}
                                        cy={Math.max(32, Math.min(184, y))}
                                        r="5"
                                        fill="#ffffff"
                                        stroke="#ec7fa9"
                                        strokeWidth="3"
                                    />
                                    <text
                                        x={x}
                                        y="204"
                                        textAnchor="middle"
                                        fill="#6b7280"
                                        fontSize="12"
                                    >
                                        {formatMonth(item.month)}
                                    </text>
                                    <title>
                                        {`${formatMonth(item.month)}: ${formatNumber(item.stockBalance)}`}
                                    </title>
                                </g>
                            );
                        })}
                    </svg>
                </div>
            )}
        </Card>
    );

}

export default TrendChart;
