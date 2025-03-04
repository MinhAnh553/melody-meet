import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import QRCode from 'react-qr-code';
import api from '../../../util/api';
import 'bootstrap/dist/css/bootstrap.min.css';

function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderCode = searchParams.get('orderCode'); // ?orderCode=xxx
    const [order, setOrder] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                if (!orderCode) return;
                // 1. Gọi API checkOrder => xác nhận
                await api.checkOrder({ orderCode });

                // 2. Lấy chi tiết đơn hàng
                const res = await api.getOrderByOrderId(orderCode);
                if (res.success) {
                    setOrder(res.order);
                }
            } catch (err) {
                console.error(err);
            }
        };
        fetchOrder();
    }, [orderCode]);

    if (!order) {
        return;
    }

    // Tính tổng hiển thị
    const total = order.totalPrice.toLocaleString('vi-VN') + 'đ';

    // Tạo table hiển thị chi tiết vé
    const renderTickets = () => {
        if (!order.items || order.items.length === 0) {
            return <p>Không có vé nào</p>;
        }
        return (
            <table className="table table-hover">
                <thead>
                    <tr>
                        <th>Loại vé</th>
                        <th className="text-center">Số lượng</th>
                        <th className="text-end">Thành tiền</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item, i) => {
                        const sub = item.price * item.quantity;
                        return (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td className="text-center">{item.quantity}</td>
                                <td className="text-end">
                                    {item.price === 0
                                        ? 'Miễn phí'
                                        : sub.toLocaleString('vi-VN') + 'đ'}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    // Tạo mã QR => Sử dụng orderCode (hoặc order._id)
    // Cán bộ soát vé có thể quét QR => tra cứu
    const qrValue = `EVENT_TICKET|${orderCode}|${order._id}`;

    return (
        <div className="bg-dark text-white min-vh-100 d-flex flex-column">
            <div className="container py-5 flex-grow-1 d-flex flex-column justify-content-center">
                <div className="card mx-auto" style={{ maxWidth: '600px' }}>
                    <div className="card-body text-center">
                        {/* Biểu tượng check */}
                        <i className="bi bi-check-circle-fill text-success fs-1 mb-3"></i>
                        <h2 className="mb-4">Thanh toán thành công!</h2>

                        <p>
                            Mã đơn hàng:{' '}
                            <span className="fw-bold">{order._id}</span>
                        </p>
                        <p>
                            Trạng thái:{' '}
                            <span className="fw-bold">{order.status}</span>
                        </p>
                        <p>
                            Tổng tiền: <span className="fw-bold">{total}</span>
                        </p>
                        <hr />

                        <h5 className="mb-3">Chi tiết vé:</h5>
                        {renderTickets()}

                        <hr />
                        <h5 className="mb-3">Mã QR</h5>
                        <div className="d-flex justify-content-center mb-4">
                            <QRCode
                                value={qrValue}
                                size={150}
                                bgColor="#ffffff"
                                fgColor="#000000"
                                level="H"
                            />
                        </div>
                        <p>Quét mã QR để kiểm tra vé nhanh chóng!</p>

                        <button
                            className="btn btn-light mt-3"
                            onClick={() => navigate('/')}
                        >
                            Về trang chủ
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default PaymentSuccess;
