import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

const TicketModal = ({ show, onHide, event }) => {
    // Khởi tạo số lượng vé cho mỗi loại (mặc định 0)
    const [quantities, setQuantities] = useState(() => {
        if (!event?.ticketTypes) return [];
        return event.ticketTypes.map(() => 0);
    });

    if (!event) return null;

    // Khi người dùng thay đổi số lượng vé
    const handleQuantityChange = (index, newValue) => {
        // Lấy maxPerUser từ ticket
        const max = event.ticketTypes[index].maxPerUser;

        // Đảm bảo không âm, không vượt maxPerUser
        const validValue = Math.max(0, Math.min(newValue, max));

        setQuantities((prev) => {
            const newArr = [...prev];
            newArr[index] = validValue;
            return newArr;
        });
    };

    // Tính tổng tiền
    const totalPrice = event.ticketTypes.reduce((acc, ticket, i) => {
        return acc + ticket.price * quantities[i];
    }, 0);

    // Xử lý nút Thanh toán
    const handleCheckout = () => {
        // Tạo payload => Gửi lên server hoặc chuyển sang trang thanh toán
        const orderDetails = event.ticketTypes.map((ticket, i) => ({
            ticketId: ticket._id,
            name: ticket.name,
            quantity: quantities[i],
            price: ticket.price,
        }));

        console.log('Order => ', orderDetails, 'Tổng tiền:', totalPrice);

        // Tuỳ ý: gọi API hoặc navigate tới trang thanh toán
        onHide(); // Đóng modal
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Chọn vé cho: {event.name}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {event.ticketTypes.map((ticket, index) => {
                    const { name, price, maxPerUser } = ticket;
                    const quantity = quantities[index];

                    return (
                        <div
                            key={ticket._id || index}
                            className="d-flex justify-content-between align-items-center mb-3"
                        >
                            <div>
                                <strong>{name}</strong>{' '}
                                <span className="text-muted">
                                    (Tối đa {maxPerUser} vé)
                                </span>
                            </div>
                            <div>
                                {price === 0
                                    ? 'Miễn phí'
                                    : price.toLocaleString('vi-VN') + 'đ'}

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
                                    style={{
                                        width: '60px',
                                        marginLeft: '10px',
                                    }}
                                />
                            </div>
                        </div>
                    );
                })}

                <hr />
                <div className="d-flex justify-content-between">
                    <strong>Tổng tiền:</strong>
                    <span className="text-danger fw-bold">
                        {totalPrice === 0
                            ? 'Miễn phí'
                            : totalPrice.toLocaleString('vi-VN') + 'đ'}
                    </span>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onHide}>
                    Đóng
                </button>
                <button className="btn btn-primary" onClick={handleCheckout}>
                    Thanh toán
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default TicketModal;
