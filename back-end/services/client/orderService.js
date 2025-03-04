import orderModel from '../../models/orderModel.js';

const createOrder = async (userId, eventId, items, totalPrice) => {
    try {
        const orderId = `${
            Number(await orderModel.countDocuments()) + 1
        }${Number(String(Date.now()).slice(-6))}`;
        const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

        const newOrder = new orderModel({
            userId,
            eventId,
            orderId,
            items,
            totalPrice,
            status: 'PENDING',
            expiredAt,
        });
        await newOrder.save();

        return {
            success: true,
            orderId: newOrder._id,
            message: 'Tạo đơn hàng thành công!',
        };
    } catch (error) {
        console.error('create order error:', error);
        return { success: false, message: error.message };
    }
};

const getOrderById = async (id) => {
    try {
        const order = await orderModel.findById(id);
        if (!order) {
            return {
                success: false,
                message: 'Đơn hàng không tồn tại!',
            };
        }

        // Kiểm tra hết hạn chưa
        if (
            (Date.now() > order.expiredAt.getTime() &&
                order.status === 'PENDING') ||
            order.status === 'CANCELED'
        ) {
            // Hết hạn => hủy
            order.status = 'CANCELED';
            await order.save();
            return {
                success: false,
                reason: 'expired',
                eventId: order.eventId,
                message: 'Đơn hàng đã hết hạn!',
            };
        }

        if (order.status !== 'PENDING') {
            return {
                success: false,
                message: 'Đơn hàng không ở trạng thái CHỜ XỬ LÝ',
            };
        }

        return { success: true, order };
    } catch (error) {
        // console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

const updateOrderById = async (id, data) => {
    try {
        await orderModel.updateOne(
            {
                _id: id,
            },
            {
                ...data,
            },
        );

        return { success: true, message: 'Cập nhật thành công!' };
    } catch (error) {
        console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

const getOrderByOrderId = async (id) => {
    try {
        const order = await orderModel.findOne({
            orderId: id,
        });
        if (!order) {
            return {
                success: false,
                message: 'Đơn hàng không tồn tại!',
            };
        }

        return { success: true, order };
    } catch (error) {
        // console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

export default {
    createOrder,
    getOrderById,
    updateOrderById,
    getOrderByOrderId,
};
