import { useState, useEffect, useRef } from 'react';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "./components/ui/card.tsx";
import {Button} from "./components/ui/button.tsx";
import * as d3 from 'd3';
import {ScaleLinear} from "d3";

const data = [
    { month: '一月', value: 30 },
    { month: '二月', value: 45 },
    { month: '三月', value: 60 },
    { month: '四月', value: 40 },
    { month: '五月', value: 70 },
    { month: '六月', value: 55 },
    { month: '七月', value: 80 },
    { month: '八月', value: 65 },
    { month: '九月', value: 75 },
    { month: '十月', value: 85 },
    { month: '十一月', value: 50 },
    { month: '十二月', value: 90 }
];

const App = () => {
    const [chartData, setChartData] = useState(data);
    const [barColor, setBarColor] = useState("#3b82f6"); // 蓝色
    const svgRef = useRef(null);

    // 随机更新数据的函数
    const updateData = () => {
        const newData = chartData.map(item => ({
            ...item,
            value: Math.floor(Math.random() * 100)
        }));
        setChartData(newData);
    };

    // 使用D3.js渲染图表
    useEffect(() => {
        if (!svgRef.current) return;

        // 清除之前的图表
        d3.select(svgRef.current).selectAll("*").remove();

        // 设置图表尺寸
        const margin = { top: 20, right: 30, bottom: 40, left: 50 };
        const width = 800 - margin.left - margin.right;
        const height = 400 - margin.top - margin.bottom;

        // 创建SVG元素
        const svg = d3.select(svgRef.current)
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        // 创建X轴比例尺
        const x = d3.scaleBand()
            .domain(chartData.map(d => d.month))
            .range([0, width])
            .padding(0.2);

        // 创建Y轴比例尺
        let y: ScaleLinear<number, number, never>;
        y = d3.scaleLinear()
            .domain([0, d3.max(chartData, d => d.value)])
            .nice()
            .range([height, 0]);

        // 绘制X轴
        svg.append("g")
            .attr("transform", `translate(0,${height})`)
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("transform", "rotate(-45)")
            .style("text-anchor", "end");

        // 绘制Y轴
        svg.append("g")
            .call(d3.axisLeft(y));

        // 绘制柱状图
        svg.selectAll(".bar")
            .data(chartData)
            .enter()
            .append("rect")
            .attr("class", "bar")
            .attr("x", d => x(d.month))
            .attr("y", d => y(d.value))
            .attr("width", x.bandwidth())
            .attr("height", d => height - y(d.value))
            .attr("fill", barColor)
            .on("mouseover", function() {
                d3.select(this).attr("fill", "#f97316"); // 淡橙色
            })
            .on("mouseout", function() {
                d3.select(this).attr("fill", barColor);
            });

        // 添加柱状图上方的数值标签
        svg.selectAll(".label")
            .data(chartData)
            .enter()
            .append("text")
            .attr("class", "label")
            .attr("x", d => x(d.month) + x.bandwidth() / 2)
            .attr("y", d => y(d.value) - 5)
            .attr("text-anchor", "middle")
            .text(d => d.value);

        // 添加图表标题
        svg.append("text")
            .attr("x", width / 2)
            .attr("y", 0 - margin.top / 2)
            .attr("text-anchor", "middle")
            .style("font-size", "16px")
            .text("月度数据统计");

    }, [chartData, barColor]);

    // 颜色选项
    const colors = [
        { name: "蓝色", value: "#3b82f6" },
        { name: "绿色", value: "#10b981" },
        { name: "红色", value: "#ef4444" },
        { name: "紫色", value: "#8b5cf6" },
        { name: "黄色", value: "#f59e0b" }
    ];

    return (
        <div className="p-8">
            <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-6 text-center">Vite + React + Tailwind CSS + Shadcn UI + D3.js 示例应用</h1>

                <div className="grid gap-6 mb-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>月度数据图表</CardTitle>
                            <CardDescription>使用D3.js和React创建的交互式柱状图</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="flex justify-end mb-4 space-x-2">
                                <Button onClick={updateData} variant="default">随机更新数据</Button>

                                <div className="flex items-center space-x-3">
                                    <span className="text-sm font-medium">图表颜色:</span>
                                    <div className="flex space-x-2">
                                        {colors.map((color) => (
                                            <button
                                                key={color.value}
                                                className="w-8 h-8 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                                style={{ backgroundColor: color.value }}
                                                onClick={() => setBarColor(color.value)}
                                                title={color.name}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="border rounded-lg p-4 bg-white overflow-auto">
                                <svg ref={svgRef}></svg>
                            </div>
                        </CardContent>
                    </Card>

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
                                <div className="p-4 border rounded-lg md:col-span-2">
                                    <h3 className="font-semibold text-lg mb-2">D3.js</h3>
                                    <p>强大的JavaScript数据可视化库，允许创建复杂的交互式图表和可视化</p>
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