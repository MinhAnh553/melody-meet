import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api from '../../../util/api';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    // Giả sử cổng thanh toán redirect về: /payment-success?orderId=xxx
    const orderId = searchParams.get('orderId');

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!orderId) return;
                const res = await api.getOrder(orderId);
                if (res.success) {
                    setOrder(res.order);
                }
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    if (!orderId) {
        return <div className="container py-5">Thiếu orderId!</div>;
    }

    if (loading) {
        return <div className="container py-5">Đang tải...</div>;
    }

    if (!order) {
        return <div className="container py-5">Không tìm thấy đơn hàng!</div>;
    }

    return (
        <div className="container py-5">
            <h1>Thanh toán thành công!</h1>
            <p>Mã đơn hàng: {order._id}</p>
            <p>Trạng thái: {order.status}</p>
            <p>Tổng tiền: {order.totalPrice.toLocaleString('vi-VN')}đ</p>
            <h3>Chi tiết vé:</h3>
            <ul>
                {order.items.map((item, i) => (
                    <li key={i}>
                        {item.name} x {item.quantity} ={' '}
                        {item.price === 0
                            ? 'Miễn phí'
                            : (item.price * item.quantity).toLocaleString(
                                  'vi-VN',
                              ) + 'đ'}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default PaymentSuccess;
