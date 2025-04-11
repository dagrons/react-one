import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from 'react-router-dom';
import { TreePine, BarChart, FileCode, Settings } from 'lucide-react';

const HomePage = () => {
    const navigate = useNavigate();

    const features = [
        {
            title: "二叉树可视化",
            description: "可视化展示二叉树结构，支持缩放和拖拽",
            icon: TreePine,
            path: "/tree-visualizer"
        },
        {
            title: "数据图表",
            description: "创建各种类型的交互式数据图表",
            icon: BarChart,
            path: "/charts"
        },
        {
            title: "代码编辑器",
            description: "在线编辑和运行代码",
            icon: FileCode,
            path: "/code-editor"
        },
        {
            title: "设置",
            description: "自定义应用设置和主题",
            icon: Settings,
            path: "/settings"
        }
    ];

    return (
        <div>
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold mb-2">数据可视化工具</h1>
                <p className="text-gray-500 dark:text-gray-400">
                    一站式数据可视化和分析平台
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {features.map((feature, index) => (
                    <Card key={index} className="hover:shadow-md transition-shadow">
                        <CardHeader className="flex flex-row items-center gap-4">
                            <feature.icon className="h-8 w-8 text-primary" />
                            <div>
                                <CardTitle>{feature.title}</CardTitle>
                                <CardDescription>{feature.description}</CardDescription>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Button onClick={() => navigate(feature.path)}>
                                打开 {feature.title}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
};

export default HomePage;