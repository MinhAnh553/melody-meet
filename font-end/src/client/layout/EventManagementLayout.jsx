import React, { useEffect, useState } from 'react';
import { Outlet, useLocation, useParams } from 'react-router-dom';

import SidebarEvent from '../components/SidebarEvent';
import HeaderEvent from '../components/HeaderEvent';
import api from '../../util/api';
import { useLoading } from '../context/LoadingContext';

const EventManagement = () => {
    const { eventId } = useParams();
    const location = useLocation();
    const [nameEvent, setNameEvent] = useState('');

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.getEventById(eventId);
                if (res.success) {
                    setNameEvent(res.event.name);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu doanh thu:', error);
            }
        };
        if (eventId) fetchEvent();
    }, [eventId]);

    return (
        <>
            <div className="d-flex">
                <SidebarEvent />
                <div className="content w-100">
                    <main style={{ maxWidth: '100%' }}>
                        {location.pathname !== '/event/create' &&
                            location.pathname !== `/event/${eventId}/edit` && (
                                <HeaderEvent name={nameEvent} />
                            )}

                        <Outlet />
                    </main>
                </div>
            </div>
        </>
    );
};

export default EventManagement;
