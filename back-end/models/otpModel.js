import mongoose from 'mongoose';

const otpSchema = new mongoose.Schema({
    email: String,
    otp: String,
    expiresAt: Date,
});

otpSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

const otpModel = mongoose.model('Otp', otpSchema, 'otp');

export default otpModel;
