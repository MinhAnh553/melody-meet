import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import styles from './Users.module.css';
import { getInitials } from '../../utils/formatters';

const UserForm = ({ user, onSubmit, onCancel }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'user',
        phone: '',
        address: '',
        password: '',
        confirmPassword: '',
    });

    const [errors, setErrors] = useState({});

    // If editing an existing user, populate the form
    useEffect(() => {
        if (user) {
            setFormData({
                name: user.name || '',
                email: user.email || '',
                role: user.role || 'user',
                phone: user.phone || '',
                address: user.address || '',
                password: '',
                confirmPassword: '',
            });
        }
    }, [user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });

        // Clear error when user types
        if (errors[name]) {
            setErrors({
                ...errors,
                [name]: null,
            });
        }
    };

    const validateForm = () => {
        const newErrors = {};

        // Validate required fields
        if (!formData.name.trim()) {
            newErrors.name = 'Tên người dùng là bắt buộc';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email là bắt buộc';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        // If adding a new user or changing password, validate password
        if (!user || formData.password) {
            if (!user && !formData.password) {
                newErrors.password = 'Mật khẩu là bắt buộc';
            } else if (formData.password && formData.password.length < 6) {
                newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
            }

            if (formData.password !== formData.confirmPassword) {
                newErrors.confirmPassword = 'Mật khẩu không khớp';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Validate form
        if (!validateForm()) {
            return;
        }

        // Prepare the data (omit confirmPassword)
        const { confirmPassword, ...userData } = formData;

        // Add avatar initials
        userData.avatar = getInitials(userData.name);

        // If editing and password is empty, don't send password
        if (user && !userData.password) {
            delete userData.password;
        }

        onSubmit(userData);
    };

    return (
        <Form onSubmit={handleSubmit}>
            <div className={styles.userFormGrid}>
                {/* Left Column */}
                <div>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                            Tên người dùng
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Nhập tên người dùng"
                            isInvalid={!!errors.name}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.name}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                            Email
                        </Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Nhập email"
                            isInvalid={!!errors.email}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.email}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                            Vai trò
                        </Form.Label>
                        <Form.Select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="user">Người dùng</option>
                            <option value="organizer">Nhà tổ chức</option>
                            <option value="admin">Quản trị viên</option>
                        </Form.Select>
                    </Form.Group>
                </div>

                {/* Right Column */}
                <div>
                    <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                            Số điện thoại
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Nhập số điện thoại"
                        />
                    </Form.Group>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                            Địa chỉ
                        </Form.Label>
                        <Form.Control
                            type="text"
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            placeholder="Nhập địa chỉ"
                        />
                    </Form.Group>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                            {user
                                ? 'Mật khẩu mới (để trống nếu không đổi)'
                                : 'Mật khẩu'}
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder={
                                user ? 'Nhập mật khẩu mới' : 'Nhập mật khẩu'
                            }
                            isInvalid={!!errors.password}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.password}
                        </Form.Control.Feedback>
                    </Form.Group>

                    <Form.Group className={styles.formGroup}>
                        <Form.Label className={styles.formLabel}>
                            Xác nhận mật khẩu
                        </Form.Label>
                        <Form.Control
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            placeholder="Nhập lại mật khẩu"
                            isInvalid={!!errors.confirmPassword}
                        />
                        <Form.Control.Feedback type="invalid">
                            {errors.confirmPassword}
                        </Form.Control.Feedback>
                    </Form.Group>
                </div>
            </div>

            <div className={styles.formActions}>
                <Button variant="secondary" onClick={onCancel}>
                    Hủy
                </Button>
                <Button variant="primary" type="submit">
                    {user ? 'Cập nhật' : 'Thêm mới'}
                </Button>
            </div>
        </Form>
    );
};

export default UserForm;
