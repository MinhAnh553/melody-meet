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
export default {
    createEvent,
    getEvents,
};
