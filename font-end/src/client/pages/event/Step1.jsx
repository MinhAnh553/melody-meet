import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/EventManagement.module.css';
import DescriptionEditor from '../../components/DescriptionEditor';
import AddressSelector from '../../components/AddressSelector';
import UploadImage from '../../components/UploadImage';
import swalCustomize from '../../../util/swalCustomize';
import api from '../../../util/api';

const Step1 = ({ onSuccess, onLoadingChange }) => {
    const [eventName, setEventName] = useState('');
    const [eventLogo, setEventLogo] = useState(null);
    const [eventBackground, setEventBackground] = useState(null);

    const [addressData, setAddressData] = useState({
        venueName: '',
        province: '',
        district: '',
        ward: '',
        address: '',
    });

    const [description, setDescription] = useState('');
    const [organizerLogo, setOrganizerLogo] = useState(null);
    const [organizerName, setOrganizerName] = useState('');
    const [organizerInfo, setOrganizerInfo] = useState('');

    // Callback
    const handleEditorChange = (htmlContent) => {
        setDescription(htmlContent);
    };

    const handleAddressChange = (data) => {
        setAddressData(data);
    };

    const handleLogoSelect = (file, previewUrl) => {
        setEventLogo(file);
    };

    const handleBackgroundSelect = (file, previewUrl) => {
        setEventBackground(file);
    };

    const handleOrganizerSelect = (file, previewUrl) => {
        setOrganizerLogo(file);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!eventName.trim()) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập tên sự kiện',
            });
        }

        if (
            !addressData.venueName ||
            !addressData.province ||
            !addressData.district ||
            !addressData.ward ||
            !addressData.address
        ) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ địa chỉ sự kiện',
            });
        }

        if (!description.trim()) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập thông tin sự kiện',
            });
        }

        if (!organizerName.trim() || !organizerInfo.trim()) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập thông tin ban tổ chức',
            });
        }

        if (!eventLogo || !eventBackground || !organizerLogo) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng tải lên đầy đủ hình ảnh',
            });
        }

        const formData = new FormData();
        formData.append('eventName', eventName);
        formData.append('eventLogo', eventLogo);
        formData.append('eventBackground', eventBackground);
        formData.append('description', description);
        formData.append('province', addressData.province);
        formData.append('venueName', addressData.venueName);
        formData.append('district', addressData.district);
        formData.append('ward', addressData.ward);
        formData.append('address', addressData.address);
        formData.append('organizerLogo', organizerLogo);
        formData.append('organizerName', organizerName);
        formData.append('organizerInfo', organizerInfo);

        try {
            onLoadingChange(true);
            const res = await api.createEvent(formData);
            if (res.success) {
                swalCustomize.Toast.fire({
                    icon: 'success',
                    title: res.message,
                });

                // Gọi callback onSuccess để báo thành công và chuyển sang bước 2
                onSuccess();
            } else {
                return swalCustomize.Toast.fire({
                    icon: 'error',
                    title: res.message,
                });
            }
        } catch (error) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Đã xảy ra lỗi. Vui lòng thử lại sau.',
            });
        } finally {
            onLoadingChange(false);
        }
    };

    return (
        <form
            className={styles.form}
            id="eventForm"
            onSubmit={handleSubmit}
            encType="multipart/form-data"
        >
            <div className="card-dark">
                <h6 className={`${styles.formTitle} form-item-required`}>
                    Upload hình ảnh
                </h6>
                <div className="row">
                    <div className="col-md-3">
                        <UploadImage
                            id="uploadLogo"
                            iconClass="fas fa-upload fa-2x text-success"
                            defaultText="Thêm ảnh logo sự kiện"
                            inputName="eventLogo"
                            onFileSelect={handleLogoSelect}
                        />
                    </div>
                    <div className="col-md-9">
                        <UploadImage
                            id="uploadBackground"
                            iconClass="fas fa-upload fa-2x text-success"
                            defaultText="Thêm ảnh nền sự kiện"
                            inputName="eventBackground"
                            onFileSelect={handleBackgroundSelect}
                        />
                    </div>
                </div>
                <div className="mt-3 col-md-12 mb-3">
                    <label
                        className={`${styles.formTitle} form-label form-item-required`}
                        htmlFor="eventName"
                    >
                        Tên sự kiện
                    </label>
                    <input
                        className="form-control"
                        type="text"
                        id="eventName"
                        name="eventName"
                        placeholder="Tên sự kiện"
                        maxLength={100}
                        value={eventName}
                        onChange={(e) => setEventName(e.target.value)}
                    />
                </div>
            </div>
            <div className="card-dark mt-4">
                <h6 className={`${styles.formTitle} form-item-required`}>
                    Địa chỉ sự kiện
                </h6>
                <AddressSelector onAddressChange={handleAddressChange} />
            </div>
            <div className="card-dark mt-4">
                <label
                    className={`${styles.formTitle} form-label form-item-required`}
                >
                    Thông tin sự kiện
                </label>
                <DescriptionEditor
                    initialValue="<p><strong>Giới thiệu sự kiện:</strong></p><p>[T&oacute;m tắt ngắn gọn về sự kiện: Nội dung ch&iacute;nh của sự kiện, điểm đặc sắc nhất v&agrave; l&yacute; do khiến người tham gia kh&ocirc;ng n&ecirc;n bỏ lỡ]</p><p><strong>Chi tiết sự kiện:</strong></p><ul><li><strong>Chương tr&igrave;nh ch&iacute;nh:</strong>[Liệt k&ecirc; những hoạt động nổi bật trong sự kiện: c&aacute;c phần tr&igrave;nh diễn, kh&aacute;ch mời đặc biệt, lịch tr&igrave;nh c&aacute;c tiết mục cụ thể nếu c&oacute;.]</li><li><strong>Kh&aacute;ch mời:</strong>[Th&ocirc;ng tin về c&aacute;c kh&aacute;ch mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện. C&oacute; thể bao gồm phần m&ocirc; tả ngắn gọn về họ v&agrave; những g&igrave; họ sẽ mang lại cho sự kiện.]</li><li><strong>Trải nghiệm đặc biệt:</strong>[Nếu c&oacute; c&aacute;c hoạt động đặc biệt kh&aacute;c như workshop, khu trải nghiệm, photo booth, khu vực check-in hay c&aacute;c phần qu&agrave;/ưu đ&atilde;i d&agrave;nh ri&ecirc;ng cho người tham dự.]</li></ul><p><strong>Điều khoản v&agrave; điều kiện:</strong></p><p>[TnC] sự kiện</p><p>Lưu &yacute; về điều khoản trẻ em</p><p>Lưu &yacute; về điều khoản VAT</p>"
                    onEditorChange={handleEditorChange}
                />
            </div>
            <div className="card-dark mt-4 mb-5">
                <div className="row">
                    <div className="col-md-2">
                        <UploadImage
                            id="uploadOrganizer"
                            iconClass="fas fa-upload fa-2x text-success"
                            defaultText="Thêm logo ban tổ chức"
                            inputName="organizerLogo"
                            onFileSelect={handleOrganizerSelect}
                        />
                    </div>
                    <div className="col-md-10">
                        <div className="mb-3">
                            <label
                                className={`${styles.formTitle} form-label form-item-required`}
                                htmlFor="eventName"
                            >
                                Tên ban tổ chức
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="organizerName"
                                id="eventName"
                                placeholder="Tên ban tổ chức"
                                maxLength={100}
                                value={organizerName}
                                onChange={(e) =>
                                    setOrganizerName(e.target.value)
                                }
                            />
                        </div>
                        <div className="mb-3">
                            <label
                                className={`${styles.formTitle} form-label form-item-required`}
                                htmlFor="eventName"
                            >
                                Thông tin ban tổ chức
                            </label>
                            <input
                                className="form-control"
                                type="text"
                                name="organizerInfo"
                                id="eventName"
                                placeholder="Thông tin ban tổ chức"
                                value={organizerInfo}
                                onChange={(e) =>
                                    setOrganizerInfo(e.target.value)
                                }
                            />
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
};

export default Step1;
