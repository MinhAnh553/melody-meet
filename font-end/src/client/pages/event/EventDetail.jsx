import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../../../util/api';
import TimeText from '../../components/providers/TimeText';
import DOMPurify from 'dompurify';
import TicketModal from './TicketModal';

const EventDetail = () => {
    const { eventId } = useParams();
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false); // Quản lý hiển thị Modal

    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await api.getEventById(eventId);
                if (res.success) {
                    setEvent(res.event);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu sự kiện:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchEvent();
    }, [eventId]);

    if (loading) return <div className="container py-5">Đang tải...</div>;
    if (!event)
        return <div className="container py-5">Không tìm thấy sự kiện!</div>;

    // Sắp xếp vé từ thấp đến cao
    const sortedTickets = [...event.ticketTypes].sort(
        (a, b) => a.price - b.price,
    );

    // Định dạng giá
    const formatPrice = (price) =>
        price === 0
            ? 'Miễn phí'
            : 'Giá từ ' + price.toLocaleString('vi-VN') + ' đ';

    const lowestPrice = sortedTickets.length
        ? formatPrice(sortedTickets[0].price)
        : 'Miễn phí';

    const sanitizedDescription = DOMPurify.sanitize(event.description);

    // Hàm mở modal mua vé
    const handleBuyNow = () => {
        setShowModal(true);
    };
    return (
        <>
            {/* Phần banner (đã có sẵn) */}
            <div
                className="container-fluid py-4"
                style={{
                    backgroundColor: '#121212',
                    margin: '80px 0',
                    borderRadius: '20px',
                }}
            >
                <div className="container">
                    <div className="row g-4 align-items-center">
                        {/* Cột trái */}
                        <div className="col-md-5 text-white">
                            <h1 className="fw-bold mb-3">{event.name}</h1>

                            <p
                                className="mb-2"
                                style={{ color: '#bdbdbd', fontSize: '1.1rem' }}
                            >
                                <i className="bi bi-clock"></i>
                                <span style={{ color: 'rgb(45, 194, 117)' }}>
                                    <TimeText event={event} />
                                </span>
                            </p>

                            <p
                                className="mb-5"
                                style={{ color: '#bdbdbd', fontSize: '1rem' }}
                            >
                                <i className="bi bi-geo-alt-fill"></i>{' '}
                                <span style={{ color: 'rgb(45, 194, 117)' }}>
                                    {event.location.venueName}
                                </span>
                                <br />
                                <span style={{ marginLeft: '22px' }}>
                                    {event.location.address},{' '}
                                    {event.location.ward},{' '}
                                    {event.location.district},{' '}
                                    {event.location.province}
                                </span>
                            </p>
                            <hr
                                style={{ background: 'white', height: '1.5px' }}
                            />
                            <p
                                className="fw-bold"
                                style={{
                                    color: 'rgb(45, 194, 117)',
                                    fontSize: '1.3rem',
                                }}
                            >
                                {lowestPrice}
                            </p>

                            <button
                                className="btn btn-success btn-lg mt-2"
                                onClick={handleBuyNow}
                            >
                                Mua vé ngay
                            </button>
                        </div>

                        {/* Cột phải */}
                        <div className="col-md-7 text-center">
                            <img
                                src={event.background}
                                alt="Concert Banner"
                                className="img-fluid rounded shadow"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Phần giới thiệu (nằm dưới banner) */}
            <div className="container my-5">
                <h2 className="text-white mb-3">Giới thiệu</h2>
                <div
                    className="card p-4 border-0"
                    style={{ backgroundColor: '#1e1e1e' }}
                >
                    {/* Nếu có ảnh mô tả giới thiệu riêng, hiển thị: */}
                    {event.descriptionImage && (
                        <img
                            src={event.descriptionImage}
                            alt="Giới thiệu"
                            className="img-fluid rounded mb-3"
                        />
                    )}

                    {/* Nội dung mô tả sự kiện */}
                    <p
                        className="event-description"
                        dangerouslySetInnerHTML={{
                            __html: sanitizedDescription,
                        }}
                        style={{ color: '#fff', whiteSpace: 'pre-line' }}
                    ></p>
                </div>
            </div>
            {/* Thông tin ban tổ chức */}
            <div className="container my-5">
                <h2 className="text-white mb-3">Ban Tổ Chức</h2>
                <div
                    className="card p-4 border-0"
                    style={{ backgroundColor: '#1e1e1e' }}
                >
                    <div className="d-flex align-items-center">
                        <img
                            src={event.organizer?.logo}
                            alt="Organizer Logo"
                            style={{
                                width: '100px',
                                height: '100px',
                                objectFit: 'cover',
                            }}
                            className="rounded me-3"
                        />
                        <div>
                            <h5 className="text-white mb-1">
                                {event.organizer?.name}
                            </h5>
                            <p style={{ color: '#fff' }}>
                                {event.organizer?.info}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Modal mua vé */}
            <TicketModal
                show={showModal}
                onHide={() => setShowModal(false)}
                event={event}
            />
        </>
    );
};

export default EventDetail;
