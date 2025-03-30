import orderService from '../../services/client/orderService.js';
import payosService from '../../services/client/payosService.js';

const createOrder = async (req, res) => {
    try {
        const { eventId, items, totalPrice, buyerInfo } = req.body;
        const userId = req.user.id;

        const result = await orderService.createOrder(
            userId,
            eventId,
            items,
            totalPrice,
            buyerInfo,
        );

        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json({
            success: false,
            message: 'Lỗi khi khởi tạo đơn hàng!',
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getOrder = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await orderService.getOrderById(orderId);

        if (result.success) {
            if (req.user.id != result.order.userId) {
                return res.status(404).json({
                    success: false,
                    message: 'Không đủ quyền hạn!',
                });
            }
            return res.status(200).json(result);
        }

        if (result.reason == 'expired') {
            return res.status(410).json(result);
        }
        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const cancelOrder = async (req, res) => {
    try {
        const { orderId } = req.body;
        const result = await orderService.cancelOrder(orderId);

        if (result.success) {
            return res.status(200).json(result);
        }

        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const selectPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const { method } = req.query;
        // Hiện tại chỉ có payos
        if (method !== 'payos') {
            return res.json({
                success: false,
                message: 'Không hỗ trợ phương thức này!',
            });
        }

        const result = await orderService.getOrderById(orderId);
        if (result.success) {
            const order = result.order;
            const tickets = await orderService.getOrderTickets(orderId);

            const pay = await payosService.createPayOSOrder(
                req.user.address,
                order,
                tickets.tickets,
            );

            return res.status(200).json(pay);
        }

        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const checkOrder = async (req, res) => {
    try {
        const { orderCode } = req.body;

        const result = await orderService.orderSuccess(orderCode, req.user.id);
        if (result.success) {
            return res.status(200).json(result);
        }

        if (result.status === 401) {
            return res.status(401).json(result);
        }

        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getOrderSuccess = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await orderService.getOrderByOrderId(orderId);
        if (result.success) {
            if (result.order.userId == req.user.id) {
                return res.status(200).json(result);
            } else {
                return res.status(403).json({
                    success: false,
                    message: 'Thông tin truy cập không hợp lệ!',
                });
            }
        }
        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getMyOrders = async (req, res) => {
    try {
        const userId = req.user.id;

        const result = await orderService.getMyOrders(userId);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getOrderTickets = async (req, res) => {
    try {
        const { orderId } = req.params;

        const result = await orderService.getOrderTickets(orderId);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getAllOrders = async (req, res) => {
    try {
        const result = await orderService.getAllOrders();
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const updateStatusOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const allowedStatuses = ['CANCELED', 'PAID', 'PENDING'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: 'Trạng thái không hợp lệ!',
            });
        }

        const result = await orderService.updateStatusOrder(id, status);
        if (!result.success) {
            return res.status(404).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

export default {
    createOrder,
    getOrder,
    cancelOrder,
    selectPayment,
    checkOrder,
    getOrderSuccess,
    getMyOrders,
    getOrderTickets,
    getAllOrders,
    updateStatusOrder,
};
