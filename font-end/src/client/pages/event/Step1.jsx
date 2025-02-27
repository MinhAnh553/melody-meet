import React, { useRef, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import styles from '../../styles/EventManagement.module.css';
import DescriptionEditor from '../../components/DescriptionEditor';
import AddressSelector from '../../components/AddressSelector';
import UploadImage from '../../components/UploadImage';
import swalCustomize from '../../../util/swalCustomize';
import api from '../../../util/api';

const Step1 = ({ onSuccess, onLoadingChange, data, updateData }) => {
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!data.eventName.trim()) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập tên sự kiện',
            });
        }

        if (
            !data.addressData.venueName ||
            !data.addressData.province ||
            !data.addressData.district ||
            !data.addressData.ward ||
            !data.addressData.address
        ) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập đầy đủ địa chỉ sự kiện',
            });
        }

        if (!data.description.trim()) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập thông tin sự kiện',
            });
        }

        if (!data.organizerName.trim() || !data.organizerInfo.trim()) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng nhập thông tin ban tổ chức',
            });
        }

        if (!data.eventLogo || !data.eventBackground || !data.organizerLogo) {
            return swalCustomize.Toast.fire({
                icon: 'error',
                title: 'Vui lòng tải lên đầy đủ hình ảnh',
            });
        }

        swalCustomize.Toast.fire({
            icon: 'success',
            title: 'Lưu thông tin sự kiện thành công',
        });
        onSuccess();
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
                            defaultText="Tải lên logo sự kiện"
                            inputName="eventLogo"
                            defaultPreview={data.eventLogoPreview}
                            onFileSelect={(file, previewUrl) =>
                                updateData({
                                    eventLogo: file,
                                    eventLogoPreview: previewUrl,
                                })
                            }
                        />
                    </div>
                    <div className="col-md-9">
                        <UploadImage
                            id="uploadBackground"
                            iconClass="fas fa-upload fa-2x text-success"
                            defaultText="Thêm ảnh nền sự kiện"
                            inputName="eventBackground"
                            defaultPreview={data.eventBackgroundPreview}
                            onFileSelect={(file, previewUrl) =>
                                updateData({
                                    eventBackground: file,
                                    eventBackgroundPreview: previewUrl,
                                })
                            }
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
                        value={data.eventName}
                        onChange={(e) =>
                            updateData({ eventName: e.target.value })
                        }
                    />
                </div>
            </div>
            <div className="card-dark mt-4">
                <h6 className={`${styles.formTitle} form-item-required`}>
                    Địa chỉ sự kiện
                </h6>
                <AddressSelector
                    onAddressChange={(addr) =>
                        updateData({ addressData: addr })
                    }
                    initialAddress={data.addressData}
                />
            </div>
            <div className="card-dark mt-4">
                <label
                    className={`${styles.formTitle} form-label form-item-required`}
                >
                    Thông tin sự kiện
                </label>
                <DescriptionEditor
                    initialValue={
                        data.description ||
                        '<p><strong>Giới thiệu sự kiện:</strong></p><p>[T&oacute;m tắt ngắn gọn về sự kiện: Nội dung ch&iacute;nh của sự kiện, điểm đặc sắc nhất v&agrave; l&yacute; do khiến người tham gia kh&ocirc;ng n&ecirc;n bỏ lỡ]</p><p><strong>Chi tiết sự kiện:</strong></p><ul><li><strong>Chương tr&igrave;nh ch&iacute;nh:</strong>[Liệt k&ecirc; những hoạt động nổi bật trong sự kiện: c&aacute;c phần tr&igrave;nh diễn, kh&aacute;ch mời đặc biệt, lịch tr&igrave;nh c&aacute;c tiết mục cụ thể nếu c&oacute;.]</li><li><strong>Kh&aacute;ch mời:</strong>[Th&ocirc;ng tin về c&aacute;c kh&aacute;ch mời đặc biệt, nghệ sĩ, diễn giả sẽ tham gia sự kiện. C&oacute; thể bao gồm phần m&ocirc; tả ngắn gọn về họ v&agrave; những g&igrave; họ sẽ mang lại cho sự kiện.]</li><li><strong>Trải nghiệm đặc biệt:</strong>[Nếu c&oacute; c&aacute;c hoạt động đặc biệt kh&aacute;c như workshop, khu trải nghiệm, photo booth, khu vực check-in hay c&aacute;c phần qu&agrave;/ưu đ&atilde;i d&agrave;nh ri&ecirc;ng cho người tham dự.]</li></ul><p><strong>Điều khoản v&agrave; điều kiện:</strong></p><p>[TnC] sự kiện</p><p>Lưu &yacute; về điều khoản trẻ em</p><p>Lưu &yacute; về điều khoản VAT</p>'
                    }
                    onEditorChange={(newContent) =>
                        updateData({ description: newContent })
                    }
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
                            defaultPreview={data.organizerLogoPreview}
                            onFileSelect={(file, previewUrl) =>
                                updateData({
                                    organizerLogo: file,
                                    organizerLogoPreview: previewUrl,
                                })
                            }
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
                                value={data.organizerName}
                                onChange={(e) =>
                                    updateData({
                                        organizerName: e.target.value,
                                    })
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
                                value={data.organizerInfo}
                                onChange={(e) =>
                                    updateData({
                                        organizerInfo: e.target.value,
                                    })
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
