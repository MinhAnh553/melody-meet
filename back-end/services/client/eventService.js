import eventModel from '../../models/eventModel.js';

const createEvent = async (eventData) => {
    const event = new eventModel(eventData);
    await event.save();
    return event;
};

const getEvents = async () => {
    const events = await eventModel.find();

    return events;
};

const getEventById = async (id) => {
    const event = await eventModel.findOne({
        _id: id,
    });

    return event;
};

export default {
    createEvent,
    getEvents,
    getEventById,
};
