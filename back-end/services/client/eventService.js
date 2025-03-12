import eventModel from '../../models/eventModel.js';
import orderModel from '../../models/orderModel.js';

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

const getEvents = async () => {
    const events = await eventModel
        .find({
            status: 'approved',
            isFinished: false,
        })
        .sort({ createdAt: -1 });

    return events;
};

const getEventById = async (id) => {
    const event = await eventModel.findOne({
        _id: id,
    });

    return event;
};

const getMyEvents = async (userId, page, limit, status, isFinished) => {
    try {
        const events = await eventModel
            .find({
                userId: userId,
                status: status,
                isFinished: isFinished,
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
            isFinished: isFinished,
        });

        return {
            success: true,
            events: events,
            totalEvents: totalEvents,
            totalPages: Math.ceil(totalEvents / limit),
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
            .sort({ createdAt: -1 });

        return {
            success: true,
            orders: orders,
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export default {
    createEvent,
    updateEvent,
    getEvents,
    getEventById,
    getMyEvents,
    getOrdersByEventId,
};
