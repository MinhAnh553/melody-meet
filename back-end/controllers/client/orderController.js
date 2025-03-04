import orderService from '../../services/client/orderService.js';
import payosService from '../../services/client/payosService.js';

const createOrder = async (req, res) => {
    try {
        const { eventId, items, totalPrice } = req.body;
        const userId = req.user.id;

        const result = await orderService.createOrder(
            userId,
            eventId,
            items,
            totalPrice,
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

const updateOrder = async (req, res) => {
    try {
        const result = await orderService.updateOrderById(
            req.body.orderId,
            req.body.data,
        );

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
            const pay = await payosService.createPayOSOrder(
                req.user.address,
                order,
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

        const result = await orderService.getOrderByOrderId(orderCode);
        if (result.success) {
            const pay = await payosService.getInfoPayOSOrder(orderCode);

            if (pay.success && pay.data.status == 'PAID') {
                // update database
                const update = await orderService.updateOrderById(
                    result.order._id,
                    {
                        status: 'PAID',
                    },
                );
                return res.status(200).json(update);
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

export default {
    createOrder,
    getOrder,
    updateOrder,
    selectPayment,
    checkOrder,
    getOrderSuccess,
};
