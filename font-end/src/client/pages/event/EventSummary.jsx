import { useEffect, useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import {
    PieChart,
    Pie,
    Cell,
    LineChart,
    Line,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Legend,
} from 'recharts';
import { Card, Table, Container, Row, Col, ProgressBar } from 'react-bootstrap';
import api from '../../../util/api';
import swalCustomize from '../../../util/swalCustomize';

const COLORS = ['#0088FE', '#FF8042'];

const EventSummary = () => {
    const { eventId } = useParams();
    const [eventData, setEventData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEventSummary = async () => {
            try {
                setLoading(true);
                const res = await api.getEventSummary(eventId);
                if (res.success) {
                    const sorted = res.revenueByDate.sort(
                        (a, b) => new Date(a.date) - new Date(b.date),
                    );

                    // Chuyển đổi ngày từ MM/DD/YYYY -> DD/MM/YYYY
                    const formattedData = sorted.map((item) => ({
                        ...item,
                        date: new Date(item.date).toLocaleDateString('vi-VN'), // Định dạng ngày tháng Việt Nam
                    }));

                    setEventData({
                        ...res,
                        revenueByDate: formattedData,
                    });

                    // setEventData(res);
                } else {
                    swalCustomize.Toast('error', res.message);
                }
            } catch (error) {
                console.error('Lỗi khi lấy dữ liệu doanh thu:', error);
                swalCustomize.Toast('error', 'Lỗi kết nối máy chủ.');
            } finally {
                setLoading(false);
            }
        };

        fetchEventSummary();
    }, [eventId]);

    const {
        totalRevenue = 0,
        totalSold = 0,
        ticketDetails = [],
        revenueByDate = [],
    } = eventData || {};

    const totalTickets = useMemo(() => {
        return ticketDetails.reduce(
            (sum, ticket) => sum + ticket.quantity + ticket.totalQuantity,
            0,
        );
    }, [ticketDetails]);

    const pieData = useMemo(() => {
        return [
            { name: 'Đã bán', value: totalSold },
            { name: 'Còn lại', value: totalTickets - totalSold },
        ];
    }, [totalSold, totalTickets]);

    if (loading) return <p className="text-center mt-4">Đang tải dữ liệu...</p>;
    if (!eventData)
        return (
            <p className="text-center text-danger mt-4">Không có dữ liệu.</p>
        );

    return (
        <Container
            fluid
            style={{
                minHeight: '100vh',
                color: '#fff',
                paddingTop: '20px',
            }}
        >
            <Card
                className="mx-3 p-4 shadow-sm text-white"
                style={{
                    backgroundColor: '#31353e',
                    border: '1px solid #444',
                    borderRadius: '20px',
                }}
            >
                <h2 className="fw-bold">
                    Tổng doanh thu: {totalRevenue.toLocaleString()} VND
                </h2>
                <p className="fs-5">
                    Số vé đã bán: <span className="fw-bold">{totalSold}</span>{' '}
                    vé
                </p>
            </Card>

            <Row className="mx-3 mt-4">
                <Col md={4} className="mb-4" style={{ paddingLeft: '0px' }}>
                    <Card
                        className="p-4 shadow-sm text-white"
                        style={{
                            backgroundColor: '#31353e',
                            border: '1px solid #444',
                            borderRadius: '20px',
                        }}
                    >
                        <h3 className="fs-5 fw-bold mb-3">Tỷ lệ vé đã bán</h3>
                        {totalTickets > 0 ? (
                            <ResponsiveContainer width="100%" height={250}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        outerRadius={80}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={COLORS[index]}
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                    <Legend />
                                </PieChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center">Không có dữ liệu vé.</p>
                        )}
                    </Card>
                </Col>

                <Col md={8} className="mb-4" style={{ paddingRight: '0px' }}>
                    <Card
                        className="p-4 shadow-sm text-white"
                        style={{
                            backgroundColor: '#31353e',
                            border: '1px solid #444',
                            borderRadius: '20px',
                        }}
                    >
                        <h3 className="fs-5 fw-bold mb-3">
                            Doanh thu theo ngày
                        </h3>
                        {revenueByDate.length > 0 ? (
                            <ResponsiveContainer
                                width="100%"
                                height={250}
                                style={{ padding: '2px' }}
                            >
                                <LineChart data={revenueByDate}>
                                    <XAxis
                                        dataKey="date"
                                        tick={{ fill: '#fff' }}
                                        stroke="#fff"
                                    />
                                    <YAxis
                                        tick={{ fill: '#fff' }}
                                        stroke="#fff"
                                    />
                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: '#222',
                                            color: '#fff',
                                        }}
                                    />
                                    <Legend wrapperStyle={{ color: '#fff' }} />
                                    <Line
                                        type="monotone"
                                        dataKey="revenue"
                                        stroke="#fff"
                                        strokeWidth={2}
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        ) : (
                            <p className="text-center">
                                Chưa có dữ liệu doanh thu theo ngày.
                            </p>
                        )}
                    </Card>
                </Col>
            </Row>

            <Card
                className="mx-3 p-4 shadow-sm text-white"
                style={{
                    backgroundColor: '#31353e',
                    border: '1px solid #444',
                    borderRadius: '20px',
                }}
            >
                <h3 className="text-lg font-medium mb-4">Chi tiết vé đã bán</h3>

                {ticketDetails.length > 0 ? (
                    <div
                        className="overflow-hidden rounded-lg"
                        style={{
                            backgroundColor: '#3A3A3A',
                            border: '1px solid #444',
                            borderRadius: '20px',
                        }}
                    >
                        {/* Header */}
                        <div
                            className="row py-3 px-4 fw-bold"
                            style={{
                                backgroundColor: '#2A2A2A',
                                borderBottom: '1px solid #555',
                                color: '#FFF',
                            }}
                        >
                            <div className="col-3">Loại Vé</div>
                            <div className="col-3 text-end">Giá bán</div>
                            <div className="col-3 text-center">Đã bán</div>
                            <div className="col-3 text-end">Tỉ lệ bán</div>
                        </div>

                        {/* Body */}
                        {ticketDetails.map((ticket, index) => (
                            <div
                                key={index}
                                className="row py-3 px-4 align-items-center"
                                style={{
                                    backgroundColor: '#3A3A3A',
                                    borderBottom: '1px solid #555',
                                    color: '#FFF',
                                }}
                            >
                                <div className="col-3">{ticket.name}</div>
                                <div className="col-3 text-end">
                                    {ticket.price.toLocaleString()} VND
                                </div>
                                <div className="col-3 text-center">
                                    {ticket.quantity} /{' '}
                                    {ticket.totalQuantity + ticket.quantity}
                                </div>
                                <div className="col-3 text-end d-flex align-items-center gap-2">
                                    <ProgressBar
                                        now={
                                            (ticket.quantity /
                                                (ticket.totalQuantity +
                                                    ticket.quantity)) *
                                            100
                                        }
                                        variant="warning" // Màu vàng/cam
                                        className="w-75"
                                        style={{ height: '8px' }} // Tùy chỉnh độ cao thanh
                                    />
                                    <span className="fw-bold">
                                        {(
                                            (ticket.quantity /
                                                (ticket.totalQuantity +
                                                    ticket.quantity)) *
                                            100
                                        ).toFixed(2)}
                                        %
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>Không có chi tiết vé.</p>
                )}
            </Card>
        </Container>
    );
};

export default EventSummary;
