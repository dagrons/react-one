// src/App.tsx
import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Home } from './components/Home';
import { Chat } from './page/Chat';
import Sidebar from './components/SideBar';
import { Stack, IconButton } from '@fluentui/react';
import {Provider} from "react-redux";
import {store} from "./store/store";
import { initializeIcons } from '@fluentui/react/lib/Icons';

initializeIcons();

const App: React.FC = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const toggleSidebar = () => {
        setIsSidebarOpen(!isSidebarOpen);
    };

    return (
        <Provider store={store}>
            <Router>
                <Stack horizontal styles={{ root: { height: '100vh' } }}>
                    <Sidebar isOpen={isSidebarOpen} onDismiss={() => setIsSidebarOpen(false)} />
                    <Stack.Item grow>
                        {!isSidebarOpen && (
                            <IconButton
                                iconProps={{ iconName: 'GlobalNavButton' }}
                                onClick={toggleSidebar}
                            />
                        )}
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/chat" element={<Chat />} />
                        </Routes>
                    </Stack.Item>
                </Stack>
            </Router>
        </Provider>
    );
};

export default App;
