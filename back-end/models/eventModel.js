import mongoose from 'mongoose';

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
        ticketTypes: [
            {
                name: { type: String, required: true }, // Tên vé
                price: { type: Number, required: true }, // Giá vé; nếu miễn phí, đặt là 0
                totalQuantity: { type: Number, required: true }, // Tổng số lượng vé
                maxPerUser: { type: Number, required: true }, // Số vé tối đa mà 1 người có thể mua
                description: { type: String }, // Thông tin vé
            },
        ],
        // Đã đợi duyệt, được duyệt, từ chối
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
        // Trạng thái sự kiện đã diễn ra hay chưa
        isFinished: {
            type: Boolean,
            default: false,
        },
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true },
);

const eventModel = mongoose.model('Event', eventSchema, 'events');

export default eventModel;
