import cron from 'node-cron';

import eventModel from '../../models/eventModel.js';
import orderModel from '../../models/orderModel.js';
import userService from './userService.js';
import ticketModel from '../../models/ticketModel.js';

const createEvent = async (eventData) => {
    const event = new eventModel(eventData);
    await event.save();
    return event;
};

const updateEvent = async (id, data, userId) => {
    const event = await eventModel.findOne({
        _id: id,
        userId: userId,
    });

    if (!event) {
        return {
            success: false,
            message: 'Không tìm thấy sự kiện!',
        };
    }

    if (data.organizer.logo === '') {
        data.organizer.logo = event.organizer.logo;
    }

    await eventModel.updateOne({ _id: id, userId: userId }, { ...data });

    return {
        success: true,
        message: 'Cập nhật sự kiện thành công!',
    };
};

const updateStatusEvent = async (eventId, status) => {
    const updatedEvent = await eventModel.findByIdAndUpdate(
        { _id: eventId },
        { status },
        { new: true },
    );

    if (!updatedEvent) {
        return {
            success: false,
            message: 'Không tìm thấy sự kiện!',
        };
    }

    return {
        success: true,
        message: 'Cập nhật trạng thái sự kiện thành công!',
        // event: updatedEvent,
    };
};

const getEvents = async (type, status) => {
    let events = [];
    if (type == 'trending') {
        events = await orderModel.aggregate([
            {
                $match: { status: 'PAID' },
            },
            // Nhóm theo eventId và đếm số order của từng sự kiện
            {
                $group: {
                    _id: '$eventId',
                    totalRevenue: { $sum: '$totalPrice' }, // Tổng doanh thu
                },
            },

            // Kết nối với bảng events
            {
                $lookup: {
                    from: 'events',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'eventDetails',
                },
            },
            { $unwind: '$eventDetails' }, // Chuyển eventDetails từ mảng thành object

            // Chỉ lấy các sự kiện đã được duyệt
            { $match: { 'eventDetails.status': 'approved' } },

            // 🔽 Sắp xếp theo tổng doanh thu (giảm dần)
            //    Nếu doanh thu bằng nhau, ưu tiên startTime gần nhất với ngày hiện tại
            {
                $addFields: {
                    startTimeDiff: {
                        $abs: {
                            $subtract: ['$eventDetails.startTime', new Date()],
                        },
                    },
                },
            },
            { $sort: { totalRevenue: -1, startTimeDiff: 1 } },

            // Lấy tối đa 4 sự kiện hot nhất
            { $limit: 4 },
        ]);

        return events.map((e) => e.eventDetails);
    }
    if (type == 'special') {
        events = await eventModel
            .find({ status: status })
            .sort({ startTime: 1 })
            .limit(8);
    }
    if (type == 'all') {
        events = await eventModel.aggregate([
            {
                $match: {
                    status: { $in: ['approved', 'event_over'] }, // Lọc các sự kiện hợp lệ
                },
            },
            {
                $addFields: {
                    sortStatus: {
                        $cond: {
                            if: { $eq: ['$status', 'approved'] },
                            then: 0,
                            else: 1,
                        },
                    },
                },
            },
            {
                $sort: {
                    sortStatus: 1, // 'approved' (0) đứng trước 'event_over' (1)
                    startTime: 1, // Sắp xếp tăng dần theo thời gian bắt đầu
                },
            },
        ]);
    }
    return events;
};

const getAllEvents = async () => {
    const events = await eventModel.aggregate([
        // 🔎 Join với bảng orders để tính tổng doanh thu (totalRevenue)
        {
            $lookup: {
                from: 'orders', // Bảng chứa đơn hàng
                localField: '_id',
                foreignField: 'eventId',
                as: 'orders',
            },
        },
        {
            $addFields: {
                totalRevenue: { $sum: '$orders.totalPrice' }, // Tính tổng totalPrice của các order liên quan
            },
        },

        // 🔎 Join với bảng users để lấy email người tạo event
        {
            $lookup: {
                from: 'users', // Bảng users
                localField: 'userId',
                foreignField: '_id',
                as: 'userData',
            },
        },
        {
            $addFields: {
                userEmail: { $arrayElemAt: ['$userData.email', 0] }, // Lấy email đầu tiên nếu có
            },
        },

        // Ẩn mảng dư thừa sau khi đã lấy xong dữ liệu cần
        {
            $project: {
                orders: 0, // Ẩn danh sách orders
                userData: 0, // Ẩn userData sau khi lấy email
            },
        },

        { $sort: { createdAt: -1 } }, // Sắp xếp theo thời gian tạo
    ]);

    return events;
};

const getEventById = async (id) => {
    const event = await eventModel.findOne({
        _id: id,
    });

    return event;
};

const getMyEvents = async (userId, page, limit, status, query) => {
    try {
        let find = {
            userId: userId,
            status: status,
        };

        if (query) {
            find.name = { $regex: query, $options: 'i' };
        }

        const events = await eventModel
            .find(find)
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(limit);

        if (!events || events.length === 0) {
            return {
                success: false,
                message: 'Không có sự kiện nào!',
            };
        }

        const totalEvents = await eventModel.countDocuments(find);

        return {
            success: true,
            events: events,
            totalEvents: totalEvents,
            totalPages: Math.ceil(totalEvents / limit),
            currentPage: page,
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const getOrdersByEventId = async (eventId, userId) => {
    try {
        const event = await eventModel.findOne({
            _id: eventId,
            userId: userId,
        });

        if (!event) {
            return {
                success: false,
                message: 'Không tìm thấy sự kiện!',
            };
        }

        const orders = await orderModel
            .find({
                eventId: eventId,
            })
            .sort({ createdAt: -1 })
            .lean();

        if (!orders || orders.length === 0) {
            return {
                success: false,
                message: 'Không có đơn hàng nào!',
            };
        }

        await Promise.all(
            orders.map(async (order) => {
                const user = await userService.getUserById(order.userId);
                order.infoUser = user.address;

                const event = await eventModel.findById(order.eventId);
                order.eventName = event.name;

                const tickets = await ticketModel.find({
                    orderId: order._id,
                });
                order.tickets = tickets;
            }),
        );

        return {
            success: true,
            orders,
        };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

const updateFinishedEvents = async () => {
    try {
        const currentTime = new Date();
        await eventModel.updateMany(
            {
                endTime: { $lt: currentTime },
                status: { $ne: 'event_over', $eq: 'approved' },
            },
            { $set: { status: 'event_over' } },
        );
    } catch (error) {
        console.error('Lỗi cập nhật sự kiện đã kết thúc:', error);
    }
};

cron.schedule('*/5 * * * *', () => {
    // console.log('⏳ Kiểm tra sự kiện hết hạn...');
    updateFinishedEvents();
});

const eventSearch = async (query) => {
    try {
        const events = await eventModel
            .find({
                name: { $regex: query, $options: 'i' },
                status: { $nin: ['rejected', 'pending'] },
            })
            .select('_id name background');

        return { success: true, events };
    } catch (error) {
        return { success: false, message: error.message };
    }
};

export default {
    createEvent,
    updateEvent,
    updateStatusEvent,
    getEvents,
    getAllEvents,
    getEventById,
    getMyEvents,
    getOrdersByEventId,
    eventSearch,
};
