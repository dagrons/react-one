import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { getDefaultApiBaseUrl, useApiConfig } from "@/context/ApiConfigContext";

const SettingsPage = () => {
    const { apiBaseUrl, setApiBaseUrl, resetApiBaseUrl } = useApiConfig();
    const [inputValue, setInputValue] = useState(apiBaseUrl);
    const [saved, setSaved] = useState(false);

    const handleSave = () => {
        setApiBaseUrl(inputValue);
        setSaved(true);
        setTimeout(() => setSaved(false), 1600);
    };

    const handleReset = () => {
        const defaultUrl = getDefaultApiBaseUrl();
        setInputValue(defaultUrl);
        resetApiBaseUrl();
    };

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
            <Card>
                <CardHeader>
                    <CardTitle className="text-white">API 接入配置</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div>
                        <label className="text-xs uppercase tracking-widest text-slate-400">
                            当前 API Base URL
                        </label>
                        <input
                            value={inputValue}
                            onChange={(event) => setInputValue(event.target.value)}
                            placeholder="例如：https://api.example.com"
                            className="mt-2 w-full rounded-xl border border-slate-700/60 bg-slate-900/70 px-4 py-3 text-sm text-slate-100 focus:border-sky-500/60 focus:outline-none"
                        />
                        <p className="mt-2 text-xs text-slate-500">
                            说明：默认使用内置的 mock API（mock://local）。上线时只需填写真实服务地址即可切换数据源。
                        </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <Button onClick={handleSave}>
                            保存配置
                        </Button>
                        <Button variant="outline" onClick={handleReset}>
                            恢复默认
                        </Button>
                        {saved && <span className="text-sm text-emerald-300">已保存</span>}
                    </div>
                    <div className="rounded-xl border border-slate-800/60 bg-slate-900/60 p-4 text-sm text-slate-300">
                        <p className="font-medium text-white">使用建议</p>
                        <ul className="mt-2 space-y-1 text-slate-400">
                            <li>• mock://local：使用内置 mock api。</li>
                            <li>• /api 或 http(s):// 开头的地址：通过真实 REST 服务拉取画像数据。</li>
                            <li>• 切换后重新打开画像页面即可访问新的数据源。</li>
                        </ul>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;
