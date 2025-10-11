import { Settings, User2Icon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "用户画像",
            description: "展示及分析用户行为",
            icon: User2Icon,
            path: "/user-profile"
        },
        {
            title: "设置",
            description: "自定义应用设置和主题",
            icon: Settings,
            path: "/settings"
        }
    ];

    return (
        <div className="space-y-10">
            <div className="rounded-3xl border border-slate-800/70 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 p-10 shadow-xl shadow-slate-950/50">
                <div className="space-y-4 text-center">
                    <div className="inline-flex items-center gap-2 rounded-full border border-slate-700/60 bg-slate-900/60 px-4 py-2 text-xs uppercase tracking-[0.4em] text-slate-400">
                        DGP · EXTEND
                    </div>
                    <h1 className="text-4xl font-semibold text-white">
                        数据中台扩展分析与展示平台
                    </h1>
                    <p className="text-base text-slate-400">
                        聚焦门禁与系统行为的一体化洞察，为安全决策与运营赋能。
                    </p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                {features.map((feature, index) => (
                    <Card
                        key={index}
                        className="group border-slate-800/70 bg-slate-950/70 p-0 transition hover:-translate-y-1 hover:border-sky-500/60 hover:shadow-2xl hover:shadow-sky-500/20"
                    >
                        <CardHeader className="flex flex-row items-center gap-4 pb-2">
                            <div className="rounded-2xl border border-slate-700/60 bg-slate-900/70 p-3 text-sky-300 transition group-hover:border-sky-500/60 group-hover:text-sky-200">
                                <feature.icon className="h-7 w-7" />
                            </div>
                            <div>
                                <CardTitle className="text-xl text-white">{feature.title}</CardTitle>
                                <CardDescription className="text-sm text-slate-400">
                                    {feature.description}
                                </CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent className="pb-6">
                            <Button
                                onClick={() => navigate(feature.path)}
                                className="w-full justify-between"
                            >
                                打开 {feature.title}
                                <feature.icon className="h-5 w-5" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default HomePage;
