import React, { useState } from 'react';
import { Home, TreePine, BarChart, Settings, FileCode, ChevronLeft, ChevronRight, Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from "./ui/button";

interface SidebarItemProps {
    icon: React.ElementType;
    label: string;
    href: string;
    active?: boolean;
    collapsed?: boolean;
}

const SidebarItem = ({ icon: Icon, label, href, active, collapsed }: SidebarItemProps) => {
    const navigate = useNavigate();

    return (
        <div
            className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-gray-500 transition-all hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50",
                active ? "bg-gray-100 text-gray-900 dark:bg-gray-800 dark:text-gray-50" : "hover:bg-gray-100 dark:hover:bg-gray-800"
            )}
            onClick={() => navigate(href)}
            style={{ cursor: 'pointer' }}
            title={label}
        >
            <Icon className="h-5 w-5 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
        </div>
    );
};

interface SidebarProps {
    isVisible: boolean;
    onToggleVisibility: () => void;
}

const Sidebar = ({ isVisible, onToggleVisibility }: SidebarProps) => {
    const location = useLocation();
    const currentPath = location.pathname;
    const [collapsed, setCollapsed] = useState(false);

    const menuItems = [
        { icon: Home, label: '首页', href: '/' },
        { icon: TreePine, label: '二叉树可视化', href: '/tree-visualizer' },
        { icon: BarChart, label: '数据图表', href: '/charts' },
        { icon: FileCode, label: '代码编辑器', href: '/code-editor' },
        { icon: Settings, label: '设置', href: '/settings' },
    ];

    // 如果侧边栏不可见，只渲染切换按钮
    if (!isVisible) {
        return (
            <div className="fixed top-4 left-4 z-20">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={onToggleVisibility}
                    className="rounded-full shadow-md"
                    aria-label="显示侧边栏"
                >
                    <Menu className="h-5 w-5" />
                </Button>
            </div>
        );
    }

    return (
        <div
            className={cn(
                "flex h-full flex-col border-r bg-white dark:bg-gray-950 dark:border-gray-800 transition-all duration-300 relative",
                collapsed ? "w-16" : "w-64"
            )}
        >
            <div className={cn("p-4 flex", collapsed ? "justify-center" : "justify-between")}>
                {!collapsed && <h2 className="text-xl font-bold">数据可视化工具</h2>}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn("rounded-full", collapsed && "ml-0")}
                    aria-label={collapsed ? "展开侧边栏" : "折叠侧边栏"}
                >
                    {collapsed ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            <div className="flex-1 px-3 py-2">
                <div className="space-y-1">
                    {menuItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            icon={item.icon}
                            label={item.label}
                            href={item.href}
                            active={currentPath === item.href}
                            collapsed={collapsed}
                        />
                    ))}
                </div>
            </div>

            <div className={cn("border-t p-3 dark:border-gray-800", collapsed ? "text-center" : "")}>
                {!collapsed && (
                    <div className="text-sm text-gray-500 dark:text-gray-400">
                        版本 1.0.0
                    </div>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleVisibility}
                    className="mt-2"
                    aria-label="隐藏侧边栏"
                >
                    {collapsed ? <Menu className="h-4 w-4" /> : "隐藏侧边栏"}
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;