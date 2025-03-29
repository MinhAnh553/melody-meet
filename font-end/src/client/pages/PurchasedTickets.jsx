import React, { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Nav, Pagination } from 'react-bootstrap';
import { BsTicket, BsCalendar, BsChevronRight } from 'react-icons/bs';
import QRCode from 'react-qr-code';
import { Link, useNavigate } from 'react-router-dom';
import noTicket from '../../assets/images/no-ticket.png';
import api from '../../util/api';
import TimeText from '../components/providers/TimeText';

function PurchasedTickets() {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    // Các state cho tìm kiếm, lọc, sắp xếp, phân trang
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    // Quản lý tab active
    const [activeTab, setActiveTab] = useState('tickets');
    // Quản lý mở/đóng chi tiết cho từng đơn
    const [expandedOrders, setExpandedOrders] = useState({});

    const itemsPerPage = 5;

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

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const res = await api.getMyOrders();
            if (res.success) {
                setOrders(res.orders);
            }
        } catch (error) {
            console.error('fetchOrders -> error', error);
        } finally {
            setLoading(false);
        }
    };

    // Lọc theo status
    const filteredOrders = orders.filter((order) => {
        if (statusFilter === 'all') return true; // Lấy tất cả đơn hàng
        if (statusFilter === 'upcoming')
            return order.eventStatus !== 'event_over';
        if (statusFilter === 'event_over')
            return order.eventStatus === 'event_over';
        return false;
    });

    // Phân trang
    const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = filteredOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder,
    );

    // Chuyển trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const renderOrders = () => {
        if (loading) {
            return <div className="mt-5">Đang tải dữ liệu...</div>;
        }
        if (currentOrders.length === 0) {
            return (
                <div className="text-center mt-5">
                    <img
                        src={noTicket}
                        alt="No tickets"
                        className="mb-3 rounded"
                        style={{ width: '200px' }}
                    />
                    <p className="fs-5">Không có vé phù hợp</p>
                </div>
            );
        }

        return (
            <>
                {currentOrders.map((order) => {
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
                                                    <div className="text-dark fw-bold">
                                                        {ticket.name}
                                                    </div>
                                                    <div className="text-primary fw-bold">
                                                        Số lượng:{' '}
                                                        {ticket.quantity}
                                                    </div>
                                                    <div className="text-danger fw-bold">
                                                        Giá:{' '}
                                                        {ticket.price === 0
                                                            ? 'Miễn phí'
                                                            : `${subTotal.toLocaleString()} đ`}
                                                    </div>
                                                    <div className="text-success fw-bold">
                                                        Thời gian diễn ra:{' '}
                                                        <TimeText
                                                            event={order}
                                                        />
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
                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="d-flex justify-content-center align-items-center">
                        <Pagination>
                            <Pagination.First
                                onClick={() => handlePageChange(1)}
                                disabled={currentPage === 1}
                            />
                            <Pagination.Prev
                                onClick={() =>
                                    handlePageChange(currentPage - 1)
                                }
                                disabled={currentPage === 1}
                            />

                            {[...Array(totalPages)].map((_, index) => (
                                <Pagination.Item
                                    key={index + 1}
                                    active={index + 1 === currentPage}
                                    onClick={() => handlePageChange(index + 1)}
                                >
                                    {index + 1}
                                </Pagination.Item>
                            ))}

                            <Pagination.Next
                                onClick={() =>
                                    handlePageChange(currentPage + 1)
                                }
                                disabled={currentPage === totalPages}
                            />
                            <Pagination.Last
                                onClick={() => handlePageChange(totalPages)}
                                disabled={currentPage === totalPages}
                            />
                        </Pagination>
                    </div>
                )}
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
                        {/* <Nav.Link
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
                        </Nav.Link> */}
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
                            onClick={() => handleNavigation('events', '/event')}
                        >
                            <BsCalendar className="me-2" /> Sự kiện của tôi
                        </Nav.Link>
                    </Nav>
                </Col>

                <Col md={9} className="px-4">
                    <h2 className="mb-4 fw-bold">Vé đã mua</h2>
                    <div className="d-flex mb-4">
                        <Button
                            variant={
                                statusFilter === 'all' ? 'success' : 'secondary'
                            }
                            className="me-2 shadow-sm"
                            onClick={() => {
                                setStatusFilter('all');
                                handlePageChange(1);
                            }}
                        >
                            Tất cả
                        </Button>
                        <Button
                            variant={
                                statusFilter === 'upcoming'
                                    ? 'success'
                                    : 'secondary'
                            }
                            className="me-2 shadow-sm"
                            onClick={() => {
                                setStatusFilter('upcoming');
                                handlePageChange(1);
                            }}
                        >
                            Chưa diễn ra
                        </Button>
                        <Button
                            variant={
                                statusFilter === 'event_over'
                                    ? 'success'
                                    : 'secondary'
                            }
                            className="shadow-sm"
                            onClick={() => {
                                setStatusFilter('event_over');
                                handlePageChange(1);
                            }}
                        >
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
