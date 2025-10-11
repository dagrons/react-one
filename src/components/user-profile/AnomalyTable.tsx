import { AnomalyEvent } from "@/data/userProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AnomalyTableProps {
    events: AnomalyEvent[];
    onRefresh?: () => void;
}

const AnomalyTable = ({ events, onRefresh }: AnomalyTableProps) => {
    return (
        <Card className="border-slate-800/60 bg-slate-950/90 text-slate-100">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-lg font-semibold text-white">异常事件监控</CardTitle>
                    <p className="text-xs text-slate-400">
                        最近识别的异常行为，支持人工确认及闭环处理
                    </p>
                </div>
                {onRefresh && (
                    <Button
                        size="sm"
                        variant="outline"
                        onClick={onRefresh}
                        className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
                    >
                        手动刷新
                    </Button>
                )}
            </CardHeader>
            <CardContent className="overflow-x-auto">
                <table className="min-w-full text-sm">
                    <thead>
                        <tr className="text-left text-xs uppercase tracking-widest text-slate-400">
                            <th className="pb-3">事件</th>
                            <th className="pb-3">时间</th>
                            <th className="pb-3">等级</th>
                            <th className="pb-3">状态</th>
                            <th className="pb-3">备注</th>
                            <th className="pb-3 text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        {events.map((event) => (
                            <tr
                                key={event.id}
                                className="border-t border-slate-800/60 text-slate-200 hover:bg-slate-900/60"
                            >
                                <td className="py-3 font-medium text-white">{event.type}</td>
                                <td className="py-3 text-slate-400">{event.detectedAt}</td>
                                <td className="py-3">
                                    <SeverityTag level={event.severity} />
                                </td>
                                <td className="py-3">
                                    <StatusTag status={event.status} />
                                </td>
                                <td className="py-3 text-slate-300">{event.description}</td>
                                <td className="py-3 text-right">
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="border-slate-700 bg-slate-950/70 text-slate-100 hover:bg-slate-800"
                                    >
                                        查看详情
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </CardContent>
        </Card>
    );
};

const SeverityTag = ({ level }: { level: AnomalyEvent["severity"] }) => {
    const styles: Record<AnomalyEvent["severity"], string> = {
        低: "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40",
        中: "bg-amber-500/20 text-amber-200 border border-amber-500/40",
        高: "bg-red-500/20 text-red-300 border border-red-500/40",
    };
    return (
        <span className={cn("rounded-full px-3 py-1 text-xs font-semibold", styles[level])}>
            {level}
        </span>
    );
};

const StatusTag = ({ status }: { status: AnomalyEvent["status"] }) => {
    const styles: Record<AnomalyEvent["status"], string> = {
        未处理: "bg-slate-700/40 text-slate-200 border border-slate-600/60",
        处理中: "bg-blue-500/20 text-blue-200 border border-blue-500/40",
        已关闭: "bg-emerald-500/20 text-emerald-200 border border-emerald-500/40",
    };
    return (
        <span className={cn("rounded-full px-3 py-1 text-xs", styles[status])}>{status}</span>
    );
};

export default AnomalyTable;
