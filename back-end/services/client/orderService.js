import cron from 'node-cron';

import eventModel from '../../models/eventModel.js';
import orderModel from '../../models/orderModel.js';
import ticketModel from '../../models/ticketModel.js';
import payosService from './payosService.js';
import userService from './userService.js';
import mailTemplate from '../../templates/mailTemplate.js';
import emailProvider from '../../providers/emailProvider.js';

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
        // await ticketModel.deleteMany({
        //     orderId: id,
        // });

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

            const user = await userService.getUserById(userId);

            const event = await eventModel.findById(order.eventId);

            const tickets = await ticketModel.find({
                orderId: order._id,
            });

            // Cập nhật số lượng vé còn lại
            await Promise.all(
                tickets.map(async (ticket) => {
                    const ticketType = event.ticketTypes.find(
                        (item) => item.name === ticket.name,
                    );
                    ticketType.totalQuantity -= ticket.quantity;
                }),
            );

            await event.save();

            // Gửi mail thông tin vé
            await emailProvider.sendMail(
                user.address.email,
                'Melody Meet: Giao Dịch Thành Công',
                mailTemplate.ticketInfoTemplate(
                    user.address.name,
                    event,
                    order,
                    tickets,
                ),
            );
        }

        return { success: true, message: 'Cập nhật thành công!' };
    } catch (error) {
        console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

const getMyOrders = async (userId) => {
    try {
        // Lấy danh sách đơn hàng
        let orders = await orderModel
            .find({ userId, status: 'PAID' })
            .sort({ createdAt: -1 });

        // Nếu không có đơn hàng
        if (!orders.length) {
            return {
                success: false,
                message: 'Không có đơn hàng nào!',
            };
        }

        // Lấy chi tiết đơn hàng (kèm event và ticket)
        let newOrders = [];
        for (const order of orders) {
            const event = await eventModel.findById(order.eventId);
            const tickets = await ticketModel.find({ orderId: order._id });

            newOrders.push({
                ...order.toObject(),
                image: event?.background || '',
                tickets,
                name: event?.name || 'Sự kiện không tồn tại',
                eventStatus: event?.status || 'unknown',
                startTime: event.startTime,
                endTime: event.endTime,
            });
        }

        return {
            success: true,
            orders: newOrders,
        };
    } catch (error) {
        console.error('Lỗi khi lấy đơn hàng:', error);
        return { success: false, message: 'Lỗi server' };
    }
};

const cancelExpiredOrders = async () => {
    try {
        const now = new Date();
        const result = await orderModel.updateMany(
            { expiredAt: { $lte: now }, status: 'PENDING' },
            { $set: { status: 'CANCELED', updatedAt: now } },
        );

        // console.log(
        //     `Updated ${result.modifiedCount} expired orders to CANCELED.`,
        // );
    } catch (error) {
        console.error('Error updating expired orders:', error);
    }
};

cron.schedule('*/5 * * * *', cancelExpiredOrders);

const getOrdersByEventId = async (eventId, userId) => {
    try {
        const event = await eventModel.findOne({
            _id: eventId,
            userId: userId,
        });

        if (!event) {
            return {
                success: false,
                message: 'Không tìm thấy sự kiện!',
            };
        }

        const orders = await orderModel
            .find({
                eventId: eventId,
                status: 'PAID',
            })
            .sort({ createdAt: -1 });

        return {
            success: true,
            orders: orders,
        };
    } catch (error) {
        console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

const getAllOrders = async () => {
    try {
        const orders = await orderModel.find().sort({ createdAt: -1 }).lean();

        if (!orders || orders.length === 0) {
            return {
                success: false,
                message: 'Không có đơn hàng nào!',
            };
        }

        await Promise.all(
            orders.map(async (order) => {
                const user = await userService.getUserById(order.userId);
                order.infoUser = user.address;

                const event = await eventModel.findById(order.eventId);
                order.eventName = event.name;
                order.eventStatus = event.status;

                const tickets = await ticketModel.find({
                    orderId: order._id,
                });
                order.tickets = tickets;
            }),
        );

        return {
            success: true,
            orders,
        };
    } catch (error) {
        // console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

const updateStatusOrder = async (orderId, status) => {
    const updatedOrder = await orderModel.findByIdAndUpdate(
        { _id: orderId },
        { status },
        { new: true },
    );

    if (!updatedOrder) {
        return {
            success: false,
            message: 'Không tìm thấy đơn hàng!',
        };
    }

    return {
        success: true,
        message: 'Cập nhật trạng thái đơn hàng thành công!',
        // event: updatedOrder,
    };
};

export default {
    createOrder,
    getOrderById,
    cancelOrder,
    getOrderByOrderId,
    getMyOrders,
    getOrderTickets,
    orderSuccess,
    getOrdersByEventId,
    getAllOrders,
    updateStatusOrder,
};
