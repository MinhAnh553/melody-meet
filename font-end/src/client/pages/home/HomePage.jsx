import React from 'react';
import carousel from '../../../assets/images/carousel.jpg';

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
                            <a className="btn btn-primary btn-lg" href="#">
                                Khám Phá Ngay
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            <section className="events py-4">
                <div className="container">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h2 className="section-title text-white">
                            Sự kiện đặc sắc
                        </h2>
                    </div>
                    <div className="row g-4">
                        <div className="col-md-6 col-lg-4">
                            <div className="event-card">
                                <img
                                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
                                    alt="Concert"
                                />
                                <div className="event-content bg-dark text-white">
                                    <h3>Summer Music Festival</h3>
                                    <p className="date text-white">
                                        <i className="bi bi-calendar3" />
                                        July 15, 2024
                                    </p>
                                    <p className="location text-white">
                                        <i className="bi bi-geo-alt" />
                                        Central Park
                                    </p>
                                    <p
                                        className="price"
                                        style={{ color: 'rgb(45, 194, 117)' }}
                                    >
                                        <i className="bi bi-tag" />
                                        $49 - $149
                                    </p>
                                    <button className="btn btn-primary w-100">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="event-card">
                                <img
                                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
                                    alt="Concert"
                                />
                                <div className="event-content bg-dark text-white">
                                    <h3>Summer Music Festival</h3>
                                    <p className="date text-white">
                                        <i className="bi bi-calendar3" />
                                        July 15, 2024
                                    </p>
                                    <p className="location text-white">
                                        <i className="bi bi-geo-alt" />
                                        Central Park
                                    </p>
                                    <p
                                        className="price"
                                        style={{ color: 'rgb(45, 194, 117)' }}
                                    >
                                        <i className="bi bi-tag" />
                                        $49 - $149
                                    </p>
                                    <button className="btn btn-primary w-100">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4">
                            <div className="event-card">
                                <img
                                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3"
                                    alt="Concert"
                                />
                                <div className="event-content bg-dark text-white">
                                    <h3>Summer Music Festival</h3>
                                    <p className="date text-white">
                                        <i className="bi bi-calendar3" />
                                        July 15, 2024
                                    </p>
                                    <p className="location text-white">
                                        <i className="bi bi-geo-alt" />
                                        Central Park
                                    </p>
                                    <p
                                        className="price"
                                        style={{ color: 'rgb(45, 194, 117)' }}
                                    >
                                        <i className="bi bi-tag" />
                                        $49 - $149
                                    </p>
                                    <button className="btn btn-primary w-100">
                                        Book Now
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </>
    );
};

export default HomePage;
