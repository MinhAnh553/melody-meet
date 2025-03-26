import React, { useState } from 'react';
import {
    Table,
    Button,
    Form,
    InputGroup,
    Badge,
    Pagination,
    Modal,
} from 'react-bootstrap';
import { FaSearch, FaEdit, FaTrash, FaEye } from 'react-icons/fa';
import styles from './Users.module.css';
import { users } from '../../data/mockData';
import { formatDate, formatUserRole } from '../../utils/formatters';
import UserForm from './UserForm';

const UsersList = () => {
    const [searchTerm, setSearchTerm] = useState('');
    const [roleFilter, setRoleFilter] = useState('all');
    const [sortBy, setSortBy] = useState('name');
    const [sortOrder, setSortOrder] = useState('asc');
    const [currentPage, setCurrentPage] = useState(1);
    const [showUserForm, setShowUserForm] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const itemsPerPage = 5;

    // Filter users
    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        return matchesSearch && matchesRole;
    });

    // Sort users
    const sortedUsers = [...filteredUsers].sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return sortOrder === 'asc'
                    ? a.name.localeCompare(b.name)
                    : b.name.localeCompare(a.name);
            case 'email':
                return sortOrder === 'asc'
                    ? a.email.localeCompare(b.email)
                    : b.email.localeCompare(a.email);
            case 'createdAt':
                return sortOrder === 'asc'
                    ? new Date(a.createdAt) - new Date(b.createdAt)
                    : new Date(b.createdAt) - new Date(a.createdAt);
            default:
                return 0;
        }
    });

    // Pagination
    const totalPages = Math.ceil(sortedUsers.length / itemsPerPage);
    const indexOfLastUser = currentPage * itemsPerPage;
    const indexOfFirstUser = indexOfLastUser - itemsPerPage;
    const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);

    // Handle sorting change
    const handleSortChange = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('asc');
        }
    };

    // Handle pagination
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // User role badge
    const getRoleBadge = (role) => {
        switch (role) {
            case 'admin':
                return (
                    <Badge
                        className={`${styles.userRoleBadge} ${styles.userRoleAdmin}`}
                    >
                        Quản trị viên
                    </Badge>
                );
            case 'organizer':
                return (
                    <Badge
                        className={`${styles.userRoleBadge} ${styles.userRoleOrganizer}`}
                    >
                        Nhà tổ chức
                    </Badge>
                );
            case 'user':
                return (
                    <Badge
                        className={`${styles.userRoleBadge} ${styles.userRoleUser}`}
                    >
                        Người dùng
                    </Badge>
                );
            default:
                return <Badge className={styles.userRoleBadge}>{role}</Badge>;
        }
    };

    // Handle add/edit user
    const handleAddUser = () => {
        setEditingUser(null);
        setShowUserForm(true);
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setShowUserForm(true);
    };

    const handleFormSubmit = (userData) => {
        // In a real app, this would save to a backend API
        console.log('Save user:', userData);
        setShowUserForm(false);
    };

    // Handle delete user
    const handleDeleteClick = (user) => {
        setUserToDelete(user);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = () => {
        // In a real app, this would delete from a backend API
        console.log('Delete user:', userToDelete);
        setShowDeleteModal(false);
    };

    return (
        <div className={styles.usersContainer}>
            <h1 className={styles.pageTitle}>Quản lý người dùng</h1>

            {/* Table Header */}
            <div className={styles.tableHeader}>
                <Button variant="primary" onClick={handleAddUser}>
                    Thêm người dùng mới
                </Button>

                <div className={styles.searchFilter}>
                    <InputGroup className={styles.searchInput}>
                        <InputGroup.Text id="search-addon">
                            <FaSearch />
                        </InputGroup.Text>
                        <Form.Control
                            placeholder="Tìm kiếm người dùng..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </InputGroup>

                    <Form.Select
                        value={roleFilter}
                        onChange={(e) => setRoleFilter(e.target.value)}
                    >
                        <option value="all">Tất cả vai trò</option>
                        <option value="admin">Quản trị viên</option>
                        <option value="organizer">Nhà tổ chức</option>
                        <option value="user">Người dùng</option>
                    </Form.Select>
                </div>
            </div>

            {/* Users Table */}
            <div className={styles.tableWrapper}>
                <Table responsive hover className={styles.userTable}>
                    <thead>
                        <tr>
                            <th></th>
                            <th
                                onClick={() => handleSortChange('name')}
                                style={{ cursor: 'pointer' }}
                            >
                                Tên người dùng{' '}
                                {sortBy === 'name' &&
                                    (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th
                                onClick={() => handleSortChange('email')}
                                style={{ cursor: 'pointer' }}
                            >
                                Email{' '}
                                {sortBy === 'email' &&
                                    (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Vai trò</th>
                            <th
                                onClick={() => handleSortChange('createdAt')}
                                style={{ cursor: 'pointer' }}
                            >
                                Ngày tạo{' '}
                                {sortBy === 'createdAt' &&
                                    (sortOrder === 'asc' ? '↑' : '↓')}
                            </th>
                            <th>Thao tác</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.map((user) => (
                            <tr key={user.id}>
                                <td>
                                    <div className={styles.userAvatar}>
                                        {user.avatar}
                                    </div>
                                </td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{getRoleBadge(user.role)}</td>
                                <td>{formatDate(user.createdAt)}</td>
                                <td>
                                    <div className={styles.tableActions}>
                                        <Button
                                            variant="link"
                                            className={`${styles.actionButton} ${styles.viewButton}`}
                                            title="Xem chi tiết"
                                        >
                                            <FaEye />
                                        </Button>
                                        <Button
                                            variant="link"
                                            className={`${styles.actionButton} ${styles.editButton}`}
                                            title="Chỉnh sửa"
                                            onClick={() => handleEditUser(user)}
                                        >
                                            <FaEdit />
                                        </Button>
                                        <Button
                                            variant="link"
                                            className={`${styles.actionButton} ${styles.deleteButton}`}
                                            title="Xóa"
                                            onClick={() =>
                                                handleDeleteClick(user)
                                            }
                                        >
                                            <FaTrash />
                                        </Button>
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
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        />

                        {[...Array(totalPages)].map((_, index) => (
                            <Pagination.Item
                                key={index + 1}
                                active={index + 1 === currentPage}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </Pagination.Item>
                        ))}

                        <Pagination.Next
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        />
                        <Pagination.Last
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        />
                    </Pagination>
                </div>
            )}

            {/* User Form Modal */}
            <Modal
                show={showUserForm}
                onHide={() => setShowUserForm(false)}
                size="lg"
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitle}>
                        {editingUser
                            ? 'Chỉnh sửa người dùng'
                            : 'Thêm người dùng mới'}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <UserForm
                        user={editingUser}
                        onSubmit={handleFormSubmit}
                        onCancel={() => setShowUserForm(false)}
                    />
                </Modal.Body>
            </Modal>

            {/* Delete Confirmation Modal */}
            <Modal
                show={showDeleteModal}
                onHide={() => setShowDeleteModal(false)}
                centered
            >
                <Modal.Header closeButton>
                    <Modal.Title className={styles.modalTitle}>
                        Xác nhận xóa
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Bạn có chắc chắn muốn xóa người dùng "{userToDelete?.name}"?
                    Hành động này không thể hoàn tác.
                </Modal.Body>
                <Modal.Footer className={styles.modalFooter}>
                    <Button
                        variant="secondary"
                        onClick={() => setShowDeleteModal(false)}
                    >
                        Hủy
                    </Button>
                    <Button variant="danger" onClick={handleDeleteConfirm}>
                        Xóa
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UsersList;
