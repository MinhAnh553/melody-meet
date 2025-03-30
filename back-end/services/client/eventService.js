import cron from 'node-cron';

import eventModel from '../../models/eventModel.js';
import orderModel from '../../models/orderModel.js';
import userService from './userService.js';
import ticketModel from '../../models/ticketModel.js';

const createEvent = async (eventData) => {
    const event = new eventModel(eventData);
    await event.save();
    return event;
};

const updateEvent = async (id, data, userId) => {
    const event = await eventModel.findOne({
        _id: id,
        userId: userId,
    });

    if (!event) {
        return {
            success: false,
            message: 'Không tìm thấy sự kiện!',
        };
    }

    if (data.organizer.logo === '') {
        data.organizer.logo = event.organizer.logo;
    }

    await eventModel.updateOne({ _id: id, userId: userId }, { ...data });

    return {
        success: true,
        message: 'Cập nhật sự kiện thành công!',
    };
};

const updateStatusEvent = async (eventId, status) => {
    const updatedEvent = await eventModel.findByIdAndUpdate(
        { _id: eventId },
        { status },
        { new: true },
    );

    if (!updatedEvent) {
        return {
            success: false,
            message: 'Không tìm thấy sự kiện!',
        };
    }

    return {
        success: true,
        message: 'Cập nhật trạng thái sự kiện thành công!',
        // event: updatedEvent,
    };
};

const getEvents = async (status) => {
    const events = await eventModel
        .find({ status: status })
        .sort({ createdAt: -1 });
    return events;
};

const getAllEvents = async () => {
    const events = await eventModel.find().sort({ createdAt: -1 });
    return events;
};

const getEventById = async (id) => {
    const event = await eventModel.findOne({
        _id: id,
    });

    return event;
};

const getMyEvents = async (userId, page, limit, status) => {
    try {
        const events = await eventModel
            .find({
                userId: userId,
                status: status,
            })
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        if (!events || events.length === 0) {
            return {
                success: false,
                message: 'Không có sự kiện nào!',
            };
        }

        const totalEvents = await eventModel.countDocuments({
            userId: userId,
            status: status,
        });

        return {
            success: true,
            events: events,
            totalEvents: totalEvents,
            totalPages: Math.ceil(totalEvents / limit),
            currentPage: page,
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

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
            })
            .sort({ createdAt: -1 })
            .lean();

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
        return { success: false, message: error.message };
    }
};

const updateFinishedEvents = async () => {
    try {
        const currentTime = new Date();
        await eventModel.updateMany(
            {
                endTime: { $lt: currentTime },
                status: { $ne: 'event_over', $eq: 'approved' },
            },
            { $set: { status: 'event_over' } },
        );
    } catch (error) {
        console.error('Lỗi cập nhật sự kiện đã kết thúc:', error);
    }
};

cron.schedule('*/5 * * * *', () => {
    console.log('⏳ Kiểm tra sự kiện hết hạn...');
    updateFinishedEvents();
});

const eventSearch = async (query) => {
    try {
        const events = await eventModel
            .find({
                name: { $regex: query, $options: 'i' },
                status: { $nin: ['rejected', 'pending'] },
            })
            .select('_id name background');

        return { success: true, events };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export default {
    createEvent,
    updateEvent,
    updateStatusEvent,
    getEvents,
    getAllEvents,
    getEventById,
    getMyEvents,
    getOrdersByEventId,
    eventSearch,
};
