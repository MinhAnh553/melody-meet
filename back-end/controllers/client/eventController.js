import eventService from '../../services/client/eventService.js';

// [POST] /event/create
const createEvent = async (req, res) => {
    try {
        const data = req.body;
        if (
            !req.files ||
            !req.files.eventLogo ||
            !req.files.eventBackground ||
            !req.files.organizerLogo
        ) {
            return res.status(400).json({
                success: false,
                message: 'Vui lòng tải lên đầy đủ hình ảnh!' || 'Server Error!',
            });
        }
        const eventData = {
            // userId: 'MINHANH',
            name: data.eventName,
            logo: req.files.eventLogo[0].path,
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
        };
        const newEvent = await eventService.createEvent(eventData);

        res.status(200).json({
            success: true,
            message: 'Sự kiện đã được tạo thành công!',
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || 'Server Error!',
        });
    }
};

export default {
    createEvent,
};
