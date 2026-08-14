import { AXIS_COLOR, LABEL_COLOR } from "./chartTheme.js";
import { formatNumber, toNumber } from "../reportUtils.js";

const PADDING_LEFT = 64;
const PADDING_RIGHT = 24;
const PLOT_TOP = 20;
const PLOT_HEIGHT = 190;
const BAR_WIDTH = 44;

function StackedBarChart({
                             data = [],
                             series = [],
                             formatValue = formatNumber,
                             formatTooltip = formatNumber
                         }) {

    const totals = data.map((item) =>
        series.reduce(
            (sum, entry) => sum + Math.abs(toNumber(item[entry.key])),
            0
        )
    );

    const maxValue = Math.max(1, ...totals);

    const plotWidth = Math.max(420, data.length * 96);
    const width = plotWidth + PADDING_LEFT + PADDING_RIGHT;
    const height = PLOT_TOP + PLOT_HEIGHT + 52;
    const baseline = PLOT_TOP + PLOT_HEIGHT;
    const step = plotWidth / Math.max(data.length, 1);

    return (
        <div className="overflow-x-auto">
            <svg
                viewBox={`0 0 ${width} ${height}`}
                className="h-72 min-w-full"
                role="img"
                aria-label="Biểu đồ cột chồng"
            >
                {[0, 0.25, 0.5, 0.75, 1].map((ratio) => {
                    const y = baseline - ratio * PLOT_HEIGHT;

                    return (
                        <g key={ratio}>
                            <line
                                x1={PADDING_LEFT}
                                x2={width - PADDING_RIGHT}
                                y1={y}
                                y2={y}
                                stroke={AXIS_COLOR}
                            />
                            <text
                                x={PADDING_LEFT - 8}
                                y={y + 4}
                                textAnchor="end"
                                fill={LABEL_COLOR}
                                fontSize="11"
                            >
                                {formatValue(maxValue * ratio)}
                            </text>
                        </g>
                    );
                })}

                {data.map((item, index) => {
                    const center = PADDING_LEFT + step * index + step / 2;
                    const x = center - BAR_WIDTH / 2;

                    let cursor = baseline;

                    return (
                        <g key={item.label ?? index}>
                            {series.map((entry) => {
                                const value = Math.abs(toNumber(item[entry.key]));

                                if (value <= 0) {
                                    return null;
                                }

                                const segmentHeight =
                                    (value / maxValue) * PLOT_HEIGHT;

                                cursor -= segmentHeight;

                                return (
                                    <rect
                                        key={entry.key}
                                        x={x}
                                        y={cursor}
                                        width={BAR_WIDTH}
                                        height={Math.max(segmentHeight, 2)}
                                        fill={entry.color}
                                    >
                                        <title>
                                            {`${item.label} - ${entry.label}: ${formatTooltip(item[entry.key])}`}
                                        </title>
                                    </rect>
                                );
                            })}

                            {totals[index] > 0 && (
                                <text
                                    x={center}
                                    y={cursor - 8}
                                    textAnchor="middle"
                                    fill={LABEL_COLOR}
                                    fontSize="11"
                                    fontWeight="600"
                                >
                                    {formatValue(totals[index])}
                                </text>
                            )}

                            <text
                                x={center}
                                y={baseline + 22}
                                textAnchor="middle"
                                fill={LABEL_COLOR}
                                fontSize="11"
                            >
                                {item.label}
                            </text>

                            {item.subLabel && (
                                <text
                                    x={center}
                                    y={baseline + 38}
                                    textAnchor="middle"
                                    fill="#9ca3af"
                                    fontSize="10"
                                >
                                    {item.subLabel}
                                </text>
                            )}
                        </g>
                    );
                })}
            </svg>
        </div>
    );
}

export default StackedBarChart;
