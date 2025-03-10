import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';

import SidebarEvent from '../components/SidebarEvent';
import HeaderEvent from '../components/HeaderEvent';

const EventManagement = () => {
    const location = useLocation();
    return (
        <>
            <div className="d-flex">
                <SidebarEvent />
                <div className="content w-100">
                    <main style={{ maxWidth: '100%' }}>
                        {location.pathname !== '/event/create' && (
                            <HeaderEvent />
                        )}

                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default EventManagement;
