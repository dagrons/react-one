import { UserListItem, UserSummary } from "@/data/userProfile";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { ALL_DEPARTMENTS_FILTER } from "@/hooks/useUserProfile";

interface SummaryBarProps {
    summary: UserSummary;
    onRefresh?: () => void;
    isRefreshing?: boolean;
    className?: string;
    userOptions?: UserListItem[];
    selectedUserId?: string | null;
    onUserChange?: (userId: string) => void;
    searchInput?: string;
    onSearchInputChange?: (value: string) => void;
    activeSearchKeyword?: string;
    onSearchSubmit?: () => void;
    departmentOptions?: string[];
    selectedDepartment?: string;
    onDepartmentChange?: (value: string) => void;
    onResetFilters?: () => void;
}

const SummaryBar = ({
    summary,
    onRefresh,
    isRefreshing,
    className,
    userOptions,
    selectedUserId,
    onUserChange,
    searchInput,
    onSearchInputChange,
    activeSearchKeyword,
    onSearchSubmit,
    departmentOptions,
    selectedDepartment,
    onDepartmentChange,
    onResetFilters,
}: SummaryBarProps) => {
    const hasMultipleUsers = (userOptions?.length ?? 0) > 1;
    const hasDepartmentFilter = (departmentOptions?.length ?? 0) > 1;

    return (
        <Card
            className={cn(
                "flex flex-col gap-6 rounded-2xl border border-slate-800/60 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-6 text-slate-100 shadow-lg shadow-slate-900/40",
                className
            )}
        >
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <p className="text-sm uppercase tracking-widest text-slate-400">用户画像 · 实时</p>
                    <h2 className="text-2xl font-semibold text-white">
                        {summary.name}
                        <span className="ml-3 text-base font-medium text-sky-400">{summary.position}</span>
                    </h2>
                    <p className="text-sm text-slate-400">
                        {summary.department} · 工号 {summary.employeeId}
                    </p>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-right">
                    {(hasMultipleUsers || hasDepartmentFilter) && (
                        <div className="flex flex-col gap-3 text-left">
                            {hasMultipleUsers && (
                                <div>
                                    <label className="text-xs uppercase tracking-widest text-slate-400">
                                        切换画像对象
                                    </label>
                                    <select
                                        value={selectedUserId ?? ""}
                                        onChange={(event) => onUserChange?.(event.target.value)}
                                        className={cn(
                                            "mt-2 min-w-[200px] rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm font-medium text-slate-100",
                                            "focus:border-sky-500/60 focus:outline-none"
                                        )}
                                    >
                                        {userOptions?.map((user) => (
                                            <option key={user.id} value={user.id}>
                                                {user.name} · {user.department.replace(/·/g, "/")}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                            )}
                            <div className="flex flex-wrap items-center gap-3">
                                <div className="flex flex-col">
                                    <label className="text-xs uppercase tracking-widest text-slate-400">
                                        搜索姓名
                                    </label>
                                    <input
                                        value={searchInput ?? ""}
                                        onChange={(event) => onSearchInputChange?.(event.target.value)}
                                        onKeyDown={(event) => {
                                            if (event.key === "Enter") {
                                                event.preventDefault();
                                                onSearchSubmit?.();
                                            }
                                        }}
                                        placeholder="输入姓名关键字"
                                        className="mt-2 w-48 rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500/60 focus:outline-none"
                                    />
                                </div>
                                {hasDepartmentFilter && (
                                    <div className="flex flex-col">
                                        <label className="text-xs uppercase tracking-widest text-slate-400">
                                            按部门筛选
                                        </label>
                                        <select
                                            value={selectedDepartment ?? ALL_DEPARTMENTS_FILTER}
                                            onChange={(event) => onDepartmentChange?.(event.target.value)}
                                            className="mt-2 min-w-[200px] rounded-xl border border-slate-700/70 bg-slate-900/70 px-3 py-2 text-sm text-slate-100 focus:border-sky-500/60 focus:outline-none"
                                        >
                                            <option value={ALL_DEPARTMENTS_FILTER}>全部部门</option>
                                            {departmentOptions?.map((dept) => (
                                                <option key={dept} value={dept}>
                                                    {dept}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                )}
                                {((searchInput && searchInput.trim().length > 0) ||
                                    (activeSearchKeyword && activeSearchKeyword.trim().length > 0) ||
                                    (selectedDepartment && selectedDepartment !== ALL_DEPARTMENTS_FILTER)) && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={onResetFilters}
                                        className="self-end border-slate-700/60 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
                                    >
                                        重置筛选
                                    </Button>
                                )}
                            </div>
                        </div>
                    )}
                    <div className="rounded-xl border border-slate-700/80 bg-slate-900/60 px-4 py-2 text-right">
                        <p className="text-xs tracking-widest text-slate-400">AI 风险评分</p>
                        <p className="text-3xl font-semibold text-amber-300">{summary.riskScore}</p>
                    </div>
                    {onRefresh && (
                        <Button
                            variant="outline"
                            size="icon"
                            onClick={onRefresh}
                            disabled={isRefreshing}
                            className="border-slate-700 bg-slate-900/70 text-slate-100 hover:bg-slate-800"
                            title="刷新 mock 数据"
                        >
                            <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
                        </Button>
                    )}
                </div>
            </div>

            <div className="grid gap-4 text-sm sm:grid-cols-4">
                <InfoBlock label="主驻留区域" value={summary.primaryLocation} />
                <InfoBlock label="上次活跃" value={summary.lastActive} />
                <InfoBlock label="30 日平均驻留时长" value={`${summary.avgStayHours.toFixed(1)} 小时/天`} />
                <InfoBlock label="异常事件 (30 日)" value={`${summary.anomalies30d} 条`} highlight />
            </div>
        </Card>
    );
};

const InfoBlock = ({
    label,
    value,
    highlight = false,
}: {
    label: string;
    value: string;
    highlight?: boolean;
}) => (
    <div
        className={cn(
            "rounded-xl border border-slate-800/70 bg-slate-900/60 px-4 py-3",
            highlight && "border-amber-500/60 bg-amber-500/10 text-amber-200"
        )}
    >
        <p className="text-xs uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-1 text-base font-medium text-white">{value}</p>
    </div>
);

export default SummaryBar;
