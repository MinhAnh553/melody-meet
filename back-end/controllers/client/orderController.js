import orderService from '../../services/client/orderService.js';

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

export default {
    createOrder,
    getOrder,
    updateOrder,
};
