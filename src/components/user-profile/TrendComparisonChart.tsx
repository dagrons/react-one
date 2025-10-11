import { TrendPoint } from "@/data/userProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import * as d3 from "d3";

interface TrendComparisonChartProps {
    points: TrendPoint[];
    className?: string;
}

const SVG_DIMENSIONS = {
    width: 640,
    height: 280,
    marginTop: 24,
    marginRight: 24,
    marginBottom: 40,
    marginLeft: 48,
};

const TrendComparisonChart = ({ points, className }: TrendComparisonChartProps) => {
    const { personalPath, deptPath, loginArea, yTicks, xTicks, yScale, xPositions } = useMemo(() => {
        if (!points.length) {
            return {
                personalPath: "",
                deptPath: "",
                loginArea: "",
                yTicks: [] as number[],
                xTicks: [] as { position: number; label: string }[],
                yScale: () => 0,
                xPositions: [] as number[],
            };
        }

        const { width, height, marginBottom, marginLeft, marginRight, marginTop } = SVG_DIMENSIONS;
        const innerWidth = width - marginLeft - marginRight;
        const innerHeight = height - marginTop - marginBottom;

        const xScale = d3
            .scaleLinear()
            .domain([0, Math.max(points.length - 1, 1)])
            .range([0, innerWidth]);

        const maxValue = Math.max(
            d3.max(points, (p) => p.entryCount) ?? 0,
            d3.max(points, (p) => p.departmentEntryAvg) ?? 0,
            d3.max(points, (p) => p.loginCount) ?? 0
        );

        const yScaleInternal = d3
            .scaleLinear()
            .domain([0, maxValue * 1.1])
            .range([innerHeight, 0]);

        const linePersonal = d3
            .line<TrendPoint>()
            .x((_, index) => xScale(index))
            .y((d) => yScaleInternal(d.entryCount))
            .curve(d3.curveCatmullRom.alpha(0.8));

        const lineDept = d3
            .line<TrendPoint>()
            .x((_, index) => xScale(index))
            .y((d) => yScaleInternal(d.departmentEntryAvg))
            .curve(d3.curveCatmullRom.alpha(0.8));

        const areaLogin = d3
            .area<TrendPoint>()
            .x((_, index) => xScale(index))
            .y0(() => yScaleInternal(0))
            .y1((d) => yScaleInternal(d.loginCount))
            .curve(d3.curveCatmullRom.alpha(0.7));

        const yTicksInternal = yScaleInternal.ticks(4).filter((tick) => tick >= 0);
        const xTicksInternal = points.map((p, index) => ({
            position: xScale(index),
            label: formatDateLabel(p.date),
        }));

        return {
            personalPath: linePersonal(points) ?? "",
            deptPath: lineDept(points) ?? "",
            loginArea: areaLogin(points) ?? "",
            yTicks: yTicksInternal,
            xTicks: xTicksInternal.map((tick) => ({
                ...tick,
                position: tick.position ?? 0,
            })),
            yScale: yScaleInternal,
            xPositions: points.map((_, index) => xScale(index)),
        };
    }, [points]);

    return (
        <Card className={cn("border-slate-800/60 bg-slate-950/90 text-slate-100", className)}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <div>
                    <CardTitle className="text-lg font-semibold text-white">门禁 vs 系统访问趋势</CardTitle>
                    <p className="text-xs text-slate-400">对比个人数据与部门均值，辅助识别异常频次</p>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-300">
                    <LegendDot className="bg-sky-400" label="个人门禁频次" />
                    <LegendDot className="bg-emerald-400" label="部门平均" />
                    <LegendDot className="bg-indigo-500" label="系统访问量" hollow />
                </div>
            </CardHeader>
            <CardContent className="pt-4">
                <div className="overflow-hidden rounded-xl border border-slate-800/70 bg-slate-900/60">
                    <svg
                        viewBox={`0 0 ${SVG_DIMENSIONS.width} ${SVG_DIMENSIONS.height}`}
                        preserveAspectRatio="none"
                        className="w-full"
                    >
                        <defs>
                            <linearGradient id="loginAreaGradient" x1="0" x2="0" y1="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.45" />
                                <stop offset="100%" stopColor="#312e81" stopOpacity="0.05" />
                            </linearGradient>
                        </defs>

                        <g transform={`translate(${SVG_DIMENSIONS.marginLeft},${SVG_DIMENSIONS.marginTop})`}>
                            <GridLines
                                yTicks={yTicks}
                                width={SVG_DIMENSIONS.width - SVG_DIMENSIONS.marginLeft - SVG_DIMENSIONS.marginRight}
                                yScale={yScale}
                            />
                            {loginArea && (
                                <path
                                    d={loginArea}
                                    fill="url(#loginAreaGradient)"
                                    stroke="none"
                                    opacity={0.9}
                                />
                            )}
                            {personalPath && (
                                <path
                                    d={personalPath}
                                    fill="none"
                                    stroke="#38bdf8"
                                    strokeWidth={3}
                                />
                            )}
                            {deptPath && (
                                <path
                                    d={deptPath}
                                    fill="none"
                                    stroke="#34d399"
                                    strokeWidth={2}
                                    strokeDasharray="6 6"
                                />
                            )}

                            {points.map((point, index) => {
                                const x = xPositions[index] ?? 0;
                                return (
                                    <circle
                                        key={point.date}
                                        cx={x}
                                        cy={yScale(point.entryCount)}
                                        r={4}
                                        fill="#38bdf8"
                                        stroke="#0f172a"
                                        strokeWidth={2}
                                    />
                                );
                            })}

                            <Axis
                                xTicks={xTicks}
                                yTicks={yTicks}
                                height={SVG_DIMENSIONS.height - SVG_DIMENSIONS.marginTop - SVG_DIMENSIONS.marginBottom}
                                width={SVG_DIMENSIONS.width - SVG_DIMENSIONS.marginLeft - SVG_DIMENSIONS.marginRight}
                                yScale={yScale}
                            />
                        </g>
                    </svg>
                </div>
            </CardContent>
        </Card>
    );
};

const Axis = ({
    xTicks,
    yTicks,
    height,
    width,
    yScale,
}: {
    xTicks: { position: number; label: string }[];
    yTicks: number[];
    height: number;
    width: number;
    yScale: d3.ScaleLinear<number, number>;
}) => {
    return (
        <>
            <g transform={`translate(0, ${height})`}>
                <line x1={0} x2={width} stroke="#1e293b" strokeWidth={1} />
                {xTicks.map((tick) => (
                    <g key={tick.label} transform={`translate(${tick.position}, 0)`}>
                        <line y2={6} stroke="#1e293b" strokeWidth={1} />
                        <text
                            y={20}
                            textAnchor="middle"
                            fill="#94a3b8"
                            fontSize="11"
                        >
                            {tick.label}
                        </text>
                    </g>
                ))}
            </g>
            <g>
                {yTicks.map((tick) => {
                    const y = yScale(tick);
                    return (
                        <g key={tick} transform={`translate(0, ${y})`}>
                            <line
                                x2={width}
                                stroke="#1e293b"
                                strokeDasharray="4 6"
                                strokeWidth={1}
                                opacity={0.4}
                            />
                            <text
                                x={-12}
                                textAnchor="end"
                                alignmentBaseline="middle"
                                fill="#94a3b8"
                                fontSize="11"
                            >
                                {tick}
                            </text>
                        </g>
                    );
                })}
            </g>
        </>
    );
};

const GridLines = ({
    yTicks,
    width,
    yScale,
}: {
    yTicks: number[];
    width: number;
    yScale: d3.ScaleLinear<number, number>;
}) => (
    <>
        {yTicks.map((tick) => {
            const y = yScale(tick);
            return (
                <line
                    key={tick}
                    x1={0}
                    x2={width}
                    y1={y}
                    y2={y}
                    stroke="#1e293b"
                    strokeDasharray="2 6"
                    opacity={0.3}
                />
            );
        })}
    </>
);

const LegendDot = ({
    className,
    label,
    hollow = false,
}: {
    className?: string;
    label: string;
    hollow?: boolean;
}) => (
    <span className="flex items-center gap-2">
        <span
            className={cn(
                "inline-flex h-3 w-3 items-center justify-center rounded-full",
                hollow ? "border border-indigo-400 bg-indigo-500/20" : className
            )}
        />
        {label}
    </span>
);

const formatDateLabel = (date: string) => {
    const obj = new Date(date);
    if (Number.isNaN(obj.getTime())) {
        return date;
    }
    return `${obj.getMonth() + 1}/${obj.getDate()}`;
};

export default TrendComparisonChart;
