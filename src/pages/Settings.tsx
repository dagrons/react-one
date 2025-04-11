import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";

const SettingsPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">设置</h1>
            <Card>
                <CardHeader>
                    <CardTitle>应用设置</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">此功能正在开发中...</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default SettingsPage;