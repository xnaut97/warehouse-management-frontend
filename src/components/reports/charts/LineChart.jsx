import { AXIS_COLOR, LABEL_COLOR } from "./chartTheme.js";
import { formatCompactCurrency, toNumber } from "../reportUtils.js";

const PADDING_LEFT = 64;
const PADDING_RIGHT = 24;
const PLOT_TOP = 24;
const PLOT_HEIGHT = 170;

function LineChart({
                       data = [],
                       color = "#ec7fa9",
                       formatValue = formatCompactCurrency,
                       formatTooltip = formatCompactCurrency
                   }) {

    const points = data.map((item) => ({
        label: item.label,
        value: toNumber(item.value)
    }));

    const values = points.map((point) => point.value);

    const rawMax = Math.max(0, ...values);
    const rawMin = Math.min(0, ...values);

    const max = rawMax === rawMin
        ? rawMax + 1
        : rawMax;

    const min = rawMin;

    const plotWidth = Math.max(420, points.length * 78);
    const width = plotWidth + PADDING_LEFT + PADDING_RIGHT;
    const height = PLOT_TOP + PLOT_HEIGHT + 46;
    const baseline = PLOT_TOP + PLOT_HEIGHT;

    const stepX = points.length > 1
        ? plotWidth / (points.length - 1)
        : 0;

    const toX = (index) => points.length === 1
        ? PADDING_LEFT + plotWidth / 2
        : PADDING_LEFT + index * stepX;

    const toY = (value) =>
        baseline - ((value - min) / (max - min)) * PLOT_HEIGHT;

    const linePoints = points
        .map((point, index) => `${toX(index)},${toY(point.value)}`)
        .join(" ");

    const areaPoints = points.length > 0
        ? `${PADDING_LEFT},${baseline} ${linePoints} ${toX(points.length - 1)},${baseline}`
        : "";

    const gridRatios = [0, 0.25, 0.5, 0.75, 1];

    return (
        <div className="overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-64 min-w-full sm:h-72"
                role="img"
                aria-label="Biểu đồ đường"
            >
                {gridRatios.map((ratio) => {
                    const value = min + (max - min) * ratio;
                    const y = baseline - ratio * PLOT_HEIGHT;

                    return (
                        <g key={ratio}>
                            <line
                                x1={PADDING_LEFT}
                                x2={width - PADDING_RIGHT}
                                y1={y}
                                y2={y}
                                stroke={AXIS_COLOR}
                                strokeDasharray={ratio === 0 ? "0" : "5 6"}
                            />
                            <text
                                x={PADDING_LEFT - 8}
                                y={y + 4}
                                textAnchor="end"
                                fill={LABEL_COLOR}
                                fontSize="11"
                            >
                                {formatValue(value)}
                            </text>
                        </g>
                    );
                })}

                {points.length > 1 && (
                    <polygon
                        points={areaPoints}
                        fill={color}
                        opacity="0.12"
                    />
                )}

                <polyline
                    points={linePoints}
                    fill="none"
                    stroke={color}
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {points.map((point, index) => (
                    <g key={point.label ?? index}>
                        <circle
                            cx={toX(index)}
                            cy={toY(point.value)}
                            r="5"
                            fill="#ffffff"
                            stroke={color}
                            strokeWidth="3"
                        />
                        <text
                            x={toX(index)}
                            y={baseline + 24}
                            textAnchor="middle"
                            fill={LABEL_COLOR}
                            fontSize="11"
                        >
                            {point.label}
                        </text>
                        <title>
                            {`${point.label}: ${formatTooltip(point.value)}`}
                        </title>
                    </g>
                ))}
            </svg>
        </div>
    );
}

export default LineChart;
