import React, { useEffect, useState } from 'react';
import api from '../../../util/api';
import EventList from '../../components/EventList';

const AllEvents = () => {
    const [events, setEvents] = useState([]);

    useEffect(() => {
        fetchEvents();
    }, []);
    const fetchEvents = async () => {
        try {
            const res = await api.getEvents('all');
            return res.success ? setEvents(res.events) : [];
        } catch (error) {
            console.log(`fetchEvents() -> error:`, error);
        }
    };
    return (
        <section className="events py-4" style={{ marginTop: '80px' }}>
            <EventList events={events} />
        </section>
    );
};

export default AllEvents;
