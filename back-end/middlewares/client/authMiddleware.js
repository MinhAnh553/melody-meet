import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const isAuthorized = (req, res, next) => {
    if (req.headers && req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];

        // Xác nhận token
        try {
            const decoded = jwt.verify(token, process.env.JWT_SECRET);
            req.user = {
                id: decoded.id,
                email: decoded.email,
                name: decoded.name,
                phone: decoded.phone,
                address: decoded.address,
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

const isAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        return res.status(403).json({
            success: false,
            message: 'Bạn không có quyền truy cập tài nguyên này!',
        });
    }
};

export default {
    isAuthorized,
    isAdmin,
};
