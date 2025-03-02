import mongoose from 'mongoose';

const ticketTypeSchema = new mongoose.Schema({
    name: { type: String, required: true }, // Tên vé
    price: { type: Number, required: true }, // Giá vé; nếu miễn phí, đặt là 0
    totalQuantity: { type: Number, required: true }, // Tổng số lượng vé
    maxPerUser: { type: Number, required: true }, // Số vé tối đa mà 1 người có thể mua
    // startTime: { type: Date, required: true }, // Thời gian bắt đầu bán vé
    // endTime: { type: Date, required: true }, // Thời gian kết thúc bán vé
    description: { type: String }, // Thông tin vé
    image: { type: String },
});

export default ticketTypeSchema;
