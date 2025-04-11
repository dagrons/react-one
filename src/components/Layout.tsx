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
        <div className="flex h-screen w-full overflow-hidden">
            {isSidebarVisible && (
                <aside className="h-full">
                    <Sidebar
                        isVisible={isSidebarVisible}
                        onToggleVisibility={toggleSidebarVisibility}
                    />
                </aside>
            )}

            <main
                className={cn(
                    "flex-1 overflow-y-auto p-6 bg-gray-50 dark:bg-gray-900 transition-all duration-300",
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