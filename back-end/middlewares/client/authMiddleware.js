import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAuthorized = (req, res, next) => {
    const white_lists = [
        '/',
        '/user/send-otp',
        '/user/verify-otp',
        '/user/login',
        '/event',
    ];
    if (white_lists.find((item) => '/api/v1' + item === req.originalUrl)) {
        return next();
    }

    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        // Xác nhận token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role,
            };
            next();
        } catch (error) {
            return res.status(401).json({
                success: false,
                message: 'Token bị hết hạn hoặc không hợp lệ.',
            });
        }
    } else {
        return res.status(401).json({
            success: false,
            message: 'Không có token, vui lòng đăng nhập.',
        });
    }
};

export default {
    isAuthorized,
};
