import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

import {
    BsSearch,
    BsCalendarX,
    BsBagCheckFill,
    BsPencilSquare,
} from 'react-icons/bs';
import api from '../../../util/api';
import TimeText from '../../components/providers/TimeText';

const EventManagement = () => {
    const navigate = useNavigate();
    const [events, setEvents] = useState([]);

    // Phân trang
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);

    // Quản lý tab active
    const [activeTab, setActiveTab] = useState('upcoming');

    // Tìm kiếm
    const [searchKey, setSearchKey] = useState('');

    useEffect(() => {
        fetchEvents('approved', false);
    }, []);

    const handleSearch = () => {
        console.log('Tìm kiếm:', searchKey);
        // TODO: logic tìm kiếm sự kiện
        // fetchEvents('search'); // ví dụ
    };

    const handleUpcoming = () => {
        setActiveTab('upcoming');
        fetchEvents('approved', false);
    };

    const handlePast = () => {
        setActiveTab('past');
        fetchEvents('approved', true);
    };

    const handlePending = () => {
        setActiveTab('pending');
        fetchEvents('pending', false);
    };

    const fetchEvents = async (status, isFinished) => {
        try {
            const res = await api.getMyEvents(page, limit, status, isFinished);
            if (res.success) {
                setEvents(res.events);
                setTotal(res.totalEvents);
                setTotalPages(res.totalPages);
            } else {
                setEvents([]);
                setTotal(0);
                setTotalPages(1);
            }

            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.log('MinhAnh553: fetchEvents -> error', error);
        }
    };

    return (
        <Container
            fluid
            style={{
                minHeight: '100vh',
                color: '#fff',
                paddingTop: '20px',
            }}
        >
            {/* Thanh Tìm kiếm */}
            <Row className="mx-3 mb-3">
                <Col xs={12} md={6} className="mb-2 mb-md-0">
                    <form className="d-flex search-form">
                        <div className="input-group">
                            <span className="input-group-text">
                                <i className="bi bi-search" />
                            </span>
                            <input
                                className="form-control"
                                type="search"
                                placeholder="Tìm kiếm"
                                aria-label="Search"
                            />
                        </div>
                    </form>
                </Col>
                <Col
                    xs={12}
                    md="auto"
                    className="d-flex align-items-center mb-2 mb-md-0"
                >
                    <Button
                        variant={activeTab === 'upcoming' ? 'success' : 'dark'}
                        onClick={handleUpcoming}
                        className="me-2"
                        style={{ border: '1px solid #444' }}
                    >
                        Sắp tới
                    </Button>
                    <Button
                        variant={activeTab === 'past' ? 'success' : 'dark'}
                        onClick={handlePast}
                        className="me-2"
                        style={{ border: '1px solid #444' }}
                    >
                        Đã qua
                    </Button>
                    <Button
                        variant={activeTab === 'pending' ? 'success' : 'dark'}
                        onClick={handlePending}
                        style={{ border: '1px solid #444' }}
                    >
                        Chờ duyệt
                    </Button>
                </Col>
            </Row>

            {/* {activeTab === 'pending' && (
                <Row className="mx-3">
                    <Alert
                        variant="warning"
                        className="fw-bold text-dark"
                        style={{ backgroundColor: '#FFEB3B', border: 'none' }}
                    >
                        Lưu ý: Sự kiện đang chờ duyệt. Để đảm bảo tính bảo mật
                        cho sự kiện của bạn, quyền truy cập vào trang chi tiết
                        chỉ dành cho chủ sở hữu và quản trị viên được ủy quyền
                    </Alert>
                </Row>
            )} */}

            {/* Danh sách sự kiện */}
            <Row className="mx-3">
                {events.length === 0 ? (
                    <div className="text-center my-5">
                        <BsCalendarX size={50} className="text-white mb-3" />
                        <p className="fs-5 text-white">Không có sự kiện</p>
                    </div>
                ) : (
                    events.map((event) => (
                        <Card
                            key={event._id}
                            className="mb-3"
                            style={{
                                backgroundColor: '#31353e',
                                border: '1px solid #444',
                                borderRadius: '20px',
                            }}
                        >
                            <Card.Body className="p-3">
                                <Row>
                                    {/* Ảnh sự kiện */}
                                    <Col
                                        xs="auto"
                                        className="d-flex align-items-center"
                                    >
                                        <div
                                            style={{
                                                maxWidth: '300px',
                                                maxHeight: '300px',
                                            }}
                                        >
                                            <img
                                                className="img-fluid rounded shadow"
                                                src={event.background}
                                                alt={event.name}
                                                style={{
                                                    objectFit: 'cover',
                                                }}
                                            />
                                        </div>
                                    </Col>

                                    {/* Thông tin sự kiện */}
                                    <Col>
                                        <div className="mb-2">
                                            <h5
                                                className="fw-bold mb-3"
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                }}
                                            >
                                                {event.name}
                                            </h5>
                                            <p
                                                className="mb-2"
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                }}
                                            >
                                                <i className="bi bi-clock"></i>
                                                {'  '}
                                                <span
                                                    style={{
                                                        color: 'rgb(45, 194, 117)',
                                                    }}
                                                >
                                                    <TimeText event={event} />
                                                </span>
                                            </p>

                                            <p
                                                className="mb-5"
                                                style={{
                                                    color: '#fff',
                                                    fontSize: '1rem',
                                                }}
                                            >
                                                <i className="bi bi-geo-alt-fill"></i>
                                                {'   '}
                                                <span
                                                    style={{
                                                        color: 'rgb(45, 194, 117)',
                                                    }}
                                                >
                                                    {event.location.venueName}
                                                </span>
                                                <br />
                                                <span
                                                    style={{
                                                        marginLeft: '22px',
                                                    }}
                                                >
                                                    {event.location.address},{' '}
                                                    {event.location.ward},{' '}
                                                    {event.location.district},{' '}
                                                    {event.location.province}
                                                </span>
                                            </p>
                                        </div>
                                    </Col>
                                </Row>

                                <hr className="my-3 border-top border-light" />

                                <Row className="mt-3">
                                    <Col>
                                        <div
                                            className="d-flex align-items-center justify-content-center"
                                            style={{ gap: '12px' }}
                                        >
                                            <Button
                                                variant="dark"
                                                className="d-flex align-items-center gap-2"
                                                style={{
                                                    border: '1px solid #555',
                                                    borderRadius: '8px',
                                                }}
                                                onClick={() => {
                                                    navigate(
                                                        `/event/${event._id}/orders`,
                                                    );
                                                }}
                                            >
                                                <BsBagCheckFill />
                                                Đơn hàng
                                            </Button>
                                            <Button
                                                variant="dark"
                                                className="d-flex align-items-center gap-2"
                                                style={{
                                                    border: '1px solid #555',
                                                    borderRadius: '8px',
                                                }}
                                                onClick={() => {
                                                    // window.open(
                                                    //     `/event/${event._id}/edit`,
                                                    //     '_blank',
                                                    // );
                                                    navigate(
                                                        `/event/${event._id}/edit`,
                                                    );
                                                }}
                                            >
                                                <BsPencilSquare />
                                                Chỉnh sửa
                                            </Button>
                                        </div>
                                    </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    ))
                )}
            </Row>

            {/* TODO: Phân trang nếu muốn hiển thị */}
            {/* 
            <Row className="mx-3">
                <Col className="d-flex justify-content-end">
                    <Button
                        variant="dark"
                        disabled={page <= 1}
                        onClick={() => setPage(page - 1)}
                        className="me-2"
                    >
                        Trang trước
                    </Button>
                    <Button
                        variant="dark"
                        disabled={page >= totalPages}
                        onClick={() => setPage(page + 1)}
                    >
                        Trang sau
                    </Button>
                </Col>
            </Row> 
            */}
        </Container>
    );
};

export default EventManagement;
