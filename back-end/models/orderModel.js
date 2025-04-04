import mongoose from 'mongoose';

const orderSchema = new mongoose.Schema(
    {
        userId: mongoose.Schema.Types.ObjectId,
        buyerInfo: {
            name: String,
            phone: String,
            email: String,
        },
        eventId: mongoose.Schema.Types.ObjectId,
        orderId: Number,
        totalPrice: { type: Number },
        status: { type: String, default: 'PENDING' }, // 'PENDING', 'PAID', 'FAILED'
        expiredAt: Date,
        createdAt: { type: Date, default: Date.now },
        updatedAt: { type: Date, default: Date.now },
    },
    { timestamps: true },
);

orderSchema.pre('save', function (next) {
    this.updatedAt = new Date();
    next();
});

const orderModel = mongoose.model('Order', orderSchema, 'orders');

export default orderModel;
