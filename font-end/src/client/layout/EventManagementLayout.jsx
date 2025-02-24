import React from 'react';
import { Outlet } from 'react-router-dom';

import SidebarEvent from '../components/SidebarEvent';
import HeaderEvent from '../components/HeaderEvent';

const EventManagement = () => {
    return (
        <>
            <div className="d-flex">
                <SidebarEvent />
                <div className="content w-100">
                    <HeaderEvent />
                    <main>
                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default EventManagement;
