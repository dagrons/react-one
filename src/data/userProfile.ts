export interface UserSummary {
    name: string;
    employeeId: string;
    department: string;
    position: string;
    lastActive: string;
    riskScore: number;
    entryCount30d: number;
    loginCount30d: number;
    anomalies30d: number;
    avgStayHours: number;
    primaryLocation: string;
}

export interface TrendPoint {
    date: string;
    entryCount: number;
    departmentEntryAvg: number;
    loginCount: number;
}

export interface RadarMetric {
    system: string;
    activityScore: number;
    sensitivity: number;
}

export interface HeatmapCell {
    day: number; // 0 = Sunday
    hour: number; // 0 - 23
    entryCount: number;
    loginCount: number;
}

export interface AnomalyEvent {
    id: string;
    type: string;
    detectedAt: string;
    severity: "低" | "中" | "高";
    status: "未处理" | "处理中" | "已关闭";
    description: string;
}

export interface PersonaTag {
    category: string;
    tags: {
        label: string;
        intensity: number;
        description: string;
    }[];
}

export interface TimelineEvent {
    id: string;
    title: string;
    timestamp: string;
    type: "alert" | "info" | "action";
    description: string;
}

export interface UserProfileData {
    summary: UserSummary;
    trends: TrendPoint[];
    radar: RadarMetric[];
    heatmap: HeatmapCell[];
    anomalies: AnomalyEvent[];
    personaTags: PersonaTag[];
    timeline: TimelineEvent[];
}

const mockTrend: TrendPoint[] = [
    { date: "2025-09-18", entryCount: 3, departmentEntryAvg: 2.2, loginCount: 8 },
    { date: "2025-09-19", entryCount: 2, departmentEntryAvg: 2.6, loginCount: 7 },
    { date: "2025-09-20", entryCount: 4, departmentEntryAvg: 2.4, loginCount: 9 },
    { date: "2025-09-21", entryCount: 1, departmentEntryAvg: 1.4, loginCount: 4 },
    { date: "2025-09-22", entryCount: 5, departmentEntryAvg: 2.8, loginCount: 11 },
    { date: "2025-09-23", entryCount: 4, departmentEntryAvg: 2.5, loginCount: 10 },
    { date: "2025-09-24", entryCount: 3, departmentEntryAvg: 2.7, loginCount: 9 },
];

const mockHeatmap: HeatmapCell[] = Array.from({ length: 7 * 24 }).map((_, index) => {
    const day = Math.floor(index / 24);
    const hour = index % 24;
    const isWorkingHour = hour >= 8 && hour <= 20;
    const entryCount = isWorkingHour ? Math.floor(Math.random() * 3) : Math.floor(Math.random() * 1.2);
    const loginCount = isWorkingHour ? Math.floor(Math.random() * 6) : Math.floor(Math.random() * 1.4);
    return { day, hour, entryCount, loginCount };
});

const mockPersonaTags: PersonaTag[] = [
    {
        category: "岗位画像",
        tags: [
            { label: "工艺工程师", intensity: 0.9, description: "负责生产线工艺优化" },
            { label: "关键资产访问", intensity: 0.7, description: "定期访问 MES/ERP 核心模块" },
        ],
    },
    {
        category: "行为习惯",
        tags: [
            { label: "早班常驻", intensity: 0.85, description: "工作日 7:30-9:30 门禁打卡" },
            { label: "移动终端登录", intensity: 0.4, description: "存在移动 VPN 登录记录" },
        ],
    },
    {
        category: "风险特征",
        tags: [
            { label: "夜间访问", intensity: 0.55, description: "非工作时段访问 OA 系统" },
            { label: "跨区域登录", intensity: 0.35, description: "出现园区外登录行为" },
        ],
    },
];

const mockTimeline: TimelineEvent[] = [
    {
        id: "evt-001",
        title: "检测到场外 VPN 登录",
        timestamp: "2025-09-23 22:18",
        type: "alert",
        description: "账号从园区外 IP 登录 MES 系统，触发异地登录策略。",
    },
    {
        id: "evt-002",
        title: "审批完成-产线参数调整",
        timestamp: "2025-09-23 17:05",
        type: "action",
        description: "完成对产线 3# 设备的参数调整审批流程。",
    },
    {
        id: "evt-003",
        title: "进出厂次数超部门平均",
        timestamp: "2025-09-22 20:34",
        type: "info",
        description: "当天累计进出厂 5 次，高于部门均值 78%。",
    },
    {
        id: "evt-004",
        title: "夜间留厂超过 4 小时",
        timestamp: "2025-09-20 02:11",
        type: "alert",
        description: "检测到夜间留厂，建议复核作业申请。",
    },
];

export const mockUserProfileData: UserProfileData = {
    summary: {
        name: "李程",
        employeeId: "E204578",
        department: "制造中心 · 工艺优化部",
        position: "高级工艺工程师",
        lastActive: "2025-09-24 18:42",
        riskScore: 82,
        entryCount30d: 78,
        loginCount30d: 214,
        anomalies30d: 5,
        avgStayHours: 9.4,
        primaryLocation: "南厂区 F3 楼",
    },
    trends: mockTrend,
    radar: [
        { system: "MES", activityScore: 92, sensitivity: 80 },
        { system: "ERP", activityScore: 75, sensitivity: 70 },
        { system: "OA", activityScore: 64, sensitivity: 60 },
        { system: "PLM", activityScore: 58, sensitivity: 85 },
        { system: "BI", activityScore: 71, sensitivity: 65 },
    ],
    heatmap: mockHeatmap,
    anomalies: [
        {
            id: "anom-001",
            type: "园区外登录",
            detectedAt: "2025-09-23 22:18",
            severity: "高",
            status: "处理中",
            description: "22:18 在园区外 IP 登录 MES，疑似代办操作。",
        },
        {
            id: "anom-002",
            type: "夜间通行",
            detectedAt: "2025-09-20 02:11",
            severity: "中",
            status: "未处理",
            description: "夜间 02:11 进入南厂区 F3 楼，未找到对应工单记录。",
        },
        {
            id: "anom-003",
            type: "多终端并行登录",
            detectedAt: "2025-09-18 14:27",
            severity: "中",
            status: "已关闭",
            description: "PC 与移动端同时间段访问 OA，已核实为本人操作。",
        },
    ],
    personaTags: mockPersonaTags,
    timeline: mockTimeline,
};

export const fetchMockUserProfile = async (): Promise<UserProfileData> => {
    // 模拟网络请求延时，方便后续替换成真实接口
    await new Promise((resolve) => setTimeout(resolve, 320));
    return mockUserProfileData;
};
