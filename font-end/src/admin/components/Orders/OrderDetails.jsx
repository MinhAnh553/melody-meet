import React from 'react';
import { Row, Col, Badge } from 'react-bootstrap';
import { FaCreditCard, FaMoneyBillWave, FaUniversity } from 'react-icons/fa';
import styles from './Orders.module.css';
import {
    formatDate,
    formatCurrency,
    formatOrderStatus,
    formatPaymentStatus,
} from '../../utils/formatters';

const OrderDetails = ({ order }) => {
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

    // Payment method icon
    const getPaymentMethodIcon = (method) => {
        switch (method) {
            case 'Credit Card':
                return <FaCreditCard className={styles.paymentIcon} />;
            case 'Digital Wallet':
                return <FaMoneyBillWave className={styles.paymentIcon} />;
            case 'Bank Transfer':
                return <FaUniversity className={styles.paymentIcon} />;
            default:
                return <FaCreditCard className={styles.paymentIcon} />;
        }
    };

    return (
        <div className={styles.orderDetailsCard}>
            {/* Order Header */}
            <div className={styles.orderDetailsHeader}>
                <div className={styles.orderInfo}>
                    <div className={styles.orderIDLabel}>Mã đơn hàng</div>
                    <div className={styles.orderID}>{order.id}</div>
                    <div className={styles.orderDate}>
                        Ngày đặt: {formatDate(order.orderDate)}
                    </div>
                </div>
                <div className={styles.orderStatusContainer}>
                    <div className={styles.orderTotalLabel}>Tổng tiền</div>
                    <div className={styles.orderTotal}>
                        {formatCurrency(order.totalAmount)}
                    </div>
                    {getStatusBadge(order.orderStatus)}
                </div>
            </div>

            {/* Customer Information */}
            <div className={styles.orderDetailsSection}>
                <h4 className={styles.orderDetailsSectionTitle}>
                    Thông tin khách hàng
                </h4>
                <div className={styles.orderUserInfo}>
                    <div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Họ tên</span>
                            <span className={styles.infoValue}>
                                {order.customer.name}
                            </span>
                        </div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>Email</span>
                            <span className={styles.infoValue}>
                                {order.customer.email}
                            </span>
                        </div>
                    </div>
                    <div>
                        <div className={styles.infoItem}>
                            <span className={styles.infoLabel}>
                                Số điện thoại
                            </span>
                            <span className={styles.infoValue}>
                                {order.customer.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Event Information */}
            <div className={styles.orderDetailsSection}>
                <h4 className={styles.orderDetailsSectionTitle}>
                    Thông tin sự kiện
                </h4>
                <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Tên sự kiện</span>
                    <span className={styles.infoValue}>
                        {order.event.title}
                    </span>
                </div>
            </div>

            {/* Tickets */}
            <div className={styles.orderDetailsSection}>
                <h4 className={styles.orderDetailsSectionTitle}>Vé đã mua</h4>
                {order.tickets.map((ticket, index) => (
                    <div key={index} className={styles.ticketItem}>
                        <div className={styles.ticketInfo}>
                            <div className={styles.ticketTitle}>
                                {ticket.type}
                            </div>
                            <div className={styles.ticketDetails}>
                                {ticket.quantity} x{' '}
                                {formatCurrency(ticket.price)}
                            </div>
                        </div>
                        <div className={styles.ticketPrice}>
                            {formatCurrency(ticket.price * ticket.quantity)}
                        </div>
                    </div>
                ))}
            </div>

            {/* Payment Information */}
            <div className={styles.orderDetailsSection}>
                <h4 className={styles.orderDetailsSectionTitle}>
                    Thông tin thanh toán
                </h4>
                <div className={styles.paymentInfo}>
                    <div className={styles.paymentMethod}>
                        {getPaymentMethodIcon(order.paymentMethod)}
                        <div>
                            <div className={styles.paymentInfoTitle}>
                                {order.paymentMethod}
                            </div>
                            <div>
                                Trạng thái:{' '}
                                {order.paymentStatus === 'completed' ? (
                                    <Badge
                                        className={`${styles.statusBadge} ${styles.statusBadgeCompleted}`}
                                    >
                                        {formatPaymentStatus(
                                            order.paymentStatus,
                                        )}
                                    </Badge>
                                ) : (
                                    <Badge
                                        className={`${styles.statusBadge} ${styles.statusBadgePending}`}
                                    >
                                        {formatPaymentStatus(
                                            order.paymentStatus,
                                        )}
                                    </Badge>
                                )}
                            </div>
                            {order.paymentDate && (
                                <div>
                                    Ngày thanh toán:{' '}
                                    {formatDate(order.paymentDate)}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className={styles.orderSummary}>
                        <div className={styles.summaryRow}>
                            <span>Tổng tiền vé:</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                        <div className={styles.summaryRow}>
                            <span>Phí dịch vụ:</span>
                            <span>{formatCurrency(0)}</span>
                        </div>
                        <div className={styles.summaryDivider}></div>
                        <div
                            className={`${styles.summaryRow} ${styles.summaryTotal}`}
                        >
                            <span>Tổng thanh toán:</span>
                            <span>{formatCurrency(order.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancellation Info (if applicable) */}
            {order.orderStatus === 'cancelled' && (
                <div className={styles.orderDetailsSection}>
                    <h4 className={styles.orderDetailsSectionTitle}>
                        Thông tin hủy đơn
                    </h4>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Ngày hủy</span>
                        <span className={styles.infoValue}>
                            {formatDate(order.cancellationDate)}
                        </span>
                    </div>
                    <div className={styles.infoItem}>
                        <span className={styles.infoLabel}>Lý do hủy</span>
                        <span className={styles.infoValue}>
                            {order.cancellationReason}
                        </span>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderDetails;
