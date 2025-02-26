import React, { useEffect, useState } from 'react';
import provincesData from '../../util/provinces.json';
import styles from '../styles/EventManagement.module.css';

const AddressSelector = ({ onAddressChange }) => {
    // State lưu danh sách các tỉnh, quận, phường
    const [provinces, setProvinces] = useState([]);

    const [venueName, setVenueName] = useState('');
    // Lưu mã của các mục được chọn (để so sánh, nếu JSON dùng kiểu số)
    const [selectedProvinceCode, setSelectedProvinceCode] = useState(null);
    const [selectedDistrictCode, setSelectedDistrictCode] = useState(null);
    const [selectedWardCode, setSelectedWardCode] = useState(null);

    const [address, setAddress] = useState('');

    // Khi component mount, gán data từ JSON cho state provinces
    useEffect(() => {
        setProvinces(provincesData);
    }, []);

    // Khi tỉnh được chọn, chuyển đổi giá trị thành số (nếu JSON dùng kiểu số)
    const handleProvinceChange = (e) => {
        const code = e.target.value ? Number(e.target.value) : null;
        setSelectedProvinceCode(code);
        // Reset quận và phường khi tỉnh thay đổi
        setSelectedDistrictCode(null);
        setSelectedWardCode(null);
    };

    const handleDistrictChange = (e) => {
        const code = e.target.value ? Number(e.target.value) : null;
        setSelectedDistrictCode(code);
        // Reset phường khi quận thay đổi
        setSelectedWardCode(null);
    };

    const handleWardChange = (e) => {
        const code = e.target.value ? Number(e.target.value) : null;
        setSelectedWardCode(code);
    };

    const handleAddressChange = (data) => {
        setAddress(data);
    };

    const handleVenueNameChange = (data) => {
        setVenueName(data);
    };

    // Lấy danh sách quận dựa trên tỉnh được chọn
    const getDistricts = () => {
        const province = provinces.find((p) => p.code === selectedProvinceCode);
        return province ? province.districts : [];
    };

    // Lấy danh sách phường dựa trên quận được chọn
    const getWards = () => {
        const province = provinces.find((p) => p.code === selectedProvinceCode);
        if (province) {
            const district = province.districts.find(
                (d) => d.code === selectedDistrictCode,
            );
            return district ? district.wards : [];
        }
        return [];
    };

    // Khi có sự thay đổi ở bất kỳ giá trị nào, gọi callback onAddressChange (nếu có)
    useEffect(() => {
        if (onAddressChange) {
            const province = provinces.find(
                (p) => p.code === selectedProvinceCode,
            );
            const district = province
                ? province.districts.find(
                      (d) => d.code === selectedDistrictCode,
                  )
                : null;
            const ward = district
                ? district.wards.find((w) => w.code === selectedWardCode)
                : null;

            onAddressChange({
                venueName: venueName || '',
                province: province ? province.name : '',
                district: district ? district.name : '',
                ward: ward ? ward.name : '',
                address: address || '',
            });
        }
    }, [
        venueName,
        selectedProvinceCode,
        selectedDistrictCode,
        selectedWardCode,
        provinces,
        address,
    ]);

    return (
        <div className="row mt-3">
            <div className="col-md-6 mb-3">
                <label
                    className={`${styles.formTitle} form-label form-item-required`}
                >
                    Tên địa điểm
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="venueName"
                    placeholder="Tên địa điểm"
                    value={venueName}
                    onChange={(e) => handleVenueNameChange(e.target.value)}
                />
            </div>

            <div className="col-md-6 mb-3">
                <label
                    className={`${styles.formTitle} form-label form-item-required`}
                    htmlFor="province"
                >
                    Chọn tỉnh/thành
                </label>
                <select
                    id="province"
                    name="province"
                    className={`${styles.formSelect} form-select`}
                    value={selectedProvinceCode || ''}
                    onChange={handleProvinceChange}
                >
                    <option value="">Chọn tỉnh/thành</option>
                    {provinces.map((province) => (
                        <option key={province.code} value={province.code}>
                            {province.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-6 mb-3">
                <label
                    className={`${styles.formTitle} form-label form-item-required`}
                    htmlFor="district"
                >
                    Chọn quận/huyện
                </label>
                <select
                    id="district"
                    name="district"
                    className={`${styles.formSelect} form-select`}
                    value={selectedDistrictCode || ''}
                    onChange={handleDistrictChange}
                >
                    <option value="">Chọn quận/huyện</option>
                    {getDistricts().map((district) => (
                        <option key={district.code} value={district.code}>
                            {district.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-6 mb-3">
                <label
                    className={`${styles.formTitle} form-label form-item-required`}
                    htmlFor="ward"
                >
                    Chọn phường/xã
                </label>
                <select
                    id="ward"
                    name="ward"
                    className={`${styles.formSelect} form-select`}
                    value={selectedWardCode || ''}
                    onChange={handleWardChange}
                >
                    <option value="">Chọn phường/xã</option>
                    {getWards().map((ward) => (
                        <option key={ward.code} value={ward.code}>
                            {ward.name}
                        </option>
                    ))}
                </select>
            </div>

            <div className="col-md-12 mb-3">
                <label
                    className={`${styles.formTitle} form-label form-item-required`}
                >
                    Số nhà, đường
                </label>
                <input
                    className="form-control"
                    type="text"
                    name="address"
                    placeholder="Số nhà, đường"
                    value={address}
                    onChange={(e) => handleAddressChange(e.target.value)}
                />
            </div>
        </div>
    );
};

export default AddressSelector;
