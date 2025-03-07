import eventModel from '../../models/eventModel.js';
import orderModel from '../../models/orderModel.js';
import ticketModel from '../../models/ticketModel.js';
import payosService from './payosService.js';

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
            totalPrice,
            status: 'PENDING',
            expiredAt,
        });
        await newOrder.save();

        const lastTicket = await ticketModel.findOne().sort({ ticketId: -1 });
        let ticketIdStart = lastTicket ? lastTicket.ticketId + 1 : 1;
        await Promise.all(
            items.map(async (item, index) => {
                const ticket = new ticketModel({
                    orderId: newOrder._id,
                    ticketId: ticketIdStart + index,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                });
                await ticket.save();
            }),
        );

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

const cancelOrder = async (id) => {
    try {
        await orderModel.updateOne(
            {
                _id: id,
            },
            {
                status: 'CANCELED',
            },
        );

        // delete ticket
        await ticketModel.deleteMany({
            orderId: id,
        });

        return { success: true, message: 'Hủy đơn hàng thành công!' };
    } catch (error) {
        console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

const getOrderTickets = async (id) => {
    try {
        const tickets = await ticketModel.find({
            orderId: id,
        });
        if (!tickets || tickets.length === 0) {
            return {
                success: false,
                message: 'Đơn hàng không tồn tại!',
            };
        }

        return { success: true, tickets };
    } catch (error) {
        // console.error('get order error:', error);
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

const orderSuccess = async (orderCode, userId) => {
    try {
        const order = await orderModel.findOne({
            orderId: orderCode,
        });

        if (!order) {
            return {
                success: false,
                message: 'Đơn hàng không tồn tại!',
            };
        }

        // Kiểm tra người dùng đúng không
        if (order.userId.toString() !== userId) {
            return {
                success: false,
                status: 401,
                message: 'Thông tin truy cập không hợp lệ!',
            };
        }

        if (order.status === 'PAID') {
            return {
                success: false,
                message: 'Đơn hàng đã được thanh toán!',
            };
        }

        const pay = await payosService.getInfoPayOSOrder(orderCode);

        if (pay.success && pay.data.status == 'PAID') {
            // update database
            await orderModel.updateOne(
                {
                    _id: order._id,
                },
                {
                    status: 'PAID',
                },
            );

            const tickets = await ticketModel.find({
                orderId: order._id,
            });

            // Cập nhật số lượng vé còn lại
            await Promise.all(
                tickets.map(async (ticket) => {
                    const event = await eventModel.findById(order.eventId);
                    const ticketType = event.ticketTypes.find(
                        (item) => item.name === ticket.name,
                    );
                    ticketType.totalQuantity -= ticket.quantity;
                    await event.save();
                }),
            );
        }

        return { success: true, message: 'Cập nhật thành công!' };
    } catch (error) {
        // console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

const getMyOrders = async (userId, page, limit) => {
    try {
        const orders = await orderModel
            .find({
                userId: userId,
                status: 'PAID',
            })
            .skip((page - 1) * limit)
            .limit(limit);

        if (!orders || orders.length === 0) {
            return {
                success: false,
                message: 'Không có đơn hàng nào!',
            };
        }

        const newOrders = await Promise.all(
            orders.map(async (order) => {
                const event = await eventModel.findById(order.eventId);
                const tickets = await ticketModel.find({
                    orderId: order._id,
                });

                return {
                    ...order.toObject(),
                    image: event.background,
                    tickets: tickets,
                };
            }),
        );

        const totalOrders = await orderModel.countDocuments({
            userId: userId,
            status: 'PAID',
        });

        return {
            success: true,
            orders: newOrders,
            totalTickets: totalOrders,
            totalPages: Math.ceil(totalOrders / limit),
            currentPage: page,
        };
    } catch (error) {
        // console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

export default {
    createOrder,
    getOrderById,
    cancelOrder,
    getOrderByOrderId,
    getMyOrders,
    getOrderTickets,
    orderSuccess,
};
