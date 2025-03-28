import userModel from '../../models/userModel.js';
import eventModel from '../../models/eventModel.js';
import orderModel from '../../models/orderModel.js';

const getDashboard = async (req, res) => {
    try {
        // const orders = await orderModel.find({
        //     status: "PAID"
        // })

        const orders = await orderModel.aggregate([
            { $match: { status: 'PAID' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalPrice' },
                    countPaidOrders: { $sum: 1 },
                },
            },
        ]);

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const ordersMonth = await orderModel.find({
            status: 'PAID',
            createdAt: { $gte: thirtyDaysAgo }, // Lọc theo thời gian
        });

        const revenueByDay = [];
        const labels = [];

        for (let i = 0; i < 30; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (29 - i)); // Tạo nhãn ngày từ 30 ngày trước đến hôm nay
            const formattedDate = date.toISOString().split('T')[0]; // Format YYYY-MM-DD
            labels.push(formattedDate);
            revenueByDay.push({ date: formattedDate, revenue: 0 }); // Khởi tạo revenue = 0
        }

        // Cộng doanh thu theo từng ngày
        ordersMonth.forEach((order) => {
            const orderDate = order.createdAt.toISOString().split('T')[0]; // Format YYYY-MM-DD
            const index = labels.indexOf(orderDate); // Xác định vị trí trong mảng
            if (index !== -1) {
                revenueByDay[index].revenue += order.totalPrice;
            }
        });

        const totalUsers = await userModel.countDocuments();
        const totalEvents = await eventModel.countDocuments();
        const totalOrders = orders.length > 0 ? orders[0].countPaidOrders : 0;
        const totalRevenue = orders.length > 0 ? orders[0].totalRevenue : 0;

        res.status(200).json({
            success: true,
            data: {
                totalRevenue,
                totalUsers,
                totalEvents,
                totalOrders,
                revenueByDay,
            },
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

export default {
    getDashboard,
};
