import React from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import SidebarEvent from '../components/SidebarEvent';
import HeaderEvent from '../components/HeaderEvent';

const EventManagement = () => {
    const { eventId } = useParams();
    const location = useLocation();
    return (
        <>
            <div className="d-flex">
                <SidebarEvent />
                <div className="content w-100">
                    <main style={{ maxWidth: '100%' }}>
                        {location.pathname !== '/event/create' &&
                            location.pathname !== `/event/${eventId}/edit` && (
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
