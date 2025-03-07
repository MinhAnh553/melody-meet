import React from 'react';
import carousel from '../../../assets/images/carousel.jpg';
import EventList from '../../components/EventList';

const HomePage = () => {
    return (
        <>
            <div
                className="carousel slide"
                id="heroCarousel"
                data-bs-ride="carousel"
            >
                <div className="carousel-inner">
                    <div className="carousel-item active">
                        <img
                            className="d-block w-100"
                            src={carousel}
                            alt="Carousel"
                        />
                        <div className="carousel-caption">
                            <h1>Khám Phá Những Sự Kiện Âm Nhạc Tuyệt Vời</h1>
                            <p>Đặt vé cho những sự kiện tuyệt vời nhất</p>
                            <a
                                className="btn btn-primary btn-lg"
                                href="#specialEvent"
                            >
                                Khám Phá Ngay
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <section className="events py-4" id="specialEvent">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title text-white">
                            Sự kiện đặc sắc
                        </h2>
                    </div>
                    <EventList />
                </div>
            </section>
        </>
    );
};

export default HomePage;
