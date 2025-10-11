
import SummaryBar from "@/components/user-profile/SummaryBar";
import KpiGrid from "@/components/user-profile/KpiGrid";
import TrendComparisonChart from "@/components/user-profile/TrendComparisonChart";
import ApplicationRadarChart from "@/components/user-profile/ApplicationRadarChart";
import AccessHeatmap from "@/components/user-profile/AccessHeatmap";
import AnomalyTable from "@/components/user-profile/AnomalyTable";
import PersonaTagCloud from "@/components/user-profile/PersonaTagCloud";
import ActivityTimeline from "@/components/user-profile/ActivityTimeline";
import { useUserProfile, ALL_DEPARTMENTS_FILTER } from "@/hooks/useUserProfile";
import { Button } from "@/components/ui/button";

const UserProfilePage = () => {
    const {
        userList,
        isUserListLoading,
        userListError,
        selectedUserId,
        selectUser,
        profile,
        isProfileLoading,
        profileError,
        refreshProfile,
        isRefreshing,
        filteredUserList,
        searchKeyword,
        searchInput,
        setSearchInput,
        departmentFilter,
        changeDepartmentFilter,
        departmentOptions,
        resetFilters,
        submitSearch,
    } = useUserProfile();

    if (isUserListLoading && !userList.length) {
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

    if (userListError) {
        return (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
                用户列表加载失败: {userListError.message}
            </div>
        );
    }

    if (profileError) {
        return (
            <div className="rounded-2xl border border-red-500/40 bg-red-500/10 p-6 text-red-200">
                数据加载失败: {profileError.message}
            </div>
        );
    }

    if ((!profile || !selectedUserId) && isProfileLoading) {
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

    if (!profile || !selectedUserId) {
        return (
            <div className="rounded-2xl border border-slate-800/60 bg-slate-900/40 p-6 text-slate-300">
                暂无可展示的画像数据，请检查配置或尝试刷新。
            </div>
        );
    }

    const hasMatches = filteredUserList.length > 0;
    const userOptionsForSelect = hasMatches ? filteredUserList : userList;
    const showNoMatchBanner =
        !hasMatches &&
        (searchKeyword.trim() !== "" || departmentFilter !== ALL_DEPARTMENTS_FILTER);

    return (
        <div className="space-y-6 pb-10">
            <SummaryBar
                summary={profile.summary}
                onRefresh={refreshProfile}
                isRefreshing={isRefreshing}
                userOptions={userOptionsForSelect}
                selectedUserId={selectedUserId}
                onUserChange={selectUser}
                searchInput={searchInput}
                onSearchInputChange={setSearchInput}
                activeSearchKeyword={searchKeyword}
                onSearchSubmit={submitSearch}
                departmentOptions={departmentOptions}
                selectedDepartment={departmentFilter}
                onDepartmentChange={changeDepartmentFilter}
                onResetFilters={resetFilters}
            />
            {showNoMatchBanner && (
                <div className="rounded-2xl border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-200">
                    未找到匹配的画像对象，请调整姓名或部门筛选。
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={resetFilters}
                        className="ml-4 border-amber-500/40 bg-transparent text-amber-100 hover:bg-amber-500/20"
                    >
                        重置筛选
                    </Button>
                </div>
            )}
            <KpiGrid summary={profile.summary} />

            <div className="grid gap-6 xl:grid-cols-3">
                <div className="space-y-6 xl:col-span-2">
                    <TrendComparisonChart points={profile.trends} />
                    <AccessHeatmap cells={profile.heatmap} />
                </div>
                <div className="space-y-6">
                    <ApplicationRadarChart metrics={profile.radar} />
                    <PersonaTagCloud categories={profile.personaTags} />
                </div>
            </div>

            <AnomalyTable events={profile.anomalies} onRefresh={refreshProfile} />
            <ActivityTimeline events={profile.timeline} />
        </div>
    );
};

const SkeletonBlock = ({ className }: { className?: string }) => (
    <div
        className={`animate-pulse rounded-2xl border border-slate-800/60 bg-slate-900/60 ${className ?? ""}`}
    />
);

export default UserProfilePage;
