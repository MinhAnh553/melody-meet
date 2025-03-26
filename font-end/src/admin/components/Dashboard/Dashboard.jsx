import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';
import {
    FaMoneyBillWave,
    FaUsers,
    FaMusic,
    FaShoppingCart,
    FaCalendarCheck,
    FaCreditCard,
    FaExclamationTriangle,
    FaTicketAlt,
} from 'react-icons/fa';
import { Line, Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
);

import styles from './Dashboard.module.css';
import { dashboardStats, recentActivities } from '../../data/mockData';
import { formatCurrency, formatDate } from '../../utils/formatters';

const Dashboard = () => {
    // Revenue chart data
    const revenueChartData = {
        labels: dashboardStats.revenueByMonth.map((item) => item.month),
        datasets: [
            {
                label: 'Doanh thu (VNĐ)',
                data: dashboardStats.revenueByMonth.map(
                    (item) => item.revenue / 1000000,
                ), // Convert to millions
                fill: false,
                backgroundColor: 'rgba(142, 68, 173, 0.2)',
                borderColor: 'rgba(142, 68, 173, 1)',
                tension: 0.4,
            },
        ],
    };

    // Revenue chart options
    const revenueChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'top',
                labels: {
                    color: '#f8f9fa',
                },
            },
            title: {
                display: false,
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.dataset.label}: ${formatCurrency(
                            context.raw * 1000000,
                        )}`;
                    },
                },
            },
        },
        scales: {
            y: {
                ticks: {
                    color: '#adb5bd',
                    callback: function (value) {
                        return value + ' tr';
                    },
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
            x: {
                ticks: {
                    color: '#adb5bd',
                },
                grid: {
                    color: 'rgba(255, 255, 255, 0.1)',
                },
            },
        },
    };

    // Tickets sold by category chart data
    const ticketChartData = {
        labels: dashboardStats.ticketsSoldByCategory.map(
            (item) => item.category,
        ),
        datasets: [
            {
                label: 'Vé đã bán',
                data: dashboardStats.ticketsSoldByCategory.map(
                    (item) => item.count,
                ),
                backgroundColor: [
                    'rgba(142, 68, 173, 0.7)',
                    'rgba(52, 152, 219, 0.7)',
                    'rgba(46, 204, 113, 0.7)',
                    'rgba(241, 196, 15, 0.7)',
                    'rgba(231, 76, 60, 0.7)',
                ],
                borderColor: [
                    'rgba(142, 68, 173, 1)',
                    'rgba(52, 152, 219, 1)',
                    'rgba(46, 204, 113, 1)',
                    'rgba(241, 196, 15, 1)',
                    'rgba(231, 76, 60, 1)',
                ],
                borderWidth: 1,
            },
        ],
    };

    // Ticket chart options
    const ticketChartOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: 'right',
                labels: {
                    color: '#f8f9fa',
                },
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw} vé`;
                    },
                },
            },
        },
    };

    // Activity icon based on type
    const getActivityIcon = (type) => {
        switch (type) {
            case 'new_order':
                return (
                    <FaShoppingCart
                        className={`${styles.activityIcon} ${styles.activityIconInfo}`}
                    />
                );
            case 'event_approved':
                return (
                    <FaCalendarCheck
                        className={`${styles.activityIcon} ${styles.activityIconSuccess}`}
                    />
                );
            case 'payment_received':
                return (
                    <FaCreditCard
                        className={`${styles.activityIcon} ${styles.activityIconSuccess}`}
                    />
                );
            case 'new_event':
                return (
                    <FaMusic
                        className={`${styles.activityIcon} ${styles.activityIconInfo}`}
                    />
                );
            case 'order_cancelled':
                return (
                    <FaExclamationTriangle
                        className={`${styles.activityIcon} ${styles.activityIconDanger}`}
                    />
                );
            default:
                return (
                    <FaTicketAlt
                        className={`${styles.activityIcon} ${styles.activityIconWarning}`}
                    />
                );
        }
    };

    return (
        <div className={styles.dashboardContainer}>
            {/* Stats Cards */}
            <div className={styles.statsGrid}>
                <Card className={styles.statCard}>
                    <FaMoneyBillWave
                        className={`${styles.statIcon} ${styles.revenueIcon}`}
                    />
                    <div className={styles.statValue}>
                        {formatCurrency(dashboardStats.totalRevenue)}
                    </div>
                    <div className={styles.statLabel}>Tổng doanh thu</div>
                </Card>

                <Card className={styles.statCard}>
                    <FaUsers
                        className={`${styles.statIcon} ${styles.userIcon}`}
                    />
                    <div className={styles.statValue}>
                        {dashboardStats.totalUsers}
                    </div>
                    <div className={styles.statLabel}>Tổng số người dùng</div>
                </Card>

                <Card className={styles.statCard}>
                    <FaMusic
                        className={`${styles.statIcon} ${styles.eventIcon}`}
                    />
                    <div className={styles.statValue}>
                        {dashboardStats.totalEvents}
                    </div>
                    <div className={styles.statLabel}>Tổng số sự kiện</div>
                </Card>

                <Card className={styles.statCard}>
                    <FaShoppingCart
                        className={`${styles.statIcon} ${styles.orderIcon}`}
                    />
                    <div className={styles.statValue}>
                        {dashboardStats.totalOrders}
                    </div>
                    <div className={styles.statLabel}>Tổng số đơn hàng</div>
                </Card>
            </div>

            {/* Charts */}
            <div className={styles.chartsContainer}>
                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Doanh thu theo tháng</h3>
                    <div style={{ height: '300px' }}>
                        <Line
                            data={revenueChartData}
                            options={revenueChartOptions}
                        />
                    </div>
                </div>

                <div className={styles.chartCard}>
                    <h3 className={styles.chartTitle}>Vé bán theo thể loại</h3>
                    <div style={{ height: '300px' }}>
                        <Doughnut
                            data={ticketChartData}
                            options={ticketChartOptions}
                        />
                    </div>
                </div>
            </div>

            {/* Recent Activities */}
            <Row>
                <Col md={6}>
                    <div className={styles.recentActivitiesCard}>
                        <h3 className={styles.chartTitle}>Hoạt động gần đây</h3>
                        {recentActivities.map((activity) => (
                            <div
                                key={activity.id}
                                className={styles.activityItem}
                            >
                                {getActivityIcon(activity.type)}
                                <div className={styles.activityContent}>
                                    <div className={styles.activityTitle}>
                                        {activity.message}
                                    </div>
                                    <div className={styles.activityTime}>
                                        {activity.user} • {activity.timestamp}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>

                <Col md={6}>
                    <div className={styles.upcomingEventsCard}>
                        <h3 className={styles.chartTitle}>
                            Sự kiện sắp diễn ra
                        </h3>
                        {dashboardStats.upcomingEvents.map((event) => (
                            <div key={event.id} className={styles.activityItem}>
                                <FaCalendarCheck
                                    className={`${styles.activityIcon} ${styles.activityIconInfo}`}
                                />
                                <div className={styles.activityContent}>
                                    <div className={styles.activityTitle}>
                                        {event.title}
                                    </div>
                                    <div className={styles.activityTime}>
                                        {formatDate(event.date)} • Đã bán{' '}
                                        {event.ticketsSold}/{event.totalTickets}{' '}
                                        vé
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </Col>
            </Row>
        </div>
    );
};

export default Dashboard;
