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

export interface UserListItem {
    id: string;
    name: string;
    position: string;
    department: string;
    riskScore: number;
}

const createTrend = (entries: TrendPoint[]): TrendPoint[] => entries;

const createHeatmap = ({
    baseEntry = 2,
    baseLogin = 6,
    nightMultiplier = 0.3,
}: {
    baseEntry?: number;
    baseLogin?: number;
    nightMultiplier?: number;
} = {}): HeatmapCell[] =>
    Array.from({ length: 7 * 24 }).map((_, index) => {
        const day = Math.floor(index / 24);
        const hour = index % 24;
        const isWorkingHour = hour >= 8 && hour <= 20;
        const entrySeed = isWorkingHour ? baseEntry : baseEntry * nightMultiplier;
        const loginSeed = isWorkingHour ? baseLogin : baseLogin * nightMultiplier;
        const entryCount = Math.max(0, Math.round(entrySeed + (Math.random() - 0.5) * entrySeed));
        const loginCount = Math.max(0, Math.round(loginSeed + (Math.random() - 0.5) * loginSeed));
        return { day, hour, entryCount, loginCount };
    });

const createPersonaTags = (tags: PersonaTag[]): PersonaTag[] => tags;
const createTimeline = (events: TimelineEvent[]): TimelineEvent[] => events;

const userProfiles: Record<string, UserProfileData> = {
    "u-001": {
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
        trends: createTrend([
            { date: "2025-09-18", entryCount: 3, departmentEntryAvg: 2.2, loginCount: 8 },
            { date: "2025-09-19", entryCount: 2, departmentEntryAvg: 2.6, loginCount: 7 },
            { date: "2025-09-20", entryCount: 4, departmentEntryAvg: 2.4, loginCount: 9 },
            { date: "2025-09-21", entryCount: 1, departmentEntryAvg: 1.4, loginCount: 4 },
            { date: "2025-09-22", entryCount: 5, departmentEntryAvg: 2.8, loginCount: 11 },
            { date: "2025-09-23", entryCount: 4, departmentEntryAvg: 2.5, loginCount: 10 },
            { date: "2025-09-24", entryCount: 3, departmentEntryAvg: 2.7, loginCount: 9 },
        ]),
        radar: [
            { system: "MES", activityScore: 92, sensitivity: 80 },
            { system: "ERP", activityScore: 75, sensitivity: 70 },
            { system: "OA", activityScore: 64, sensitivity: 60 },
            { system: "PLM", activityScore: 58, sensitivity: 85 },
            { system: "BI", activityScore: 71, sensitivity: 65 },
        ],
        heatmap: createHeatmap({ baseEntry: 2.4, baseLogin: 6.5, nightMultiplier: 0.4 }),
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
        personaTags: createPersonaTags([
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
        ]),
        timeline: createTimeline([
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
        ]),
    },
    "u-002": {
        summary: {
            name: "周妍",
            employeeId: "E198623",
            department: "信息安全中心 · 风险监测组",
            position: "安全分析师",
            lastActive: "2025-09-24 19:05",
            riskScore: 64,
            entryCount30d: 42,
            loginCount30d: 312,
            anomalies30d: 2,
            avgStayHours: 8.1,
            primaryLocation: "总部大厦 12 层 SOC",
        },
        trends: createTrend([
            { date: "2025-09-18", entryCount: 2, departmentEntryAvg: 1.8, loginCount: 15 },
            { date: "2025-09-19", entryCount: 3, departmentEntryAvg: 1.9, loginCount: 16 },
            { date: "2025-09-20", entryCount: 1, departmentEntryAvg: 1.4, loginCount: 12 },
            { date: "2025-09-21", entryCount: 2, departmentEntryAvg: 1.3, loginCount: 14 },
            { date: "2025-09-22", entryCount: 4, departmentEntryAvg: 2.1, loginCount: 18 },
            { date: "2025-09-23", entryCount: 4, departmentEntryAvg: 2.0, loginCount: 17 },
            { date: "2025-09-24", entryCount: 3, departmentEntryAvg: 2.2, loginCount: 16 },
        ]),
        radar: [
            { system: "安全监控平台", activityScore: 96, sensitivity: 88 },
            { system: "日志审计", activityScore: 82, sensitivity: 84 },
            { system: "VPN", activityScore: 74, sensitivity: 70 },
            { system: "堡垒机", activityScore: 68, sensitivity: 90 },
            { system: "邮件安全", activityScore: 58, sensitivity: 62 },
        ],
        heatmap: createHeatmap({ baseEntry: 1.8, baseLogin: 10.5, nightMultiplier: 0.55 }),
        anomalies: [
            {
                id: "anom-101",
                type: "连续高强度登录",
                detectedAt: "2025-09-22 23:42",
                severity: "中",
                status: "处理中",
                description: "出现连续 4 小时高频访问日志审计系统，需确认是否为应急响应。",
            },
            {
                id: "anom-102",
                type: "VPN 认证失败",
                detectedAt: "2025-09-18 07:35",
                severity: "低",
                status: "已关闭",
                description: "早班切换 VPN 节点认证失败 3 次，经核实为网络波动。",
            },
        ],
        personaTags: createPersonaTags([
            {
                category: "岗位画像",
                tags: [
                    { label: "安全监控专家", intensity: 0.88, description: "负责 SOC 日常威胁监控" },
                    { label: "堡垒机核心用户", intensity: 0.66, description: "频繁通过堡垒机登录生产环境" },
                ],
            },
            {
                category: "行为习惯",
                tags: [
                    { label: "双周夜班", intensity: 0.6, description: "夜班负责威胁响应，每两周轮值" },
                    { label: "远程办公", intensity: 0.5, description: "周五固定远程办公" },
                ],
            },
            {
                category: "风险特征",
                tags: [
                    { label: "高频接口操作", intensity: 0.45, description: "使用自动化脚本调用审计接口" },
                    { label: "敏感数据接触", intensity: 0.4, description: "涉及威胁情报、黑名单数据" },
                ],
            },
        ]),
        timeline: createTimeline([
            {
                id: "evt-101",
                title: "威胁告警处置完成",
                timestamp: "2025-09-24 17:32",
                type: "action",
                description: "完成总部邮件钓鱼事件的调查与阻断。",
            },
            {
                id: "evt-102",
                title: "连续远程登录检测",
                timestamp: "2025-09-23 23:42",
                type: "alert",
                description: "连续 4 小时访问日志审计系统，触发行为阈值。",
            },
            {
                id: "evt-103",
                title: "SOC 夜班开始",
                timestamp: "2025-09-21 19:50",
                type: "info",
                description: "夜班交接完成，接手威胁监测任务。",
            },
        ]),
    },
    "u-003": {
        summary: {
            name: "秦赫",
            employeeId: "E211904",
            department: "智能制造中心 · 设备运维组",
            position: "高级运维工程师",
            lastActive: "2025-09-24 17:18",
            riskScore: 45,
            entryCount30d: 116,
            loginCount30d: 128,
            anomalies30d: 1,
            avgStayHours: 10.6,
            primaryLocation: "智能制造园区 A6 车间",
        },
        trends: createTrend([
            { date: "2025-09-18", entryCount: 6, departmentEntryAvg: 3.4, loginCount: 4 },
            { date: "2025-09-19", entryCount: 5, departmentEntryAvg: 3.1, loginCount: 5 },
            { date: "2025-09-20", entryCount: 7, departmentEntryAvg: 2.8, loginCount: 3 },
            { date: "2025-09-21", entryCount: 4, departmentEntryAvg: 2.2, loginCount: 2 },
            { date: "2025-09-22", entryCount: 6, departmentEntryAvg: 3.6, loginCount: 5 },
            { date: "2025-09-23", entryCount: 5, departmentEntryAvg: 3.3, loginCount: 4 },
            { date: "2025-09-24", entryCount: 6, departmentEntryAvg: 3.5, loginCount: 4 },
        ]),
        radar: [
            { system: "设备监控", activityScore: 88, sensitivity: 65 },
            { system: "生产调度", activityScore: 62, sensitivity: 58 },
            { system: "故障工单", activityScore: 74, sensitivity: 54 },
            { system: "远程维护", activityScore: 46, sensitivity: 72 },
            { system: "能耗管理", activityScore: 52, sensitivity: 40 },
        ],
        heatmap: createHeatmap({ baseEntry: 3.6, baseLogin: 3.5, nightMultiplier: 0.25 }),
        anomalies: [
            {
                id: "anom-201",
                type: "高温设备夜间巡检",
                detectedAt: "2025-09-19 01:22",
                severity: "中",
                status: "未处理",
                description: "夜间紧急巡检高温设备，缺少事先报备。",
            },
        ],
        personaTags: createPersonaTags([
            {
                category: "岗位画像",
                tags: [
                    { label: "产线维护核心人员", intensity: 0.92, description: "负责核心生产线运维协调" },
                    { label: "能耗优化参与者", intensity: 0.5, description: "参与能耗治理专项" },
                ],
            },
            {
                category: "行为习惯",
                tags: [
                    { label: "高频巡线", intensity: 0.8, description: "工作日平均进出厂 5-6 次" },
                    { label: "现场会议多", intensity: 0.45, description: "车间现场会议频率高" },
                ],
            },
            {
                category: "风险特征",
                tags: [
                    { label: "夜间作业", intensity: 0.4, description: "偶发夜间巡检任务" },
                    { label: "外来承包商协作", intensity: 0.35, description: "负责外包运维协调" },
                ],
            },
        ]),
        timeline: createTimeline([
            {
                id: "evt-201",
                title: "完成 A6 产线恢复",
                timestamp: "2025-09-24 16:28",
                type: "action",
                description: "恢复 A6 产线机械臂故障，产线恢复生产。",
            },
            {
                id: "evt-202",
                title: "外协人员入厂",
                timestamp: "2025-09-23 08:10",
                type: "info",
                description: "协助外包服务商完成设备维保交接。",
            },
            {
                id: "evt-203",
                title: "夜间巡检记录缺失",
                timestamp: "2025-09-19 01:22",
                type: "alert",
                description: "夜间巡检未预先登记，触发告警。",
            },
        ]),
    },
};

const mockUserList: UserListItem[] = Object.entries(userProfiles).map(([id, data]) => ({
    id,
    name: data.summary.name,
    position: data.summary.position,
    department: data.summary.department,
    riskScore: data.summary.riskScore,
}));

const MOCK_NETWORK_DELAY = 320;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockFetchUserList = async (): Promise<UserListItem[]> => {
    await delay(MOCK_NETWORK_DELAY);
    return mockUserList;
};

export const mockFetchUserProfile = async (userId: string): Promise<UserProfileData> => {
    await delay(MOCK_NETWORK_DELAY);
    const profile = userProfiles[userId];

    if (!profile) {
        throw new Error(`未找到用户画像数据: ${userId}`);
    }

    return profile;
};
