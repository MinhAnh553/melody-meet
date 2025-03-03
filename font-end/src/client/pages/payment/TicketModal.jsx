// TicketModal.jsx
import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import CheckoutInfoModal from './CheckoutInfoModal';

const TicketModal = ({ show, onHide, event }) => {
    const [quantities, setQuantities] = useState(() => {
        if (!event?.ticketTypes) return [];
        return event.ticketTypes.map(() => 0);
    });

    const [showInfoModal, setShowInfoModal] = useState(false);

    if (!event) return null;

    const handleQuantityChange = (index, newValue) => {
        const max = event.ticketTypes[index].maxPerUser;
        const validValue = Math.max(0, Math.min(newValue, max));
        setQuantities((prev) => {
            const newArr = [...prev];
            newArr[index] = validValue;
            return newArr;
        });
    };

    // Tổng tiền
    const totalPrice = event.ticketTypes.reduce((acc, ticket, i) => {
        return acc + ticket.price * quantities[i];
    }, 0);

    // Có vé free nào được chọn?
    const hasFreeTicketSelected = event.ticketTypes.some(
        (ticket, i) => ticket.price === 0 && quantities[i] > 0,
    );

    // Tổng vé
    const totalQuantity = quantities.reduce((acc, q) => acc + q, 0);
    const isCheckoutDisabled = totalQuantity === 0;

    // Định dạng hiển thị tổng tiền
    let displayPrice = '';
    if (totalPrice > 0) {
        displayPrice = totalPrice.toLocaleString('vi-VN') + 'đ';
    } else {
        displayPrice = hasFreeTicketSelected ? 'Miễn phí' : '0đ';
    }

    // const handleCheckout = () => {
    //     // Tạo payload
    //     const orderDetails = event.ticketTypes.map((ticket, i) => ({
    //         ticketId: ticket._id,
    //         name: ticket.name,
    //         quantity: quantities[i],
    //         price: ticket.price,
    //     }));
    //     console.log('Order => ', orderDetails, 'Tổng tiền:', totalPrice);

    //     // Gọi API hoặc navigate
    //     onHide();
    // };

    // Mở modal xác nhận thông tin
    const handleCheckout = () => {
        onHide();
        setShowInfoModal(true);
    };

    // Khi user xác nhận info => proceed
    const handleInfoConfirmed = (userInfo) => {
        // userInfo = { name, phone, email }
        console.log('Thông tin nhận vé:', userInfo);
        console.log('Tổng tiền:', totalPrice);

        // Ở đây => gọi PayOS
        // Hoặc redirect sang trang /checkout
        // Hoặc hiển thị link => ...
        alert(
            `User info updated!\nName: ${userInfo.name}\nPhone: ${userInfo.phone}\nEmail: ${userInfo.email}\n=> Tiếp tục PayOS...`,
        );

        // Đóng modal info
        setShowInfoModal(false);
    };

    // Hàm tăng/giảm
    const handleDecrement = (index) => {
        handleQuantityChange(index, quantities[index] - 1);
    };
    const handleIncrement = (index) => {
        handleQuantityChange(index, quantities[index] + 1);
    };

    return (
        <>
            <Modal show={show} onHide={onHide} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Chọn vé cho: {event.name}</Modal.Title>
                </Modal.Header>
                <Modal.Body className="bg-dark text-white">
                    <table className="table table-dark ticket-table align-middle">
                        <thead>
                            <tr>
                                <th style={{ width: '40%' }}>Loại vé</th>
                                <th style={{ width: '20%' }}>Giá</th>
                                <th
                                    style={{ width: '40%' }}
                                    className="text-center"
                                >
                                    Số lượng
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {event.ticketTypes.map((ticket, index) => {
                                const { _id, name, price, maxPerUser } = ticket;
                                const quantity = quantities[index];

                                return (
                                    <tr key={_id || index}>
                                        <td>
                                            <strong>{name}</strong>
                                            <div
                                                className="text-muted"
                                                style={{ fontSize: '0.9rem' }}
                                            >
                                                (Tối đa {maxPerUser} vé)
                                            </div>
                                        </td>
                                        <td>
                                            {price === 0
                                                ? 'Miễn phí'
                                                : price.toLocaleString(
                                                      'vi-VN',
                                                  ) + 'đ'}
                                        </td>
                                        <td>
                                            <div className="quantity-group d-flex justify-content-center align-items-center">
                                                <button
                                                    className="btn btn-outline-light btn-sm rounded-circle me-2"
                                                    onClick={() =>
                                                        handleDecrement(index)
                                                    }
                                                    disabled={quantity <= 0}
                                                >
                                                    <i className="bi bi-dash"></i>
                                                </button>
                                                <input
                                                    type="number"
                                                    min={0}
                                                    max={maxPerUser}
                                                    value={quantity}
                                                    onChange={(e) =>
                                                        handleQuantityChange(
                                                            index,
                                                            +e.target.value,
                                                        )
                                                    }
                                                    className="quantity-input"
                                                />
                                                <button
                                                    className="btn btn-outline-light btn-sm rounded-circle ms-2"
                                                    onClick={() =>
                                                        handleIncrement(index)
                                                    }
                                                    disabled={
                                                        quantity >= maxPerUser
                                                    }
                                                >
                                                    <i className="bi bi-plus"></i>
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={2}>
                                    <strong>Tổng tiền:</strong>
                                </td>
                                <td className="text-end text-danger fw-bold">
                                    {displayPrice}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </Modal.Body>
                <Modal.Footer className="bg-dark">
                    <button className="btn btn-secondary" onClick={onHide}>
                        Đóng
                    </button>
                    <button
                        className="btn btn-success"
                        onClick={handleCheckout}
                        disabled={isCheckoutDisabled}
                    >
                        Thanh toán
                    </button>
                </Modal.Footer>
            </Modal>
            {/* Modal cập nhật thông tin */}
            <CheckoutInfoModal
                show={showInfoModal}
                onHide={() => setShowInfoModal(false)}
                onConfirm={handleInfoConfirmed}
            />
        </>
    );
};

export default TicketModal;
