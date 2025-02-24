import React from 'react';
import logo from '../../assets/images/logo.png';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer className="footer py-5">
            <div className="container">
                <div className="row gy-4">
                    <div className="col-lg-4">
                        <h4 className="text-white">
                            <Link to="/">
                                MelodyMeet
                                <img src={logo} alt="Logo" height={30} />
                            </Link>
                        </h4>
                        <p>
                            Nền tảng đáng tin cậy của bạn để khám phá và đặt chỗ
                            cho những sự kiện âm nhạc tuyệt vời.
                        </p>
                    </div>
                    <div className="col-lg-4">
                        <h4>Quick Links</h4>
                        <ul className="list-unstyled">
                            <li>
                                <a href="#">About Us</a>
                            </li>
                            <li>
                                <a href="#">Contact</a>
                            </li>
                            <li>
                                <a href="#">Terms &amp; Conditions</a>
                            </li>
                            <li>
                                <a href="#">Privacy Policy</a>
                            </li>
                        </ul>
                    </div>
                    <div className="col-lg-4">
                        <h4>Newsletter</h4>
                        <form className="newsletter-form">
                            <div className="input-group">
                                <input
                                    className="form-control"
                                    type="email"
                                    placeholder="Enter your email"
                                />
                                <button className="btn btn-primary">
                                    Subscribe
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
