import React, { createContext, useReducer, useContext } from 'react';

const FormContext = createContext();

const initialState = {
    step1: {
        eventName: '',
        eventLogo: null,
        eventBackground: null,
        description: '',
        province: '',
        venueName: '',
        district: '',
        ward: '',
        address: '',
        organizerLogo: null,
        organizerName: '',
        organizerInfo: '',
    },
    step2: {
        // Dữ liệu cho bước 2 (ví dụ: thời gian & loại vé)
    },
    step3: {
        // Dữ liệu cho bước 3 (ví dụ: cài đặt)
    },
    step4: {
        // Dữ liệu cho bước 4 (ví dụ: thông tin thanh toán)
    },
};

const formReducer = (state, action) => {
    switch (action.type) {
        case 'UPDATE_STEP1':
            return { ...state, step1: { ...state.step1, ...action.payload } };
        // Thêm các action cho step2, step3, step4 nếu cần
        default:
            return state;
    }
};

export const FormProvider = ({ children }) => {
    const [state, dispatch] = useReducer(formReducer, initialState);

    return (
        <FormContext.Provider value={{ formData: state, dispatch }}>
            {children}
        </FormContext.Provider>
    );
};

export const useFormData = () => useContext(FormContext);
