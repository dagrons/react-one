import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./components/ui/card.tsx";


const App = () => {
    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Vite + React + Tailwind CSS + Shadcn UI + D3.js 示例应用</h1>
                <div className="grid gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>项目指南</CardTitle>
                            <CardDescription>此示例项目使用的技术栈及其功能</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="grid md:grid-cols-2 gap-4">
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Vite</h3>
                                    <p>现代前端构建工具，提供极速的开发体验</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">React</h3>
                                    <p>用于构建用户界面的JavaScript库</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Tailwind CSS</h3>
                                    <p>实用优先的CSS框架，用于快速UI开发</p>
                                </div>
                                <div className="p-4 border rounded-lg">
                                    <h3 className="font-semibold text-lg mb-2">Shadcn UI</h3>
                                    <p>可定制的UI组件库，基于Radix UI</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default App;