import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config();

import userModel from '../../models/userModel.js';
import otpModel from '../../models/otpModel.js';
import emailProvider from '../../providers/emailProvider.js';
import otpTemplate from '../../templates/otpTemplate.js';

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

const sendOTP = async (email) => {
    try {
        const existingUser = await userModel.findOne({
            email,
            deleted: false,
        });
        if (existingUser) {
            return {
                success: false,
                message:
                    'Email này đã được đăng ký. Vui lòng sử dụng email khác.',
            };
        }

        const existingOtp = await otpModel.findOne({
            email,
            expiresAt: { $gt: new Date() },
        });

        if (existingOtp) {
            return {
                success: false,
                message:
                    'Mã xác minh đã được gửi. Vui lòng kiểm tra email trước khi yêu cầu lại.',
            };
        }

        await otpModel.deleteMany({ email });

        const otp = generateOTP();
        const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // OTP hết hạn sau 5 phút

        const otpRecord = new otpModel({
            email,
            otp,
            expiresAt,
        });
        await otpRecord.save();

        await emailProvider.sendMail(
            email,
            'Melody Meet - Mã Xác Minh',
            otpTemplate(otp),
        );

        return {
            success: true,
            message: 'Mã xác minh đã được gửi đến email của bạn.',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        };
    }
};

const verifyOTPAndRegister = async (email, otp, password) => {
    try {
        const otpRecord = await otpModel.findOne({ email, otp });
        if (!otpRecord)
            return {
                success: false,
                message: 'Mã xác minh không đúng hoặc đã hết hạn',
            };
        if (otpRecord.expiresAt < new Date()) {
            await otpModel.deleteMany({ email });
            return {
                success: false,
                message: 'Mã xác minh đã hết hạn.',
            };
        }

        await otpModel.deleteMany({ email });

        // Băm mật khẩu và tạo tài khoản
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new userModel({ email, password: hashedPassword });
        await user.save();

        return {
            success: true,
            message: 'Đăng ký thành công!',
        };
    } catch (error) {
        console.log(error);
        return {
            success: false,
            message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        };
    }
};

const login = async (email, password) => {
    try {
        const user = await userModel.findOne({
            email,
            deleted: false,
        });

        if (user) {
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return {
                    success: false,
                    message: 'Email hoặc mật khẩu không chính xác!',
                };
            } else {
                if (user.status == 'inactive')
                    throw new Error('Tài khoản đã bị khóa!');

                // JWT
                const payload = {
                    email: user.email,
                    role: user.role,
                };

                const access_token = jwt.sign(payload, process.env.JWT_SECRET, {
                    expiresIn: '1d',
                });

                return {
                    success: true,
                    message: 'Đăng nhập thành công!',
                    access_token,
                    user: {
                        email: user.email,
                        role: user.role,
                    },
                };
            }
        } else {
            return {
                success: false,
                message: 'Email hoặc mật khẩu không chính xác!',
            };
        }
    } catch (error) {
        return {
            success: false,
            message: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
        };
    }
};

export default {
    sendOTP,
    verifyOTPAndRegister,
    login,
};
