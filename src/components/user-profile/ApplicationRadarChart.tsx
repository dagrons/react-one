import { RadarMetric } from "@/data/userProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ApplicationRadarChartProps {
    metrics: RadarMetric[];
    className?: string;
}

const ApplicationRadarChart = ({ metrics, className }: ApplicationRadarChartProps) => {
    const maxValue = Math.max(...metrics.map((metric) => Math.max(metric.activityScore, metric.sensitivity)), 1);
    const normalized = metrics.map((metric) => ({
        ...metric,
        activityNorm: metric.activityScore / maxValue,
        sensitivityNorm: metric.sensitivity / maxValue,
    }));

    const { polygons, axis } = buildPolygons(normalized);

    return (
        <Card className={cn("border-slate-800/60 bg-slate-950/90 text-slate-100", className)}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">应用访问能力雷达</CardTitle>
                <p className="text-xs text-slate-400">
                    对比系统访问强度与模块敏感度，用于识别权限边界和潜在风险
                </p>
            </CardHeader>
            <CardContent>
                <div className="relative mx-auto flex w-full max-w-2xl flex-col items-center">
                    <svg viewBox="-160 -160 320 320" className="w-full max-w-[320px] text-slate-200">
                        <defs>
                            <radialGradient id="activityGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#38bdf8" stopOpacity="0.65" />
                                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
                            </radialGradient>
                            <radialGradient id="sensitivityGradient" cx="50%" cy="50%" r="50%">
                                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.45" />
                                <stop offset="100%" stopColor="#0f172a" stopOpacity="0.05" />
                            </radialGradient>
                        </defs>

                        {polygons.grid.map((points, index) => (
                            <polygon
                                key={index}
                                points={points}
                                fill="none"
                                stroke="#1e293b"
                                strokeWidth={0.8}
                                opacity={0.5 - index * 0.08}
                            />
                        ))}

                        {axis.map((line) => (
                            <line
                                key={line.label}
                                x1={0}
                                y1={0}
                                x2={line.x}
                                y2={line.y}
                                stroke="#1e293b"
                                strokeWidth={1}
                                opacity={0.6}
                            />
                        ))}

                        <polygon
                            points={polygons.activity}
                            fill="url(#activityGradient)"
                            stroke="#38bdf8"
                            strokeWidth={2}
                            opacity={0.9}
                        />
                        <polygon
                            points={polygons.sensitivity}
                            fill="url(#sensitivityGradient)"
                            stroke="#f59e0b"
                            strokeWidth={2}
                            opacity={0.75}
                        />

                        {normalized.map((metric, index) => {
                            const angle = (Math.PI * 2 * index) / normalized.length - Math.PI / 2;
                            const labelRadius = 130;
                            const x = Math.cos(angle) * labelRadius;
                            const y = Math.sin(angle) * labelRadius;
                            return (
                                <g key={metric.system} transform={`translate(${x},${y})`}>
                                    <text
                                        textAnchor={Math.abs(x) < 10 ? "middle" : x > 0 ? "start" : "end"}
                                        dominantBaseline={y > 0 ? "hanging" : "auto"}
                                        className="text-[11px] font-medium uppercase tracking-widest"
                                        fill="#cbd5f5"
                                    >
                                        {metric.system}
                                    </text>
                                </g>
                            );
                        })}
                    </svg>

                    <div className="mt-4 flex gap-4 text-xs text-slate-300">
                        <LegendSwatch color="bg-sky-400" label="访问强度" />
                        <LegendSwatch color="bg-amber-400" label="模块敏感度" />
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

const buildPolygons = (metrics: (RadarMetric & { activityNorm: number; sensitivityNorm: number })[]) => {
    const levels = 4;
    const radius = 110;

    const angleForIndex = (index: number) =>
        (Math.PI * 2 * index) / metrics.length - Math.PI / 2;

    const scalePoint = (value: number, angle: number) => ({
        x: Math.cos(angle) * radius * value,
        y: Math.sin(angle) * radius * value,
    });

    const activityPoints = metrics.map((metric, index) => {
        const angle = angleForIndex(index);
        const { x, y } = scalePoint(metric.activityNorm, angle);
        return `${x},${y}`;
    });

    const sensitivityPoints = metrics.map((metric, index) => {
        const angle = angleForIndex(index);
        const { x, y } = scalePoint(metric.sensitivityNorm, angle);
        return `${x},${y}`;
    });

    const grid: string[][] = [];
    for (let level = levels; level >= 1; level--) {
        const ratio = level / levels;
        const ringPoints = metrics.map((_, index) => {
            const angle = angleForIndex(index);
            const { x, y } = scalePoint(ratio, angle);
            return `${x},${y}`;
        });
        grid.push(ringPoints);
    }

    const axis = metrics.map((metric, index) => {
        const angle = angleForIndex(index);
        const { x, y } = scalePoint(1, angle);
        return { label: metric.system, x, y };
    });

    return {
        polygons: {
            activity: activityPoints.join(" "),
            sensitivity: sensitivityPoints.join(" "),
            grid,
        },
        axis,
    };
};

const LegendSwatch = ({ color, label }: { color: string; label: string }) => (
    <span className="flex items-center gap-2">
        <span className={cn("h-3 w-3 rounded-sm", color)} />
        {label}
    </span>
);

export default ApplicationRadarChart;
