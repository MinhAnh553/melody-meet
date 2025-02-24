import eventModel from '../../models/eventModel.js';

const createEvent = async (eventData) => {
    const event = new eventModel(eventData);
    await event.save();
    return event;
};

export default {
    createEvent,
};
