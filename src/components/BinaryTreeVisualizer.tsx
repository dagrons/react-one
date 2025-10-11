import { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import { ZoomIn, ZoomOut, MoveHorizontal } from "lucide-react";

// 二叉树节点类型
interface BinaryTreeNode {
    [key: string]: any; // 允许任何属性
}

// 内部使用的格式化节点类型
interface FormattedNode {
    id: string;
    attributes: { key: string; value: any }[];
    children: FormattedNode[];
}

const BinaryTreeVisualizer = () => {
    // 示例JSON数据
    const [jsonInput, setJsonInput] = useState('{\n  "v": 10,\n  "lazy": 0,\n  "left": {\n    "v": 5,\n    "lazy": 2,\n    "left": {\n      "v": 3,\n      "lazy": 0\n    },\n    "right": {\n      "v": 7,\n      "lazy": 1\n    }\n  },\n  "right": {\n    "v": 15,\n    "lazy": 0,\n    "left": {\n      "v": 12,\n      "lazy": 0\n    },\n    "right": {\n      "v": 18,\n      "lazy": 3\n    }\n  }\n}');
    const [error, setError] = useState('');
    const svgRef = useRef(null);
    const [nextNodeId, setNextNodeId] = useState(0);
    const [zoomLevel, setZoomLevel] = useState(1);

    // 定义全局缩放行为
    const zoomBehavior = d3.zoom()
        .scaleExtent([0.1, 5])
        .on("zoom", (event) => {
            if (svgRef.current) {
                d3.select(svgRef.current)
                    .select("g.main-container")
                    .attr("transform", event.transform);
                setZoomLevel(event.transform.k);
            }
        });

    // 将二叉树JSON转换为可视化格式
    const convertBinaryTreeToFormat = (node: BinaryTreeNode): FormattedNode => {
        if (!node) return null;

        // 为节点创建唯一ID
        const nodeId = `node-${nextNodeId}`;
        setNextNodeId(prevId => prevId + 1);

        // 提取所有属性（除了left和right）
        const attributes = Object.entries(node)
            .filter(([key]) => key !== 'left' && key !== 'right')
            .map(([key, value]) => ({ key, value }));

        // 创建当前节点
        const formattedNode: FormattedNode = {
            id: nodeId,
            attributes,
            children: []
        };

        // 添加左右子节点
        if (node.left) {
            const leftNode = convertBinaryTreeToFormat(node.left);
            if (leftNode) {
                formattedNode.children.push(leftNode);
            }
        }

        if (node.right) {
            const rightNode = convertBinaryTreeToFormat(node.right);
            if (rightNode) {
                formattedNode.children.push(rightNode);
            }
        }

        return formattedNode;
    };

    // 解析JSON并渲染树
    const parseJson = () => {
        try {
            const parsed = JSON.parse(jsonInput);
            setError('');
            setNextNodeId(0); // 重置节点ID计数器

            // 将二叉树JSON转换为可视化格式
            const treeData = convertBinaryTreeToFormat(parsed);
            renderTree(treeData);
            return treeData;
        } catch (err) {
            setError('无效的JSON: ' + err.message);
            return null;
        }
    };

    // 渲染树结构
    const renderTree = (data: FormattedNode) => {
        if (!svgRef.current || !data) return;

        // 清除SVG
        const svg = d3.select(svgRef.current);
        svg.selectAll("*").remove();

        const width = parseInt(svg.attr("width"));
        const height = parseInt(svg.attr("height"));
        const nodeWidth = 120;
        const nodeHeight = 30;
        const margin = { top: 60, right: 20, bottom: 20, left: 20 };

        // 创建层次结构
        const root = d3.hierarchy(data, d => d.children);

        // 设置树布局
        const treeLayout = d3.tree()
            .nodeSize([nodeWidth * 2, nodeHeight * 6]) // 设置节点尺寸
            .separation((a, b) => a.parent === b.parent ? 1.5 : 2); // 调整兄弟节点和堂兄弟节点的间距

        // 应用布局
        const rootNode = treeLayout(root);

        // 处理节点位置
        rootNode.descendants().forEach(d => {
            // 交换x和y坐标，使树从上到下生长
            [d.x, d.y] = [d.x, d.y];
        });

        // 设置缩放行为
        svg.call(zoomBehavior as any)
            .on("dblclick.zoom", null); // 禁用双击缩放

        // 初始化缩放并居中根节点
        zoomBehavior.transform(
            svg as any,
            d3.zoomIdentity.translate(width/2, margin.top)
        );

        // 创建主容器
        const g = svg.append("g")
            .attr("class", "main-container")
            .attr("transform", `translate(${width/2}, ${margin.top})`);

        // 添加连接线
        g.selectAll("path.link")
            .data(rootNode.links())
            .enter()
            .append("path")
            .attr("class", "link")
            .attr("fill", "none")
            .attr("stroke", "#ccc")
            .attr("stroke-width", 2)
            .attr("d", d3.linkVertical()
                .x(d => d.x)
                .y(d => d.y));

        // 添加节点组
        const nodeGroups = g.selectAll("g.node")
            .data(rootNode.descendants())
            .enter()
            .append("g")
            .attr("class", d => `node ${d.children ? "node-internal" : "node-leaf"}`)
            .attr("transform", d => `translate(${d.x},${d.y})`);

        // 添加节点背景矩形
        nodeGroups.append("rect")
            .attr("width", (d) => {
                // 根据属性数量确定矩形宽度
                return Math.max(nodeWidth, d.data.attributes.length * 20 + 40);
            })
            .attr("height", (d) => {
                // 根据属性数量确定矩形高度
                return Math.max(nodeHeight, d.data.attributes.length * 20 + 10);
            })
            .attr("x", (d) => {
                // 使矩形水平居中
                return -Math.max(nodeWidth, d.data.attributes.length * 20 + 40) / 2;
            })
            .attr("y", -15) // 垂直位置上移一点
            .attr("rx", 6) // 圆角矩形
            .attr("ry", 6)
            .attr("fill", d => {
                // 根据深度设置颜色
                const colors = ["#fcb69f", "#c2e9fb", "#d4fc79", "#a1c4fd"];
                return colors[d.depth % colors.length];
            })
            .attr("stroke", "#666")
            .attr("stroke-width", 1)
            .attr("opacity", 0.8);

        // 为每个属性添加文本
        nodeGroups.each(function(d) {
            const node = d3.select(this);
            const rectWidth = Math.max(nodeWidth, d.data.attributes.length * 20 + 40);

            // 添加属性文本
            d.data.attributes.forEach((attr, i) => {
                node.append("text")
                    .attr("x", -rectWidth/2 + 10) // 左对齐，有一点内边距
                    .attr("y", -15 + 20 + i * 20) // 根据索引定位每行
                    .text(`${attr.key}: ${attr.value}`)
                    .attr("font-size", "12px")
                    .attr("fill", "#333");
            });
        });

        // 添加交互提示
        svg.append("text")
            .attr("x", 20)
            .attr("y", 30)
            .attr("class", "instruction-text")
            .attr("font-size", "14px")
            .attr("fill", "#666")
            .text("滚轮缩放 - 拖拽移动");
    };

    // 缩放控制函数
    const handleZoomIn = () => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);

        zoomBehavior.scaleBy(svg.transition().duration(300) as any, 1.5);
    };

    const handleZoomOut = () => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);

        zoomBehavior.scaleBy(svg.transition().duration(300) as any, 0.75);
    };

    const handleReset = () => {
        if (!svgRef.current) return;
        const svg = d3.select(svgRef.current);
        const width = parseInt(svg.attr("width"));

        zoomBehavior.transform(
            svg.transition().duration(500) as any,
            d3.zoomIdentity.translate(width/2, 60)
        );
    };

    // 初始化渲染
    useEffect(() => {
        if (jsonInput) {
            parseJson();
        }
    }, []);

    return (
        <div className="flex flex-col gap-4">
            <Card>
                <CardHeader>
                    <CardTitle>二叉树 JSON 输入</CardTitle>
                    <CardDescription>输入二叉树结构的 JSON 数据</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="mb-2 rounded-xl border border-slate-800/60 bg-slate-900/70 p-4 text-sm">
                            <p className="mb-2 font-medium text-slate-100">数据格式说明:</p>
                            <ul className="list-disc pl-5 space-y-1">
                                <li className="text-slate-400">每个节点可以包含任意属性</li>
                                <li className="text-slate-400">
                                    使用 <code className="rounded bg-slate-800/80 px-1 text-sky-300">left</code> 属性指向左子节点
                                </li>
                                <li className="text-slate-400">
                                    使用 <code className="rounded bg-slate-800/80 px-1 text-sky-300">right</code> 属性指向右子节点
                                </li>
                            </ul>
                        </div>
                        <textarea
                            className="font-mono h-60 w-full rounded-xl border border-slate-800/70 bg-slate-950/80 p-4 text-slate-100 focus:border-sky-500/60 focus:outline-none focus:ring-0"
                            value={jsonInput}
                            onChange={e => setJsonInput(e.target.value)}
                            placeholder='{\n  "v": 10,\n  "lazy": 0,\n  "left": {\n    "v": 5,\n    "lazy": 0\n  },\n  "right": {\n    "v": 15,\n    "lazy": 0\n  }\n}'
                        />
                        {error && <div className="text-red-500 p-2 bg-red-50 rounded-md">{error}</div>}
                        <div className="flex gap-2">
                            <Button onClick={parseJson} className="w-full">可视化二叉树</Button>
                            <Button
                                variant="outline"
                                onClick={() => {
                                    setJsonInput('{\n  "v": 10,\n  "lazy": 0,\n  "left": {\n    "v": 5,\n    "lazy": 2,\n    "left": {\n      "v": 3,\n      "lazy": 0\n    },\n    "right": {\n      "v": 7,\n      "lazy": 1\n    }\n  },\n  "right": {\n    "v": 15,\n    "lazy": 0,\n    "left": {\n      "v": 12,\n      "lazy": 0\n    },\n    "right": {\n      "v": 18,\n      "lazy": 3\n    }\n  }\n}');
                                }}
                                className="flex-shrink-0"
                            >
                                重置示例
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>二叉树可视化</CardTitle>
                    <CardDescription>二叉树结构图形表示 - 可缩放和移动</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex flex-col gap-4">
                        <div className="flex gap-2 justify-end mb-2">
                            <Button onClick={handleZoomIn} variant="outline" size="sm" title="放大">
                                <ZoomIn className="h-4 w-4 mr-1" /> 放大
                            </Button>
                            <Button onClick={handleZoomOut} variant="outline" size="sm" title="缩小">
                                <ZoomOut className="h-4 w-4 mr-1" /> 缩小
                            </Button>
                            <Button onClick={handleReset} variant="outline" size="sm" title="重置视图">
                                <MoveHorizontal className="h-4 w-4 mr-1" /> 重置视图
                            </Button>
                            <div className="ml-2 rounded border border-slate-800/60 bg-slate-900/60 px-2 py-1 text-sm text-slate-300">
                                缩放: {Math.round(zoomLevel * 100)}%
                            </div>
                        </div>
                        <div className="flex justify-center overflow-hidden rounded-xl border border-slate-800/70 bg-slate-950/80">
                            <svg
                                ref={svgRef}
                                width="1000"
                                height="800"
                                className="bg-slate-950"
                                style={{ cursor: "move" }}
                            ></svg>
                        </div>
                        <div className="mt-2 text-sm text-slate-400">
                            <p><strong>交互说明:</strong> 使用鼠标滚轮或触摸板缩放，按住鼠标拖动可平移视图</p>
                            <p><strong>节点内容:</strong> 显示节点的所有属性（除了left和right）</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};

export default BinaryTreeVisualizer;
