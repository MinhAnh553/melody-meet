import mongoose from 'mongoose';
import ticketTypeModel from './ticketTypeModel.js';

const eventSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.Types.ObjectId,
        name: String,
        logo: String,
        background: String,
        location: {
            venueName: String,
            province: String,
            district: String,
            ward: String,
            address: String,
        },
        description: String,
        organizer: {
            logo: String,
            name: String,
            info: String,
        },
        startTime: Date,
        endTime: Date,
        ticketTypes: [ticketTypeModel],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

const eventModel = mongoose.model('Event', eventSchema, 'events');

export default eventModel;
