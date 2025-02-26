// src/components/UploadImage.jsx
import React, { useRef, useState, useEffect } from 'react';
import styles from '../styles/EventManagement.module.css';

const UploadImage = ({
    id, // id của container, ví dụ "uploadBackground" hoặc "uploadOrganizer"
    iconClass, // class của icon, ví dụ "fas fa-upload fa-2x text-success"
    defaultText, // văn bản mặc định hiển thị khi chưa chọn ảnh
    inputName, // tên của file input, ví dụ "eventBackground" hoặc "organizerLogo"
    onFileSelect, // callback nhận file được chọn
}) => {
    const fileInputRef = useRef(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const handleBoxClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const imageUrl = URL.createObjectURL(file);
            setPreviewUrl(imageUrl);
            if (onFileSelect) {
                onFileSelect(file, imageUrl);
            }
        }
    };

    // Cleanup để giải phóng bộ nhớ khi component unmount hoặc khi previewUrl thay đổi
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    return (
        <div id={id} className="upload-box" onClick={handleBoxClick}>
            {previewUrl ? (
                <img
                    id={`preview-${id}`}
                    src={previewUrl}
                    alt="Preview"
                    style={{
                        display: 'block',
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: 5,
                    }}
                />
            ) : (
                <>
                    <i id={`icon-${id}`} className={iconClass} />
                    <p id={`text-${id}`} className={`${styles.formTitle} mt-1`}>
                        {defaultText}
                    </p>
                </>
            )}
            <input
                type="file"
                name={inputName}
                id={`input-${id}`}
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: 'none' }}
            />
        </div>
    );
};

export default UploadImage;
