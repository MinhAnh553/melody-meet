import React from 'react';
import { Oval } from 'react-loader-spinner';

const LoadingSpinner = () => {
    return (
        <div
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                // backgroundColor: 'rgba(255, 255, 255, 0.8)', // Optional: background mờ
                zIndex: 9999,
            }}
        >
            <Oval
                height={80}
                width={80}
                color="#2c44a7"
                secondaryColor="#4fa94d"
                strokeWidth={2}
                strokeWidthSecondary={2}
                visible={true}
                ariaLabel="oval-loading"
            />
        </div>
    );
};

export default LoadingSpinner;
