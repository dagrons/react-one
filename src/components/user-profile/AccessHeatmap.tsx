import { HeatmapCell } from "@/data/userProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as d3 from "d3";

interface AccessHeatmapProps {
    cells: HeatmapCell[];
    className?: string;
}

const HOURS = Array.from({ length: 24 }).map((_, index) => index);
const DAYS = ["周日", "周一", "周二", "周三", "周四", "周五", "周六"];

const AccessHeatmap = ({ cells, className }: AccessHeatmapProps) => {
    const maxValue = d3.max(cells, (cell) => cell.entryCount + cell.loginCount) ?? 1;
    const colorScale = d3
        .scaleSequential(d3.interpolateCool)
        .domain([0, maxValue || 1]);

    const grid = HOURS.map((hour) =>
        DAYS.map((_, dayIndex) => cells.find((cell) => cell.day === dayIndex && cell.hour === hour))
    );

    return (
        <Card className={cn("border-slate-800/60 bg-slate-950/90 text-slate-100", className)}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">门禁 × 系统访问热力矩阵</CardTitle>
                <p className="text-xs text-slate-400">
                    横轴为星期，纵轴为小时，对应格子颜色越亮代表行为频次越高
                </p>
            </CardHeader>
            <CardContent>
                <div className="overflow-x-auto">
                    <table className="min-w-[520px] border-separate border-spacing-[4px] text-xs">
                        <thead>
                            <tr>
                                <th className="w-12 text-left text-slate-400">Hour</th>
                                {DAYS.map((day) => (
                                    <th key={day} className="w-16 text-center text-slate-400">
                                        {day}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {grid.map((row, hour) => (
                                <tr key={hour}>
                                    <td className="whitespace-nowrap pr-3 text-right text-slate-500">{`${hour}:00`}</td>
                                    {row.map((cell, idx) => {
                                        const value = cell ? cell.entryCount + cell.loginCount : 0;
                                        const color = colorScale(value);
                                        return (
                                            <td key={idx} className="text-center">
                                                <div
                                                    className="h-8 rounded-lg border border-slate-800/60 transition hover:scale-[1.04] hover:border-slate-700"
                                                    style={{
                                                        background: cell ? color : "#0f172a",
                                                        color: value > maxValue * 0.45 ? "#0f172a" : "#e2e8f0",
                                                    }}
                                                    title={`门禁 ${cell?.entryCount ?? 0} 次 / 登录 ${cell?.loginCount ?? 0} 次`}
                                                >
                                                    <div className="flex h-full items-center justify-center font-medium">
                                                        {value > 0 ? value : ""}
                                                    </div>
                                                </div>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
                    <span>低</span>
                    <div className="flex h-2 flex-1 items-center justify-between">
                        {Array.from({ length: 12 }).map((_, index) => {
                            const value = (maxValue / 11) * index;
                            return (
                                <span
                                    key={index}
                                    className="h-2 flex-1"
                                    style={{
                                        background: colorScale(value),
                                    }}
                                />
                            );
                        })}
                    </div>
                    <span>高</span>
                </div>
            </CardContent>
        </Card>
    );
};

export default AccessHeatmap;
