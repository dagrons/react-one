import {Card, CardContent, CardHeader, CardTitle} from "../components/ui/card";

const CodeEditorPage = () => {
    return (
        <div>
            <h1 className="text-2xl font-bold mb-6">代码编辑器</h1>
            <Card>
                <CardHeader>
                    <CardTitle>代码编辑器功能</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-gray-500">此功能正在开发中...</p>
                </CardContent>
            </Card>
        </div>
    );
};

export default CodeEditorPage;