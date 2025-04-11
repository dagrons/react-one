import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const ChartsPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">数据图表</h1>
            <Card>
                <CardHeader>
                    <CardTitle>数据图表功能</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">此功能正在开发中...</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default ChartsPage;