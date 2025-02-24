import eventService from '../../services/client/eventService.js';

// [GET] /event/create
const showCreateForm = async (req, res) => {
    try {
        res.render('client/pages/event/create', {
            pageTitle: 'Tạo sự kiện',
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

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
            return res
                .status(400)
                .json({ error: 'Vui lòng tải lên đầy đủ hình ảnh!' });
        }
        const eventData = {
            userId: req.session.user._id,
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
        res.json({
            message: 'Sự kiện đã được tạo thành công!',
            event: newEvent,
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

export default {
    showCreateForm,
    createEvent,
};
