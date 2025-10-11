
import SummaryBar from "@/components/user-profile/SummaryBar";
import KpiGrid from "@/components/user-profile/KpiGrid";
import TrendComparisonChart from "@/components/user-profile/TrendComparisonChart";
import ApplicationRadarChart from "@/components/user-profile/ApplicationRadarChart";
import AccessHeatmap from "@/components/user-profile/AccessHeatmap";
import AnomalyTable from "@/components/user-profile/AnomalyTable";
import PersonaTagCloud from "@/components/user-profile/PersonaTagCloud";
import ActivityTimeline from "@/components/user-profile/ActivityTimeline";
import { useMockUserProfile } from "@/hooks/useMockUserProfile";

const UserProfilePage = () => {
    const { data, isLoading, error, refresh } = useMockUserProfile();

    if (isLoading && !data) {
        return (
            <div className="space-y-6">
                <SkeletonBlock className="h-48" />
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                    {Array.from({ length: 5 }).map((_, index) => (
                        <SkeletonBlock key={index} className="h-32" />
                    ))}
                </div>
                <div className="grid gap-6 xl:grid-cols-3">
                    <div className="space-y-6 xl:col-span-2">
                        <SkeletonBlock className="h-72" />
                        <SkeletonBlock className="h-80" />
                    </div>
                    <div className="space-y-6">
                        <SkeletonBlock className="h-72" />
                        <SkeletonBlock className="h-80" />
                    </div>
                </div>
                <SkeletonBlock className="h-64" />
                <SkeletonBlock className="h-72" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
                数据加载失败: {error.message}
            </div>
        );
    }

    if (!data) {
        return null;
    }

    return (
        <div className="space-y-6 pb-10">
            <SummaryBar summary={data.summary} onRefresh={refresh} isRefreshing={isLoading} />
            <KpiGrid summary={data.summary} />

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <TrendComparisonChart points={data.trends} />
                    <AccessHeatmap cells={data.heatmap} />
                </div>
                <div className="space-y-6">
                    <ApplicationRadarChart metrics={data.radar} />
                    <PersonaTagCloud categories={data.personaTags} />
                </div>
            </div>

            <AnomalyTable events={data.anomalies} onRefresh={refresh} />
            <ActivityTimeline events={data.timeline} />
        </div>
    );
};

const SkeletonBlock = ({ className }: { className?: string }) => (
    <div
        className={`animate-pulse rounded-2xl border border-slate-800/60 bg-slate-900/60 ${className ?? ""}`}
    />
);

export default UserProfilePage;
