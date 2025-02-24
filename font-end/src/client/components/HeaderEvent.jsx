import React, { useContext } from 'react';
import avatar from '../../assets/images/avatar.png';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import swalCustomize from '../../util/swalCustomize';

const HeaderEvent = () => {
    const { logout } = useAuth();
    const location = useLocation();
    const navigate = useNavigate();

    return (
        <div className="header">
            <div className="w-100 step-container gap-2">
                <div className="step active">1. Thông tin sự kiện</div>
                <div className="step">2. Thời gian &amp; Loại vé</div>
                <div className="step">3. Cài đặt</div>
                <div className="step">4. Thông tin thanh toán</div>
                <button
                    className="btn"
                    style={{
                        backgroundColor: 'rgb(45 194 117)',
                        color: '#fff',
                    }}
                    id="submitEvent"
                >
                    Tiếp tục
                </button>
                <ul className="navbar-nav mb-2 mb-lg-0 ms-auto gap-2 flex-row align-items-center justify-content-end">
                    {location.pathname !== '/event/create' && (
                        <li className="nav-item">
                            <Link
                                className="nav-link create-event"
                                to="/event/create"
                            >
                                Tạo sự kiện
                            </Link>
                        </li>
                    )}
                    {/* <li className="nav-item dropdown position-relative">
                        <div
                            className="nav-link dropdown-toggle d-flex align-items-center p-2 rounded"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                            style={{
                                cursor: 'pointer',
                                transition: 'background 0.3s',
                            }}
                        >
                            <img
                                className="rounded-circle border border-2"
                                src={avatar}
                                alt="User Avatar"
                                width={36}
                                height={36}
                            />
                            <span className="ms-2 fw-semibold">Tài khoản</span>
                        </div>
                        <ul className="dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3">
                            <li>
                                <a
                                    className="dropdown-item py-2 d-flex align-items-center"
                                    href="#"
                                >
                                    <i className="bi bi-ticket-perforated me-2 text-primary fs-5" />
                                    <span>Vé Đã Mua</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item py-2 d-flex align-items-center"
                                    href="#"
                                >
                                    <i className="bi bi-calendar-event me-2 text-success fs-5" />
                                    <span>Sự Kiện Của Tôi</span>
                                </a>
                            </li>
                            <li>
                                <a
                                    className="dropdown-item py-2 d-flex align-items-center"
                                    href="#"
                                >
                                    <i className="bi bi-person me-2 text-warning fs-5" />
                                    <span>Trang Cá Nhân</span>
                                </a>
                            </li>
                            <li>
                                <hr className="dropdown-divider" />
                            </li>
                            <li>
                                <a
                                    className="dropdown-item py-2 d-flex align-items-center text-danger action-logout"
                                    href="#"
                                >
                                    <i className="bi bi-box-arrow-right me-2 fs-5" />
                                    <span>Đăng xuất</span>
                                </a>
                            </li>
                        </ul>
                    </li> */}
                    <li>
                        <div className="nav-item dropdown position-relative">
                            <div
                                className="nav-link dropdown-toggle d-flex align-items-center rounded"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                                style={{
                                    cursor: 'pointer',
                                    transition: 'background 0.3s',
                                    padding: 0,
                                }}
                            >
                                <img
                                    className="rounded-circle border border-2"
                                    src={avatar}
                                    alt="User Avatar"
                                    width={36}
                                    height={36}
                                />
                                <span className="ms-2 fw-semibold">
                                    Tài khoản
                                </span>
                            </div>
                            <ul className="infoAccountEvent dropdown-menu dropdown-menu-end shadow-lg border-0 rounded-3 mt-1">
                                <li>
                                    <a
                                        className="dropdown-item py-2 d-flex align-items-center"
                                        href="#"
                                    >
                                        <i className="bi bi-ticket-perforated me-2 text-primary fs-5" />
                                        <span>Vé Đã Mua</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item py-2 d-flex align-items-center"
                                        href="#"
                                    >
                                        <i className="bi bi-calendar-event me-2 text-success fs-5" />
                                        <span>Sự Kiện Của Tôi</span>
                                    </a>
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item py-2 d-flex align-items-center"
                                        href="#"
                                    >
                                        <i className="bi bi-person me-2 text-warning fs-5" />
                                        <span>Trang Cá Nhân</span>
                                    </a>
                                </li>
                                <li>
                                    <hr className="dropdown-divider" />
                                </li>
                                <li>
                                    <a
                                        className="dropdown-item py-2 d-flex align-items-center text-danger action-logout"
                                        href="#"
                                        onClick={() => {
                                            logout();
                                            navigate('/');
                                            swalCustomize.Toast.fire({
                                                icon: 'success',
                                                title: 'Đăng xuất thành công!',
                                            });
                                        }}
                                    >
                                        <i className="bi bi-box-arrow-right me-2 fs-5" />
                                        <span>Đăng xuất</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
    );
};

export default HeaderEvent;
