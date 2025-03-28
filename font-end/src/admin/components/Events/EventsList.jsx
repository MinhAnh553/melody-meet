import React, { useState, useEffect } from 'react';
import {
    Table,
    Button,
    Form,
    InputGroup,
    Badge,
    Pagination,
    Modal,
} from 'react-bootstrap';
import {
    FaSearch,
    FaEdit,
    FaTrash,
    FaEye,
    FaCheck,
    FaTimes,
} from 'react-icons/fa';
import styles from './Events.module.css';

import {
    formatDate,
    formatCurrency,
    truncateText,
} from '../../utils/formatters';
import EventDetails from './EventDetails';
import api from '../../../util/api';
import swalCustomize from '../../../util/swalCustomize';
import { BsCalendarX } from 'react-icons/bs';

const EventsList = () => {
    const [events, setEvents] = useState([]);

    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [sortBy, setSortBy] = useState('date'); // 'name', 'date', 'revenue'...
    const [sortOrder, setSortOrder] = useState('desc');
    const [currentPage, setCurrentPage] = useState(1);

    // Modal
    const [showEventDetails, setShowEventDetails] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);

    const itemsPerPage = 5;

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        try {
            const res = await api.getEvents('all', 'all');
            if (res.success) {
                setEvents(res.events);
            }
        } catch (error) {
            console.log('Lỗi khi gọi API getAllEvents:', error);
        }
    };

    // 3. Lọc theo searchTerm & status
    const filteredEvents = events.filter((event) => {
        // Chuyển về chữ thường để so sánh
        const eventName = event.name?.toLowerCase() || '';
        const organizerName = event.organizer?.name?.toLowerCase() || '';
        const matchesSearch =
            eventName.includes(searchTerm.toLowerCase()) ||
            organizerName.includes(searchTerm.toLowerCase());

        const matchesStatus =
            statusFilter === 'all' || event.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    // 4. Sắp xếp
    const sortedEvents = [...filteredEvents].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            case 'date':
                // So sánh theo startTime
                return sortOrder === 'asc'
                    ? new Date(a.startTime) - new Date(b.startTime)
                    : new Date(b.startTime) - new Date(a.startTime);
            case 'revenue':
                // Nếu chưa có totalRevenue, bạn có thể cho mặc định = 0
                const revA = a.totalRevenue || 0;
                const revB = b.totalRevenue || 0;
                return sortOrder === 'asc' ? revA - revB : revB - revA;
            default:
                return 0;
        }
    });

    // 5. Phân trang
    const totalPages = Math.ceil(sortedEvents.length / itemsPerPage);
    const indexOfLastEvent = currentPage * itemsPerPage;
    const indexOfFirstEvent = indexOfLastEvent - itemsPerPage;
    const currentEvents = sortedEvents.slice(
        indexOfFirstEvent,
        indexOfLastEvent,
    );

    // 6. Thay đổi cột sắp xếp
    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // 7. Đổi trang
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 8. Badge trạng thái
    const getStatusBadge = (status) => {
        switch (status) {
            case 'approved':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgeApproved}`}
                    >
                        Đã duyệt
                    </Badge>
                );
            case 'pending':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgePending}`}
                    >
                        Đang chờ duyệt
                    </Badge>
                );
            case 'rejected':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgeRejected}`}
                    >
                        Đã từ chối
                    </Badge>
                );
            case 'event_over':
                return (
                    <Badge
                        className={`${styles.statusBadge} ${styles.statusBadgeCompleted}`}
                    >
                        Đã diễn ra
                    </Badge>
                );
            default:
                return <Badge className={styles.statusBadge}>{status}</Badge>;
        }
    };

    const handleViewEventDetails = (event) => {
        setSelectedEvent(event);
        setShowEventDetails(true);
    };

    const handleApproveEvent = async (eventId) => {
        try {
            const res = await api.updateStatusEvent(eventId, 'approved');
            if (res.success) {
                fetchEvents();
                swalCustomize.Toast.fire({
                    icon: 'success',
                    title: 'Duyệt sự kiện thành công!',
                });
                setShowEventDetails(false);
            } else {
                console.log(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleRejectEvent = async (eventId) => {
        try {
            const res = await api.updateStatusEvent(eventId, 'rejected');
            if (res.success) {
                fetchEvents();
                swalCustomize.Toast.fire({
                    icon: 'success',
                    title: 'Đã từ chối tự kiện!',
                });
                setShowEventDetails(false);
            } else {
                console.log(res.message);
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className={styles.eventsContainer}>
            {/* Table Header */}
            <div className={styles.tableHeader}>
                {/* Ví dụ nút thêm sự kiện */}
                {/* <Button variant="primary" onClick={handleAddEvent}>
                    Thêm sự kiện mới
                </Button> */}

                <div className={styles.searchFilter}>
                    {/* Ô tìm kiếm */}
                    <InputGroup className={styles.searchInput}>
                        <InputGroup.Text id="search-addon">
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm kiếm sự kiện..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>

                    {/* Dropdown lọc trạng thái */}
                    <Form.Select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        <option value="approved">Đã duyệt</option>
                        <option value="pending">Đang chờ duyệt</option>
                        <option value="rejected">Đã từ chối</option>
                        <option value="event_over">Đã diễn ra</option>
                    </Form.Select>
                </div>
            </div>

            {/* Events Table */}
            {currentEvents.length > 0 ? (
                <>
                    <div className={styles.tableWrapper}>
                        <Table responsive hover className={styles.eventTable}>
                            <thead>
                                <tr>
                                    <th style={{ whiteSpace: 'nowrap' }}>
                                        Ảnh
                                    </th>
                                    <th
                                        style={{
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleSortChange('name')}
                                    >
                                        Tên sự kiện
                                    </th>
                                    <th
                                        style={{
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => handleSortChange('date')}
                                    >
                                        Ngày tổ chức
                                    </th>
                                    <th style={{ whiteSpace: 'nowrap' }}>
                                        Địa điểm
                                    </th>
                                    <th style={{ whiteSpace: 'nowrap' }}>
                                        Nhà tổ chức
                                    </th>
                                    <th style={{ whiteSpace: 'nowrap' }}>
                                        Trạng thái
                                    </th>
                                    <th
                                        style={{
                                            whiteSpace: 'nowrap',
                                            cursor: 'pointer',
                                        }}
                                        onClick={() =>
                                            handleSortChange('revenue')
                                        }
                                    >
                                        Doanh thu
                                    </th>
                                    <th style={{ whiteSpace: 'nowrap' }}>
                                        Thao tác
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentEvents.map((event) => (
                                    <tr key={event._id}>
                                        <td>
                                            <img
                                                src={event.background}
                                                alt={event.name}
                                                className={styles.eventImage}
                                            />
                                        </td>
                                        <td>{truncateText(event.name, 30)}</td>
                                        <td>{formatDate(event.startTime)}</td>
                                        <td>
                                            {truncateText(
                                                event.location?.venueName || '',
                                                20,
                                            )}
                                        </td>
                                        <td>{event.organizer?.name}</td>
                                        <td>{getStatusBadge(event.status)}</td>
                                        <td>
                                            {formatCurrency(
                                                event.totalRevenue || 0,
                                            )}
                                        </td>
                                        <td>
                                            <div
                                                className={styles.tableActions}
                                            >
                                                <Button
                                                    variant="link"
                                                    className={`${styles.actionButton} ${styles.viewButton}`}
                                                    title="Xem chi tiết"
                                                    onClick={() =>
                                                        handleViewEventDetails(
                                                            event,
                                                        )
                                                    }
                                                >
                                                    <FaEye />
                                                </Button>
                                                {/* Nếu sự kiện đang chờ duyệt (pending), hiển thị nút duyệt/từ chối */}
                                                {/* {event.status === 'pending' && (
                                            <>
                                                <Button
                                                    variant="link"
                                                    className={`${styles.actionButton} ${styles.approveButton}`}
                                                    title="Duyệt"
                                                    onClick={() =>
                                                        handleApproveEvent(
                                                            event,
                                                        )
                                                    }
                                                >
                                                    <FaCheck />
                                                </Button>
                                                <Button
                                                    variant="link"
                                                    className={`${styles.actionButton} ${styles.deleteButton}`}
                                                    title="Từ chối"
                                                    onClick={() =>
                                                        handleRejectEvent(event)
                                                    }
                                                >
                                                    <FaTimes />
                                                </Button>
                                            </>
                                        )} */}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className={styles.paginationContainer}>
                            <Pagination>
                                <Pagination.First
                                    onClick={() => handlePageChange(1)}
                                    disabled={currentPage === 1}
                                />
                                <Pagination.Prev
                                    onClick={() =>
                                        handlePageChange(currentPage - 1)
                                    }
                                    disabled={currentPage === 1}
                                />

                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index + 1}
                                        active={index + 1 === currentPage}
                                        onClick={() =>
                                            handlePageChange(index + 1)
                                        }
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}

                                <Pagination.Next
                                    onClick={() =>
                                        handlePageChange(currentPage + 1)
                                    }
                                    disabled={currentPage === totalPages}
                                />
                                <Pagination.Last
                                    onClick={() => handlePageChange(totalPages)}
                                    disabled={currentPage === totalPages}
                                />
                            </Pagination>
                        </div>
                    )}
                </>
            ) : (
                <div className="d-flex flex-column align-items-center justify-content-center my-5">
                    <BsCalendarX size={60} className="mb-3" />
                    <p className="fs-5">Không có sự kiện</p>
                </div>
            )}

            {/* Modal Chi tiết Sự kiện */}
            <Modal
                show={showEventDetails}
                onHide={() => setShowEventDetails(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitle}>
                        Chi tiết sự kiện
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {selectedEvent && <EventDetails event={selectedEvent} />}
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button
                        variant="secondary"
                        onClick={() => setShowEventDetails(false)}
                    >
                        Đóng
                    </Button>
                    {selectedEvent?.status !== 'event_over' && (
                        <>
                            {selectedEvent?.status !== 'approved' && (
                                <Button
                                    variant="success"
                                    onClick={() =>
                                        handleApproveEvent(selectedEvent._id)
                                    }
                                >
                                    Duyệt
                                </Button>
                            )}

                            {selectedEvent?.status !== 'rejected' && (
                                <Button
                                    variant="danger"
                                    onClick={() =>
                                        handleRejectEvent(selectedEvent._id)
                                    }
                                >
                                    Từ chối
                                </Button>
                            )}
                        </>
                    )}
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default EventsList;
