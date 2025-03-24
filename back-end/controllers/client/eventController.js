import eventService from '../../services/client/eventService.js';
import orderService from '../../services/client/orderService.js';

// [POST] /event/create
const createEvent = async (req, res) => {
    try {
        const data = req.body;
        // Parse lại dữ liệu ticketTypes từ chuỗi JSON
        let ticketTypes = JSON.parse(req.body.ticketTypes);

        // // Gán ảnh vào đúng vé của nó
        // if (req.files['ticketImages']) {
        //     ticketTypes.forEach((ticket, index) => {
        //         ticket.image = req.files['ticketImages'][index]?.path || '';
        //     });
        // }

        const eventData = {
            userId: req.user.id,
            name: data.eventName,
            background: req.files.eventBackground[0].path,
            location: {
                venueName: data.venueName,
                province: data.province,
                district: data.district,
                ward: data.ward,
                address: data.address,
            },
            description: data.description,
            organizer: {
                logo: req.files.organizerLogo[0].path,
                name: data.organizerName,
                info: data.organizerInfo,
            },
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            ticketTypes: ticketTypes,
        };
        const newEvent = await eventService.createEvent(eventData);

        res.status(200).json({
            success: true,
            message: 'Sự kiện đã được tạo thành công!',
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const updateEvent = async (req, res) => {
    try {
        const data = req.body;
        const id = req.params.id;

        // Parse lại dữ liệu ticketTypes từ chuỗi JSON
        let ticketTypes = JSON.parse(req.body.ticketTypes);
        data.ticketTypes = ticketTypes;

        const dataUpdate = {
            name: data.eventName,
            location: {
                venueName: data.venueName,
                province: data.province,
                district: data.district,
                ward: data.ward,
                address: data.address,
            },
            description: data.description,
            organizer: {
                logo: data.organizerLogo || '',
                name: data.organizerName,
                info: data.organizerInfo,
            },
            startTime: new Date(data.startTime),
            endTime: new Date(data.endTime),
            ticketTypes: data.ticketTypes,
        };

        if (req.files.eventBackground && req.files.eventBackground.length > 0) {
            dataUpdate.background = req.files.eventBackground[0].path;
        }
        if (req.files.organizerLogo && req.files.organizerLogo.length > 0) {
            console.log('ua');
            dataUpdate.organizer.logo = req.files.organizerLogo[0].path;
        }

        const result = await eventService.updateEvent(
            id,
            dataUpdate,
            req.user.id,
        );
        if (!result.success) {
            return res.status(404).json(result);
        }

        res.status(200).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getEvents = async (req, res) => {
    try {
        const events = await eventService.getEvents();
        res.status(200).json({
            success: true,
            events,
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getEventById = async (req, res) => {
    try {
        const id = req.params.id;

        const event = await eventService.getEventById(id);
        if (event) {
            return res.status(200).json({
                success: true,
                event,
            });
        }
        return res.status(404).json({
            success: false,
            message: 'Không tìm thấy sự kiện!',
        });
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getMyEvents = async (req, res) => {
    try {
        const userId = req.user.id;
        let {
            page = 1,
            limit = 5,
            status = 'approved',
            isFinished = false,
        } = req.query;
        page = parseInt(page);
        limit = parseInt(limit);

        const result = await eventService.getMyEvents(
            userId,
            page,
            limit,
            status,
            isFinished,
        );
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getOrdersByEventId = async (req, res) => {
    try {
        const id = req.params.id;

        const result = await eventService.getOrdersByEventId(id, req.user.id);
        if (result.success) {
            return res.status(200).json(result);
        }
        return res.status(404).json(result);
    } catch (error) {
        console.log(error);
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

const getEventSummary = async (req, res) => {
    try {
        const { id } = req.params;

        const result = await orderService.getOrdersByEventId(id, req.user.id);

        if (!result.success) {
            return res.status(404).json(result);
        }

        // Lấy thông tin vé từ order và đảm bảo chờ các promise hoàn thành
        await Promise.all(
            result.orders.map(async (order) => {
                let ticket = await orderService.getOrderTickets(order._id);
                order.tickets = ticket.tickets;
            }),
        );

        // Tính toán doanh thu và số vé đã bán
        let totalRevenue = 0;
        let totalSold = 0;
        let ticketDetails = [];
        let revenueByDate = [];

        const event = await eventService.getEventById(id);

        result.orders.forEach((order) => {
            totalRevenue += order.totalPrice;
            totalSold += order.tickets.reduce(
                (total, ticket) => total + ticket.quantity,
                0,
            );

            order.tickets.forEach((ticket) => {
                // cùng name và price thì gom lại thành 1
                let index = ticketDetails.findIndex(
                    (item) =>
                        item.name === ticket.name &&
                        item.price === ticket.price,
                );
                if (index !== -1) {
                    ticketDetails[index].quantity += ticket.quantity;
                    ticketDetails[index].total +=
                        ticket.price * ticket.quantity;
                    return;
                }

                // lấy tổng vé dựa vào name và price từ event
                let eventTicket = event.ticketTypes.find(
                    (item) => item.name === ticket.name,
                );
                if (!eventTicket) return;

                ticketDetails.push({
                    name: ticket.name,
                    totalQuantity: eventTicket.totalQuantity,
                    quantity: ticket.quantity,
                    price: ticket.price,
                    total: ticket.price * ticket.quantity,
                });
            });

            let date = new Date(order.createdAt).toLocaleDateString();
            let revenue = order.totalPrice;

            let index = revenueByDate.findIndex((item) => item.date === date);
            if (index !== -1) {
                revenueByDate[index].revenue += revenue;
            } else {
                revenueByDate.push({ date, revenue });
            }
        });

        res.status(200).json({
            success: true,
            totalRevenue,
            totalSold,
            ticketDetails,
            revenueByDate,
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
    createEvent,
    updateEvent,
    getEvents,
    getEventById,
    getMyEvents,
    getOrdersByEventId,
    getEventSummary,
};
