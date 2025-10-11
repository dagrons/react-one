import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const SettingsPage = () => {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <h1 className="text-3xl font-semibold text-white">设置控制台</h1>
                <p className="text-sm text-slate-400">系统配置集中管理，支持主题、告警策略等后续扩展。</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle className="text-white">应用设置</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-slate-400">此功能正在开发中...</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
