import { TimelineEvent } from "@/data/userProfile";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { AlertTriangle, CheckCircle2, Clock } from "lucide-react";

interface ActivityTimelineProps {
    events: TimelineEvent[];
    className?: string;
}

const ActivityTimeline = ({ events, className }: ActivityTimelineProps) => {
    return (
        <Card className={cn("border-slate-800/60 bg-slate-950/90 text-slate-100", className)}>
            <CardHeader>
                <CardTitle className="text-lg font-semibold text-white">关键行为时间线</CardTitle>
                <p className="text-xs text-slate-400">
                    近 7 日关键事件流，重点标注告警和审批动作，支持快速溯源
                </p>
            </CardHeader>
            <CardContent>
                <div className="relative">
                    <div className="absolute left-6 top-0 bottom-6 w-px bg-gradient-to-b from-sky-500/60 via-slate-700/60 to-transparent" />
                    <ul className="space-y-6">
                        {events.map((event) => (
                            <li key={event.id} className="relative pl-16">
                                <TimelineIcon type={event.type} />
                                <div className="rounded-2xl border border-slate-800/70 bg-slate-900/60 p-4 shadow-sm shadow-slate-950/40">
                                    <div className="flex flex-col gap-1">
                                        <div className="flex items-center justify-between">
                                            <h3 className="text-base font-semibold text-white">{event.title}</h3>
                                            <time className="flex items-center gap-1 text-xs text-slate-400">
                                                <Clock className="h-3.5 w-3.5" />
                                                {event.timestamp}
                                            </time>
                                        </div>
                                        <p className="text-sm text-slate-300">{event.description}</p>
                                    </div>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </CardContent>
        </Card>
    );
};

const TimelineIcon = ({ type }: { type: TimelineEvent["type"] }) => {
    const baseClasses =
        "absolute left-0 top-1 flex h-12 w-12 items-center justify-center rounded-2xl border text-slate-100 shadow-slate-900/60";

    if (type === "alert") {
        return (
            <div className={cn(baseClasses, "border-red-500/60 bg-red-500/20 text-red-300")}>
                <AlertTriangle className="h-5 w-5" />
            </div>
        );
    }
    if (type === "action") {
        return (
            <div className={cn(baseClasses, "border-emerald-500/60 bg-emerald-500/20 text-emerald-200")}>
                <CheckCircle2 className="h-5 w-5" />
            </div>
        );
    }
    return (
        <div className={cn(baseClasses, "border-sky-500/60 bg-sky-500/20 text-sky-200")}>
            <Clock className="h-5 w-5" />
        </div>
    );
};

export default ActivityTimeline;
