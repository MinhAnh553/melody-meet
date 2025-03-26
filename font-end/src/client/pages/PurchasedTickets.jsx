import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Nav } from 'react-bootstrap';
import { BsPerson, BsTicket, BsCalendar, BsChevronRight } from 'react-icons/bs';
import QRCode from 'react-qr-code';
import { Link, useNavigate } from 'react-router-dom';
import noTicket from '../../assets/images/no-ticket.png';
import api from '../../util/api';

function PurchasedTickets() {
    const navigate = useNavigate();

    // State cho danh sách đơn hàng
    const [orders, setOrders] = useState([]);
    // Phân trang
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(5);
    const [total, setTotal] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    // Quản lý tab active
    const [activeTab, setActiveTab] = useState('tickets');
    // Quản lý mở/đóng chi tiết cho từng đơn
    const [expandedOrders, setExpandedOrders] = useState({});

    const handleNavigation = (tab, path) => {
        setActiveTab(tab);
        navigate(path);
    };

    // Toggle mở/đóng cho 1 order
    const handleToggleOrder = (orderId) => {
        setExpandedOrders((prev) => ({
            ...prev,
            [orderId]: !prev[orderId],
        }));
    };

    // Gọi API lấy orders
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.getMyOrders(page, limit);
            if (res.success) {
                setOrders(res.orders);
                // setPage(res.currentPage);
                setLimit(res.limit);
                setTotal(res.totalTickets);
                setTotalPages(res.totalPages);
            }
        } catch (error) {
            console.error('fetchOrders -> error', error);
        } finally {
            setLoading(false);
        }
    };

    // Mỗi khi page, limit thay đổi => fetchOrders
    useEffect(() => {
        fetchOrders();
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, [page, limit]);

    // Render danh sách đơn
    const renderOrders = () => {
        if (loading) {
            return <div className="mt-5">Đang tải dữ liệu...</div>;
        }
        if (orders.length === 0) {
            return (
                <div className="text-center mt-5">
                    <img
                        src={noTicket}
                        alt="No tickets"
                        className="mb-3 rounded"
                        style={{ width: '200px' }}
                    />
                    <p className="fs-5">Bạn chưa có đơn hàng nào</p>
                </div>
            );
        }

        return (
            <>
                {orders.map((order) => {
                    const isExpanded = !!expandedOrders[order._id];
                    return (
                        <div
                            key={order._id}
                            className="mb-3 p-3 bg-light text-dark rounded shadow-sm"
                            style={{ transition: 'transform 0.2s' }}
                        >
                            {/* Header đơn hàng */}
                            <div
                                className="d-flex justify-content-between align-items-center"
                                onClick={() => handleToggleOrder(order._id)}
                                style={{ cursor: 'pointer' }}
                            >
                                <div
                                    className="text-truncate"
                                    style={{ maxWidth: '95%' }}
                                >
                                    <h5
                                        className="fw-bold mb-1 text-truncate"
                                        style={{
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                        }}
                                    >
                                        Đơn hàng #{order.orderId} | {order.name}
                                    </h5>
                                </div>
                                <i
                                    className={`bi ${
                                        isExpanded
                                            ? 'bi-chevron-up'
                                            : 'bi-chevron-down'
                                    } fs-4 text-secondary`}
                                />
                            </div>

                            {/* Nội dung chi tiết (items) */}
                            <div
                                className="transition-panel"
                                style={{
                                    maxHeight: isExpanded ? '1000px' : '0px',
                                    overflow: 'hidden',
                                    transition: 'max-height 0.3s ease',
                                }}
                            >
                                <hr />
                                {order.tickets?.map((ticket, idx) => {
                                    const subTotal =
                                        ticket.price * ticket.quantity;
                                    return (
                                        <React.Fragment key={ticket._id || idx}>
                                            <div className="d-flex align-items-center mb-2 p-2 rounded bg-white text-dark">
                                                <div
                                                    className="d-flex align-items-center justify-content-center text-white"
                                                    style={{
                                                        padding: '10px',
                                                    }}
                                                >
                                                    <img
                                                        src={order.image}
                                                        alt={ticket.name}
                                                        className="rounded"
                                                        style={{
                                                            width: '200px',
                                                            height: '120px',
                                                            objectFit:
                                                                'contain',
                                                        }}
                                                    />
                                                </div>
                                                <div>
                                                    <div className="fw-bold">
                                                        {ticket.name}
                                                    </div>
                                                    <div>
                                                        Số lượng:{' '}
                                                        {ticket.quantity}
                                                    </div>
                                                    <div className="text-danger fw-bold">
                                                        {ticket.price === 0
                                                            ? 'Miễn phí'
                                                            : `${subTotal.toLocaleString()} đ`}
                                                    </div>
                                                </div>
                                                <div className="d-flex justify-content-center ms-auto">
                                                    <QRCode
                                                        value={`${ticket.ticketId}`}
                                                        size={100}
                                                        bgColor="#ffffff"
                                                        fgColor="#000000"
                                                        level="H"
                                                    />
                                                </div>
                                            </div>
                                            <hr></hr>
                                        </React.Fragment>
                                    );
                                })}
                            </div>
                        </div>
                    );
                })}

                {/* Phân trang */}
                <div className="d-flex justify-content-center align-items-center">
                    <Button
                        variant="secondary"
                        className="me-2"
                        disabled={page <= 1}
                        onClick={() => setPage((prev) => prev - 1)}
                    >
                        Trang trước
                    </Button>
                    <span>
                        Trang {page} / {totalPages}
                    </span>
                    <Button
                        variant="secondary"
                        className="ms-2"
                        disabled={page >= totalPages}
                        onClick={() => setPage((prev) => prev + 1)}
                    >
                        Trang sau
                    </Button>
                </div>
            </>
        );
    };

    return (
        <Container
            fluid
            className="text-white min-vh-100 p-4"
            style={{
                margin: '80px 0',
            }}
        >
            <Row className="pt-4">
                <Col md={9} className="px-4">
                    <div>
                        <Link
                            to="/"
                            className="text-decoration-none"
                            style={{ color: 'rgb(166, 166, 176)' }}
                        >
                            Trang chủ
                        </Link>
                        <BsChevronRight className="mx-2" />
                        <span className="text-white">Vé đã mua</span>
                    </div>
                </Col>
            </Row>

            <Row className="pt-4">
                <Col md={3} className="px-4 border-end">
                    <Nav className="flex-column">
                        <Nav.Link
                            className={`d-flex align-items-center mb-3 p-2 rounded hover-bg ${
                                activeTab === 'account'
                                    ? 'nav-ticket-active'
                                    : ''
                            }`}
                            onClick={() =>
                                handleNavigation('account', '/account-settings')
                            }
                        >
                            <BsPerson className="me-2" /> Cài đặt tài khoản
                        </Nav.Link>
                        <Nav.Link
                            className={`d-flex align-items-center mb-3 p-2 rounded hover-bg ${
                                activeTab === 'tickets'
                                    ? 'nav-ticket-active'
                                    : ''
                            }`}
                            onClick={() =>
                                handleNavigation('tickets', '/my-tickets')
                            }
                        >
                            <BsTicket className="me-2 text-success" /> Vé đã mua
                        </Nav.Link>
                        <Nav.Link
                            className={`d-flex align-items-center p-2 rounded hover-bg ${
                                activeTab === 'events'
                                    ? 'nav-ticket-active'
                                    : ''
                            }`}
                            onClick={() =>
                                handleNavigation('events', '/my-events')
                            }
                        >
                            <BsCalendar className="me-2" /> Sự kiện của tôi
                        </Nav.Link>
                    </Nav>
                </Col>

                <Col md={9} className="px-4">
                    <h2 className="mb-4 fw-bold">Vé đã mua</h2>
                    <div className="d-flex mb-4">
                        <Button variant="success" className="me-2 shadow-sm">
                            Tất cả
                        </Button>
                        <Button variant="secondary" className="me-2 shadow-sm">
                            Chưa diễn ra
                        </Button>
                        <Button variant="secondary" className="shadow-sm">
                            Đã diễn ra
                        </Button>
                    </div>

                    {renderOrders()}
                </Col>
            </Row>
        </Container>
    );
}

export default PurchasedTickets;
