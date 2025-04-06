import dotenv from 'dotenv';
import PayOS from '@payos/node';
dotenv.config();

const payOS = new PayOS(
    process.env.PAYOS_CLIENT_ID,
    process.env.PAYOS_API_KEY,
    process.env.PAYOS_CHECKSUM_KEY,
);

const createPayOSOrder = async (userInfo, order, tickets) => {
    const YOUR_DOMAIN = process.env.FONTEND_URL;

    const body = {
        orderCode: order.orderId,
        buyerName: userInfo.name,
        buyerEmail: userInfo.email,
        buyerPhone: userInfo.phone,
        amount: order.totalPrice,
        items: tickets,
        description: 'Melody Meet',
        expiredAt: Math.floor(new Date(order.expiredAt).getTime() / 1000),
        returnUrl: `${YOUR_DOMAIN}/order/payment-success`,
        cancelUrl: `${YOUR_DOMAIN}`,
    };

    try {
        const paymentLinkResponse = await payOS.createPaymentLink(body);
        return {
            success: true,
            payUrl: paymentLinkResponse.checkoutUrl,
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

const getInfoPayOSOrder = async (orderCode) => {
    try {
        const order = await payOS.getPaymentLinkInformation(orderCode);
        if (!order) {
            return {
                success: false,
                message: 'Không tìm thấy đơn hàng!',
            };
        }

        return {
            success: true,
            data: order,
        };
    } catch (error) {
        console.error(error);
        return { success: false, message: error.message };
    }
};

export default {
    createPayOSOrder,
    getInfoPayOSOrder,
};
