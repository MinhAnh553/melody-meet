import React, { useState } from 'react';
import {
    Table,
    Button,
    Form,
    InputGroup,
    Badge,
    Pagination,
    Modal,
} from 'react-bootstrap';
import { FaSearch, FaEye, FaPrint, FaTimes } from 'react-icons/fa';
import styles from './Orders.module.css';
import { orders } from '../../data/mockData';
import {
    formatDate,
    formatCurrency,
    formatOrderStatus,
    formatPaymentStatus,
} from '../../utils/formatters';
import OrderDetails from './OrderDetails';

const OrdersList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('orderDate');
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);
    const [showOrderDetails, setShowOrderDetails] = useState(false);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showCancelModal, setShowCancelModal] = useState(false);
    const [orderToCancel, setOrderToCancel] = useState(null);

    const itemsPerPage = 5;

    // Filter orders
    const filteredOrders = orders.filter((order) => {
        const matchesSearch =
            order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.customer.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase()) ||
            order.event.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus =
            statusFilter === 'all' || order.orderStatus === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Sort orders
    const sortedOrders = [...filteredOrders].sort((a, b) => {
        switch (sortBy) {
            case 'id':
                return sortOrder === 'asc'
                    ? a.id.localeCompare(b.id)
                    : b.id.localeCompare(a.id);
            case 'customer':
                return sortOrder === 'asc'
                    ? a.customer.name.localeCompare(b.customer.name)
                    : b.customer.name.localeCompare(a.customer.name);
            case 'orderDate':
                return sortOrder === 'asc'
                    ? new Date(a.orderDate) - new Date(b.orderDate)
                    : new Date(b.orderDate) - new Date(a.orderDate);
            case 'amount':
                return sortOrder === 'asc'
                    ? a.totalAmount - b.totalAmount
                    : b.totalAmount - a.totalAmount;
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedOrders.length / itemsPerPage);
    const indexOfLastOrder = currentPage * itemsPerPage;
    const indexOfFirstOrder = indexOfLastOrder - itemsPerPage;
    const currentOrders = sortedOrders.slice(
        indexOfFirstOrder,
        indexOfLastOrder,
    );

    // Handle sorting change
    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // Order status badge
    const getStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgeCompleted}`}
                    >
                        {formatOrderStatus(status)}
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgePending}`}
                    >
                        {formatOrderStatus(status)}
                    </Badge>
                );
            case 'cancelled':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgeCancelled}`}
                    >
                        {formatOrderStatus(status)}
                    </Badge>
                );
            default:
                return (
                    <Badge className={styles.statusBadge}>
                        {formatOrderStatus(status)}
                    </Badge>
                );
        }
    };

    // Payment status badge
    const getPaymentStatusBadge = (status) => {
        switch (status) {
            case 'completed':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgeCompleted}`}
                    >
                        {formatPaymentStatus(status)}
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgePending}`}
                    >
                        {formatPaymentStatus(status)}
                    </Badge>
                );
            case 'failed':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgeCancelled}`}
                    >
                        {formatPaymentStatus(status)}
                    </Badge>
                );
            default:
                return (
                    <Badge className={styles.statusBadge}>
                        {formatPaymentStatus(status)}
                    </Badge>
                );
        }
    };

    // Handle view order details
    const handleViewOrderDetails = (order) => {
        setSelectedOrder(order);
        setShowOrderDetails(true);
    };

    // Handle cancel order
    const handleCancelClick = (order) => {
        setOrderToCancel(order);
        setShowCancelModal(true);
    };

    const handleCancelConfirm = () => {
        // In a real app, this would update to a backend API
        console.log('Cancel order:', orderToCancel);
        setShowCancelModal(false);
    };

    // Calculate the sum of tickets
    const getTicketsCount = (tickets) => {
        return tickets.reduce((sum, ticket) => sum + ticket.quantity, 0);
    };

    return (
        <div className={styles.ordersContainer}>
            <h1 className={styles.pageTitle}>Quản lý đơn hàng</h1>

            {/* Table Header */}
            <div className={styles.tableHeader}>
                <Button variant="primary" disabled>
                    Xuất báo cáo
                </Button>

                <div className={styles.searchFilter}>
                    <InputGroup className={styles.searchInput}>
                        <InputGroup.Text id="search-addon">
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm kiếm đơn hàng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="completed">Hoàn thành</option>
                        <option value="pending">Đang xử lý</option>
                        <option value="cancelled">Đã hủy</option>
                    </Form.Select>
                </div>
            </div>

            {/* Orders Table */}
            <div className={styles.tableWrapper}>
                <Table responsive hover className={styles.orderTable}>
                    <thead>
                        <tr>
                            <th
                                onClick={() => handleSortChange('id')}
                                style={{ cursor: 'pointer' }}
                            >
                                Mã đơn hàng{' '}
                                {sortBy === 'id' &&
                                    (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSortChange('customer')}
                                style={{ cursor: 'pointer' }}
                            >
                                Khách hàng{' '}
                                {sortBy === 'customer' &&
                                    (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Sự kiện</th>
                            <th>Số lượng vé</th>
                            <th
                                onClick={() => handleSortChange('amount')}
                                style={{ cursor: 'pointer' }}
                            >
                                Tổng tiền{' '}
                                {sortBy === 'amount' &&
                                    (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Trạng thái</th>
                            <th>Thanh toán</th>
                            <th
                                onClick={() => handleSortChange('orderDate')}
                                style={{ cursor: 'pointer' }}
                            >
                                Ngày đặt{' '}
                                {sortBy === 'orderDate' &&
                                    (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentOrders.map((order) => (
                            <tr key={order.id}>
                                <td>{order.id}</td>
                                <td>{order.customer.name}</td>
                                <td>{order.event.title}</td>
                                <td>{getTicketsCount(order.tickets)}</td>
                                <td>{formatCurrency(order.totalAmount)}</td>
                                <td>{getStatusBadge(order.orderStatus)}</td>
                                <td>
                                    {getPaymentStatusBadge(order.paymentStatus)}
                                </td>
                                <td>{formatDate(order.orderDate)}</td>
                                <td>
                                    <div className={styles.tableActions}>
                                        <Button
                                            variant="link"
                                            className={`${styles.actionButton} ${styles.viewButton}`}
                                            title="Xem chi tiết"
                                            onClick={() =>
                                                handleViewOrderDetails(order)
                                            }
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="link"
                                            className={`${styles.actionButton} ${styles.viewButton}`}
                                            title="In đơn hàng"
                                            onClick={() =>
                                                console.log(
                                                    'Print order:',
                                                    order.id,
                                                )
                                            }
                                        >
                                            <FaPrint />
                                        </Button>
                                        {order.orderStatus === 'pending' && (
                                            <Button
                                                variant="link"
                                                className={`${styles.actionButton} ${styles.deleteButton}`}
                                                title="Hủy đơn hàng"
                                                onClick={() =>
                                                    handleCancelClick(order)
                                                }
                                            >
                                                <FaTimes />
                                            </Button>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className={styles.paginationContainer}>
                    <Pagination>
                        <Pagination.First
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        />
                        <Pagination.Prev
                            onClick={() => handlePageChange(currentPage - 1)}
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
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}

            {/* Order Details Modal */}
            <Modal
                show={showOrderDetails}
                onHide={() => setShowOrderDetails(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitle}>
                        Chi tiết đơn hàng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedOrder && <OrderDetails order={selectedOrder} />}
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button
                        variant="secondary"
                        onClick={() => setShowOrderDetails(false)}
                    >
                        Đóng
                    </Button>
                    <Button
                        variant="primary"
                        onClick={() =>
                            console.log('Print order:', selectedOrder?.id)
                        }
                    >
                        In đơn hàng
                    </Button>
                </Modal.Footer>
            </Modal>

            {/* Cancel Order Confirmation Modal */}
            <Modal
                show={showCancelModal}
                onHide={() => setShowCancelModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitle}>
                        Xác nhận hủy đơn hàng
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn hủy đơn hàng {orderToCancel?.id}? Hành
                    động này không thể hoàn tác.
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button
                        variant="secondary"
                        onClick={() => setShowCancelModal(false)}
                    >
                        Không
                    </Button>
                    <Button variant="danger" onClick={handleCancelConfirm}>
                        Hủy đơn hàng
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default OrdersList;
