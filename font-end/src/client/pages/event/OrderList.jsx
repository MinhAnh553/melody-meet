import React, { useEffect, useState } from 'react';
import api from '../../../util/api';
import { useParams } from 'react-router-dom';

const OrderList = () => {
    const { eventId } = useParams();
    const [orders, setOrders] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const res = await api.getOrdersByEventId(eventId);
                if (res.success) {
                    setOrders(res.orders);
                }
            } catch (error) {
                console.error('Lỗi lấy danh sách đơn hàng:', error);
            }
        };

        fetchOrders();
    }, [eventId]);

    // Lọc đơn hàng theo tìm kiếm
    const filteredOrders = orders.filter((order) =>
        order.orderId.toString().includes(search),
    );

    return (
        <div className="container mt-4">
            <div className="d-flex mb-3">
                <input
                    type="text"
                    className="form-control"
                    placeholder="Tìm kiếm theo mã đơn hàng"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button className="btn btn-success ms-2">🔍</button>
            </div>

            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Mã đơn hàng</th>
                        <th className="text-end">Tổng tiền</th>
                        <th className="text-center">Trạng thái</th>
                        <th className="text-end">Ngày đặt</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredOrders.length === 0 ? (
                        <tr>
                            <td colSpan="4" className="text-center">
                                <p>Không có đơn hàng</p>
                            </td>
                        </tr>
                    ) : (
                        filteredOrders.map((order) => (
                            <tr key={order._id}>
                                <td>{order.orderId}</td>
                                <td className="text-end">
                                    {order.totalPrice.toLocaleString('vi-VN')} đ
                                </td>
                                <td className="text-center">
                                    <span
                                        className={`badge ${
                                            order.status === 'PAID'
                                                ? 'bg-success'
                                                : order.status === 'PENDING'
                                                ? 'bg-warning'
                                                : 'bg-danger'
                                        }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>
                                <td className="text-end">
                                    {new Date(order.createdAt).toLocaleString(
                                        'vi-VN',
                                    )}
                                </td>
                            </tr>
                        ))
                    )}
                </tbody>
            </table>
        </div>
    );
};

export default OrderList;
