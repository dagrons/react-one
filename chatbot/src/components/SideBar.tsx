// src/components/Sidebar.tsx
import React from 'react';
import {IconButton, INavLink, INavLinkGroup, Nav} from '@fluentui/react';
import {useNavigate} from 'react-router-dom';

interface SidebarProps {
    isOpen: boolean;
    onDismiss: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, onDismiss }) => {
    const navigate = useNavigate();

    const navLinkGroups: INavLinkGroup[] = [
        {
            links: [
                {
                    name: 'Home',
                    url: '/',
                    key: 'home',
                    onClick: (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
                        ev?.preventDefault();
                        navigate('/');
                    },
                },
                {
                    name: 'Chat',
                    url: '/chat',
                    key: 'chat',
                    onClick: (ev?: React.MouseEvent<HTMLElement>, item?: INavLink) => {
                        ev?.preventDefault();
                        navigate('/chat');
                    },
                },
            ],
        },
    ];

    return (
        <div style={{ display: isOpen ? 'block' : 'none', position: 'relative', width: 200, height: '100vh', border: '1px solid #eee', boxSizing: 'border-box' }}>
            <div className={['ms-Nav-navItem', 'navItem-115'].join(' ')} style={{ display: 'flex', justifyContent: 'flex-end', margin: '10px' }}>
                <IconButton
                    iconProps={{ iconName: 'Cancel' }}
                    onClick={onDismiss}
                    styles={{ root: {top: 10, right: 10, zIndex: 1 } }}
                />
            </div>
            <Nav
                groups={navLinkGroups}
                selectedKey="key3"
                styles={{
                    root: {
                        width: '100%',
                        height: '100%',
                        overflowY: 'auto',
                    },
                }}
            />
        </div>
    );
};

export default Sidebar;
