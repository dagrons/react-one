import { Card, CardContent } from "@/components/ui/card";
import { UserSummary } from "@/data/userProfile";
import { cn } from "@/lib/utils";
import { Activity, Calendar, Clock, LogIn, OctagonAlert } from "lucide-react";
import { ComponentType } from "react";

interface KpiGridProps {
    summary: UserSummary;
    className?: string;
}

type SummaryKey =
    | "entryCount30d"
    | "loginCount30d"
    | "avgStayHours"
    | "anomalies30d"
    | "lastActive";

interface KpiConfigItem {
    key: SummaryKey;
    label: string;
    icon: ComponentType<{ className?: string }>;
    gradient: string;
    accent: string;
    formatter: (value: UserSummary[SummaryKey]) => string;
}

const KPI_CONFIG: KpiConfigItem[] = [
    {
        key: "entryCount30d",
        label: "30 日门禁次数",
        icon: Activity,
        gradient: "from-sky-500/80 via-sky-600/70 to-sky-500/60",
        accent: "text-sky-100",
        formatter: (value) => `${value as number} 次`,
    },
    {
        key: "loginCount30d",
        label: "30 日系统访问",
        icon: LogIn,
        gradient: "from-indigo-500/80 via-indigo-600/70 to-indigo-500/60",
        accent: "text-indigo-100",
        formatter: (value) => `${value as number} 次`,
    },
    {
        key: "avgStayHours",
        label: "日均驻留时长",
        icon: Clock,
        gradient: "from-emerald-500/80 via-emerald-600/70 to-emerald-500/60",
        accent: "text-emerald-100",
        formatter: (value) => `${(value as number).toFixed(1)} 小时`,
    },
    {
        key: "anomalies30d",
        label: "异常告警",
        icon: OctagonAlert,
        gradient: "from-amber-500/80 via-amber-600/70 to-amber-500/60",
        accent: "text-amber-100",
        formatter: (value) => `${value as number} 条`,
    },
    {
        key: "lastActive",
        label: "最后活跃时间",
        icon: Calendar,
        gradient: "from-purple-500/80 via-purple-600/70 to-purple-500/60",
        accent: "text-purple-100",
        formatter: (value) => value as string,
    },
];

const KpiGrid = ({ summary, className }: KpiGridProps) => {
    return (
        <div
            className={cn(
                "grid gap-4 md:grid-cols-2 xl:grid-cols-5",
                className
            )}
        >
            {KPI_CONFIG.map((item) => (
                <Card
                    key={item.key}
                    className={cn(
                        "relative overflow-hidden rounded-2xl border border-slate-800/60 bg-slate-950/90 p-px",
                        "before:absolute before:inset-0 before:rounded-2xl before:bg-gradient-to-r",
                        "before:opacity-20 before:blur-xl before:transition before:duration-500 hover:before:opacity-40",
                        `before:${item.gradient}`
                    )}
                >
                    <CardContent className="relative flex flex-col gap-4 rounded-2xl bg-slate-950/90 p-5">
                        <div className="flex items-center justify-between">
                            <p className="text-xs uppercase tracking-widest text-slate-400">{item.label}</p>
                            <div className={cn("rounded-full p-2", item.accent)}>
                                <item.icon className="h-4 w-4" />
                            </div>
                        </div>
                        <p className="text-2xl font-semibold text-white">
                            {item.formatter(summary[item.key as keyof UserSummary] as number | string)}
                        </p>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default KpiGrid;
