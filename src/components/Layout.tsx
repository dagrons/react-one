import { useState } from 'react';
import Sidebar from './Sidebar';
import { Outlet } from 'react-router-dom';
import { cn } from "@/lib/utils";

const Layout = () => {
    const [isSidebarVisible, setIsSidebarVisible] = useState(true);

    const toggleSidebarVisibility = () => {
        setIsSidebarVisible(!isSidebarVisible);
    };

    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-950 text-slate-100">
            {isSidebarVisible && (
                <aside className="h-full bg-slate-950/90 backdrop-blur-sm">
                    <Sidebar
                        isVisible={isSidebarVisible}
                        onToggleVisibility={toggleSidebarVisibility}
                    />
                </aside>
            )}

            <main
                className={cn(
                    "relative flex-1 overflow-y-auto bg-gradient-to-br from-slate-950 via-slate-950/95 to-slate-900/90 p-8 transition-all duration-300",
                    !isSidebarVisible && "w-full"
                )}
            >
                {!isSidebarVisible && (
                    <Sidebar
                        isVisible={isSidebarVisible}
                        onToggleVisibility={toggleSidebarVisibility}
                    />
                )}
                <Outlet />
            </main>
        </div>
    );
};

export default Layout;
