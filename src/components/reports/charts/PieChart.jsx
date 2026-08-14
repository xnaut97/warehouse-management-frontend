import { colorAt } from "./chartTheme.js";
import { formatPercent, toNumber } from "../reportUtils.js";

const SIZE = 220;
const RADIUS = 100;
const CENTER = SIZE / 2;

const toCoordinate = (angle, radius) => ({
    x: CENTER + radius * Math.cos(angle),
    y: CENTER + radius * Math.sin(angle)
});

function PieChart({
                      data = [],
                      innerRadius = 0,
                      formatValue = (value) => value,
                      centerLabel,
                      centerValue
                  }) {

    const slices = data
        .map((item, index) => ({
            label: item.label,
            value: Math.abs(toNumber(item.value)),
            color: item.color ?? colorAt(index)
        }))
        .filter((item) => item.value > 0);

    const total = slices.reduce((sum, item) => sum + item.value, 0);

    const paths = slices.reduce((accumulator, slice) => {
        const share = slice.value / total;
        const startAngle = accumulator.length === 0
            ? -Math.PI / 2
            : accumulator[accumulator.length - 1].endAngle;

        accumulator.push({
            ...slice,
            share,
            startAngle,
            endAngle: startAngle + share * Math.PI * 2
        });

        return accumulator;
    }, []);

    const isFullCircle = paths.length === 1;

    return (
        <div className="flex flex-col items-center gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative">
                <svg
                    viewBox={`0 0 ${SIZE} ${SIZE}`}
                    className="h-52 w-52 sm:h-56 sm:w-56"
                    role="img"
                    aria-label="Biểu đồ tròn"
                >
                    {isFullCircle ? (
                        <g>
                            <circle
                                cx={CENTER}
                                cy={CENTER}
                                r={RADIUS}
                                fill={paths[0].color}
                            />
                            {innerRadius > 0 && (
                                <circle
                                    cx={CENTER}
                                    cy={CENTER}
                                    r={innerRadius}
                                    fill="#ffffff"
                                />
                            )}
                            <title>
                                {`${paths[0].label}: ${formatValue(paths[0].value)}`}
                            </title>
                        </g>
                    ) : (
                        paths.map((slice) => {
                            const outerStart = toCoordinate(slice.startAngle, RADIUS);
                            const outerEnd = toCoordinate(slice.endAngle, RADIUS);
                            const largeArc = slice.endAngle - slice.startAngle > Math.PI
                                ? 1
                                : 0;

                            const d = innerRadius > 0
                                ? [
                                    `M ${outerStart.x} ${outerStart.y}`,
                                    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
                                    `L ${toCoordinate(slice.endAngle, innerRadius).x} ${toCoordinate(slice.endAngle, innerRadius).y}`,
                                    `A ${innerRadius} ${innerRadius} 0 ${largeArc} 0 ${toCoordinate(slice.startAngle, innerRadius).x} ${toCoordinate(slice.startAngle, innerRadius).y}`,
                                    "Z"
                                ].join(" ")
                                : [
                                    `M ${CENTER} ${CENTER}`,
                                    `L ${outerStart.x} ${outerStart.y}`,
                                    `A ${RADIUS} ${RADIUS} 0 ${largeArc} 1 ${outerEnd.x} ${outerEnd.y}`,
                                    "Z"
                                ].join(" ");

                            return (
                                <path
                                    key={slice.label}
                                    d={d}
                                    fill={slice.color}
                                    stroke="#ffffff"
                                    strokeWidth="2"
                                >
                                    <title>
                                        {`${slice.label}: ${formatValue(slice.value)} (${formatPercent(slice.share * 100)})`}
                                    </title>
                                </path>
                            );
                        })
                    )}
                </svg>

                {innerRadius > 0 && centerValue && (
                    <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center text-center">
                        <span className="text-xs text-gray-500">
                            {centerLabel}
                        </span>
                        <span className="mt-1 px-6 text-sm font-semibold break-words text-gray-800">
                            {centerValue}
                        </span>
                    </div>
                )}
            </div>

            <ul className="w-full space-y-3 lg:max-w-xs">
                {paths.map((slice) => (
                    <li
                        key={slice.label}
                        className="flex items-start justify-between gap-3 text-sm"
                    >
                        <span className="flex min-w-0 items-center gap-2">
                            <span
                                className="h-2.5 w-2.5 shrink-0 rounded-full"
                                style={{ backgroundColor: slice.color }}
                            />
                            <span className="truncate text-gray-700">
                                {slice.label}
                            </span>
                        </span>

                        <span className="shrink-0 text-right">
                            <span className="block font-semibold text-gray-800">
                                {formatPercent(slice.share * 100)}
                            </span>
                            <span className="block text-xs text-gray-500">
                                {formatValue(slice.value)}
                            </span>
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PieChart;
