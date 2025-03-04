import dotenv from 'dotenv';

import orderModel from '../../models/orderModel.js';
import PayOS from '@payos/node';
dotenv.config();

const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY,
);

const createOrder = async (userId, eventId, items, totalPrice) => {
    try {
        const orderId = Number(await orderModel.countDocuments()) + 1;
        const expiredAt = new Date(Date.now() + 15 * 60 * 1000);

        const newOrder = new orderModel({
            userId,
            eventId,
            orderId,
            items,
            totalPrice,
            status: 'PENDING',
            expiredAt,
        });
        await newOrder.save();

        return {
            success: true,
            orderId: newOrder._id,
            message: 'Tạo đơn hàng thành công!',
        };
    } catch (error) {
        console.error('create order error:', error);
        return { success: false, message: error.message };
    }
    // const YOUR_DOMAIN = process.env.FONTEND_URL;
    // const body = {
    //     orderCode: orderId,
    //     buyerName: userInfo.name,
    //     buyerEmail: userInfo.email,
    //     buyerPhone: userInfo.phone,
    //     amount: totalPrice,
    //     items,
    //     description: 'Melody Meet',
    //     expiredAt: Math.floor(Date.now() / 1000) + 900,
    //     returnUrl: `${YOUR_DOMAIN}/order/payment-success`,
    //     cancelUrl: `${YOUR_DOMAIN}/order/canceled`,
    // };

    // try {
    //     const paymentLinkResponse = await payOS.createPaymentLink(body);
    //     return {
    //         success: true,
    //         payUrl: paymentLinkResponse.checkoutUrl,
    //         orderId: newOrder._id,
    //     };
    // } catch (error) {
    //     console.error(error);
    //     return { success: false, message: error.message };
    // }
};

const getOrderById = async (id) => {
    try {
        const order = await orderModel.findById(id);
        if (!order) {
            return {
                success: false,
                message: 'Đơn hàng không tồn tại!',
            };
        }

        // Kiểm tra hết hạn chưa
        if (
            (Date.now() > order.expiredAt.getTime() &&
                order.status === 'PENDING') ||
            order.status === 'CANCELED'
        ) {
            // Hết hạn => hủy
            order.status = 'CANCELED';
            await order.save();
            return {
                success: false,
                reason: 'expired',
                eventId: order.eventId,
                message: 'Đơn hàng đã hết hạn!',
            };
        }

        return { success: true, order };
    } catch (error) {
        console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

const updateOrderById = async (id, data) => {
    try {
        await orderModel.updateOne(
            {
                _id: id,
            },
            {
                ...data,
            },
        );

        return { success: true, message: 'Cập nhật thành công!' };
    } catch (error) {
        console.error('get order error:', error);
        return { success: false, message: error.message };
    }
};

export default {
    createOrder,
    getOrderById,
    updateOrderById,
};
