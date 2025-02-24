import React from 'react';

const SidebarEvent = () => {
    return (
        <div className="sidebar p-3 bg-dark text-light">
            <h4 className="text-success mb-4 d-flex align-items-center">
                {' '}
                <i className="bi bi-gear-fill me-2">Quản Lý Sự Kiện</i>
            </h4>
            <ul className="nav flex-column">
                <li className="nav-item mb-2">
                    <a
                        className="nav-link text-light d-flex align-items-center"
                        href="#"
                    >
                        {' '}
                        <i className="bi bi-calendar-event me-2"> </i>
                        <span>Sự kiện của tôi</span>
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a
                        className="nav-link text-light d-flex align-items-center"
                        href="#"
                    >
                        {' '}
                        <i className="bi bi-bar-chart-line me-2"> </i>
                        <span>Quản lý báo cáo</span>
                    </a>
                </li>
                <li className="nav-item mb-2">
                    <a
                        className="nav-link text-light d-flex align-items-center"
                        href="#"
                    >
                        {' '}
                        <i className="bi bi-file-earmark-text me-2"> </i>
                        <span>Điều khoản cho Ban tổ chức</span>
                    </a>
                </li>
            </ul>
        </div>
    );
};

export default SidebarEvent;
