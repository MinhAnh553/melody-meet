import eventModel from '../../models/eventModel.js';

const createEvent = async (eventData) => {
    const event = new eventModel(eventData);
    await event.save();
    return event;
};

const getEvents = async () => {
    const events = await eventModel.find({
        status: 'approved',
        isFinished: false,
    });

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

export default {
    createEvent,
    getEvents,
    getEventById,
    getMyEvents,
};
