import mongoose from 'mongoose';

const ticketSchema = new mongoose.Schema(
    {
        orderId: mongoose.Schema.Types.ObjectId,
        ticketId: Number,
        name: String,
        price: Number,
        quantity: Number,
        used: {
            default: false,
            type: Boolean,
        },
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

ticketSchema.pre('save', async function (next) {
    this.updatedAt = new Date();

    // if (!this.ticketId) {
    //     const lastTicket = await ticketModel.findOne().sort({ ticketId: -1 });
    //     this.ticketId = lastTicket ? lastTicket.ticketId + 1 : 1;
    // }
    next();
});

const ticketModel = mongoose.model('Ticket', ticketSchema, 'tickets');

export default ticketModel;
