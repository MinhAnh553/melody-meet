import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../util/api';

const EventList = () => {
    const [events, setEvents] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const res = await api.getEvents();
                if (res.success) {
                    setEvents(res.events);
                }
            } catch (error) {
                console.log('MinhAnh553: fetchEvents -> error', error);
            }
        };

        fetchEvents();
    }, []);

    const formatCurrency = (price) => {
        return price.toLocaleString('vi-VN') + 'đ';
    };

    return (
        <div className="row g-4">
            {events.map((event) => {
                // Sắp xếp giá vé từ thấp đến cao
                const sortedTickets = [...event.ticketTypes].sort(
                    (a, b) => a.price - b.price,
                );
                const lowestPrice =
                    sortedTickets.length > 0
                        ? sortedTickets[0].price === 0
                            ? 'Miễn phí'
                            : `Từ ${formatCurrency(sortedTickets[0].price)}`
                        : 'Miễn phí';

                return (
                    <div
                        className="event-card col-md-6 col-lg-3"
                        key={event._id}
                        onClick={() => navigate(`/event/${event._id}`)}
                        style={{ cursor: 'pointer' }}
                    >
                        <img src={event.background} alt={event.name} />
                        <div className="event-content bg-dark text-white">
                            <h3>{event.name}</h3>
                            <p className="date text-white">
                                <i className="bi bi-calendar3" />{' '}
                                {new Date(event.startTime).toLocaleDateString(
                                    'vi-VN',
                                    {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric',
                                    },
                                )}
                            </p>
                            <p className="location text-white">
                                <i className="bi bi-geo-alt" />{' '}
                                {event.location.venueName}
                            </p>
                            <p
                                className="price"
                                style={{ color: 'rgb(45, 194, 117)' }}
                            >
                                <i className="bi bi-tag" /> {lowestPrice}
                            </p>
                            <button className="btn btn-primary w-100">
                                Book Now
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default EventList;
