import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight, Home, Menu, Settings, User2Icon } from "lucide-react";
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
                "group flex items-center gap-3 rounded-xl px-3 py-2 text-slate-400 transition-all hover:text-slate-100",
                active
                    ? "bg-slate-800/80 text-sky-400 shadow-inner shadow-sky-500/10"
                    : "hover:bg-slate-900/60 hover:shadow hover:shadow-slate-900/60"
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
        { icon: User2Icon, label: '用户画像', href: '/user-profile'},
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
                "relative flex h-full flex-col border-r border-slate-800/70 bg-slate-950/95 transition-all duration-300 backdrop-blur-sm",
                collapsed ? "w-20" : "w-[17rem]"
            )}
        >
            <div className={cn("flex p-4", collapsed ? "justify-center" : "justify-between")}>
                {!collapsed && (
                    <div>
                        <h2 className="text-xl font-semibold text-white">DGP-Extend</h2>
                        <p className="text-xs uppercase tracking-[0.2em] text-slate-500">行为洞察中枢</p>
                    </div>
                )}
                <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setCollapsed(!collapsed)}
                    className={cn(
                        "rounded-full border border-slate-700/60 bg-slate-900/70 text-slate-200 hover:bg-slate-800",
                        collapsed && "ml-0"
                    )}
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

            <div className={cn("border-t border-slate-800/70 p-3", collapsed ? "text-center" : "")}>
                {!collapsed && (
                    <div className="text-xs uppercase tracking-widest text-slate-500">
                        版本 1.0.0
                    </div>
                )}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onToggleVisibility}
                    className="mt-2 border-slate-700/60 bg-slate-900/70 text-slate-200 hover:bg-slate-800"
                    aria-label="隐藏侧边栏"
                >
                    {collapsed ? <Menu className="h-4 w-4" /> : "隐藏侧边栏"}
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
