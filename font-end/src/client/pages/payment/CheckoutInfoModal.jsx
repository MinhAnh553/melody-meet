import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import { useAuth } from '../../context/AuthContext';
import swalCustomize from '../../../util/swalCustomize';
import api from '../../../util/api';

const CheckoutInfoModal = ({ show, onHide, onConfirm }) => {
    const { auth, setAuth } = useAuth();
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [email, setEmail] = useState('');

    useEffect(() => {
        if (show && auth?.user?.address) {
            setName(auth.user.address.name || '');
            setPhone(auth.user.address.phone || '');
            setEmail(auth.user.address.email || '');
        }
    }, [show, auth?.user]);

    const handleSubmit = async () => {
        // Kiểm tra bắt buộc 3 trường
        if (!name.trim() || !phone.trim() || !email.trim()) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ thông tin!',
            });
        }

        try {
            // Gọi API update user
            const res = await api.updateUserInfo({
                name,
                phone,
                email,
            });
            if (res.success) {
                // Thành công => gọi onConfirm => tiếp tục PayOS
                setAuth((prevAuth) => ({
                    ...prevAuth,
                    user: {
                        ...prevAuth?.user,
                        address: {
                            name,
                            phone,
                            email,
                        },
                    },
                }));

                onConfirm();
            } else {
                return swalCustomize.Toast.fire({
                    icon: 'error',
                    title: res.message || 'Cập nhật thông tin thất bại!',
                });
            }
        } catch (error) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Lỗi khi cập nhật thông tin: ' + error.message,
            });
        }
    };

    return (
        <Modal show={show} onHide={onHide} centered>
            <Modal.Header closeButton>
                <Modal.Title>Cập nhật thông tin nhận vé</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="mb-3">
                    <label className="form-label">Tên người nhận</label>
                    <input
                        type="text"
                        className="form-control"
                        placeholder="Nhập tên người nhận"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Số điện thoại</label>
                    <input
                        type="text"
                        className="form-control"
                        maxLength="11"
                        placeholder="Nhập số điện thoại"
                        value={phone}
                        onInput={(e) =>
                            (e.target.value = e.target.value.replace(/\D/g, ''))
                        }
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>

                <div className="mb-3">
                    <label className="form-label">Email</label>
                    <input
                        type="email"
                        className="form-control"
                        placeholder="Nhập email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
            </Modal.Body>
            <Modal.Footer>
                <button className="btn btn-secondary" onClick={onHide}>
                    Hủy
                </button>
                <button className="btn btn-primary" onClick={handleSubmit}>
                    Xác nhận
                </button>
            </Modal.Footer>
        </Modal>
    );
};

export default CheckoutInfoModal;
