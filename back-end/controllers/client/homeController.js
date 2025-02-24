// [GET] /
const homePage = async (req, res) => {
    try {
        res.render('client/pages/home/index', {
            pageTitle: 'Trang chủ',
        });
    } catch (error) {
        res.status(500).send('Server Error');
    }
};

export default {
    homePage,
};
