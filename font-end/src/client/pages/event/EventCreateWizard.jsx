// import React, { useState } from 'react';
// import { AnimatePresence, motion } from 'framer-motion';
// import Step1 from './Step1';
// import Step2 from './Step2';
// import HeaderEvent from '../../components/HeaderEvent';

// const EventCreateWizard = () => {
//     const [step, setStep] = useState(1);
//     const [stepLoading, setStepLoading] = useState(false);

//     // Callback được truyền cho Step1, sẽ được gọi khi bước 1 hoàn thành
//     const handleStep1Success = () => {
//         setStep(2);
//     };

//     // Callback từ Step1 để cập nhật loading (nếu muốn quản lý state loading từ cha)
//     const handleLoadingChange = (isLoading) => {
//         setStepLoading(isLoading);
//     };

//     // Định nghĩa các biến animation cho Step1 và Step2
//     const variantsStep1 = {
//         initial: { x: 100, opacity: 0 },
//         animate: { x: 0, opacity: 1 },
//         exit: { x: -100, opacity: 0 },
//     };

//     const variantsStep2 = {
//         initial: { x: 100, opacity: 0 },
//         animate: { x: 0, opacity: 1 },
//         exit: { x: -100, opacity: 0 },
//     };

//     return (
//         <div style={{ position: 'relative' }}>
//             <HeaderEvent
//                 loading={stepLoading}
//                 currentStep={step}
//                 onStepClick={setStep}
//             />
//             <AnimatePresence mode="wait">
//                 {step === 1 && (
//                     <motion.div
//                         key="step1"
//                         variants={variantsStep1}
//                         initial="initial"
//                         animate="animate"
//                         exit="exit"
//                         transition={{ duration: 0.5 }}
//                     >
//                         <Step1
//                             onSuccess={handleStep1Success}
//                             onLoadingChange={handleLoadingChange}
//                         />
//                     </motion.div>
//                 )}
//                 {step === 2 && (
//                     <motion.div
//                         key="step2"
//                         variants={variantsStep2}
//                         initial="initial"
//                         animate="animate"
//                         exit="exit"
//                         transition={{ duration: 1 }}
//                     >
//                         <Step2 />
//                     </motion.div>
//                 )}
//             </AnimatePresence>

//             {stepLoading && (
//                 <div
//                     style={{
//                         position: 'absolute',
//                         top: 0,
//                         left: 0,
//                         right: 0,
//                         bottom: 0,
//                         zIndex: 10000,
//                         // Bạn có thể điều chỉnh backgroundColor, ví dụ nền mờ nhẹ:
//                         backgroundColor: 'rgba(255, 255, 255, 0.3)',
//                     }}
//                 />
//             )}
//         </div>
//     );
// };

// EventForm.js
import React, { useState } from 'react';
import { EventFormProvider } from '../../context/EventFormContext';
import Step1 from './Step1';
import Step2 from './Step2';
import { AnimatePresence, motion } from 'framer-motion';
import HeaderEvent from '../../components/HeaderEvent';
// import các bước Step3, Step4 nếu có

const EventForm = () => {
    const [step, setStep] = useState(1);

    const [stepLoading, setStepLoading] = useState(false);

    const [formData, setFormData] = useState({
        eventName: '',
        eventLogo: null,
        eventLogoPreview: '',
        eventBackground: null,
        eventBackgroundPreview: null,
        addressData: '',
        description: '',
        organizerLogo: null,
        organizerLogoPreview: '',
        organizerName: '',
        organizerInfo: '',
        startTime: '',
        endTime: '',
        ticketTypes: [],
    });

    const handleStep1Success = () => {
        setStep(2);
    };

    // Hàm cập nhật dữ liệu form
    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    // Định nghĩa các biến animation cho Step1 và Step2
    const variantsStep1 = {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 },
    };

    const variantsStep2 = {
        initial: { x: 100, opacity: 0 },
        animate: { x: 0, opacity: 1 },
        exit: { x: -100, opacity: 0 },
    };

    return (
        <div style={{ position: 'relative' }}>
            <HeaderEvent
                loading={stepLoading}
                currentStep={step}
                onStepClick={setStep}
            />
            <EventFormProvider>
                <AnimatePresence mode="wait">
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            variants={variantsStep1}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 0.5 }}
                        >
                            <Step1
                                onSuccess={handleStep1Success}
                                onLoadingChange={setStepLoading}
                                data={formData}
                                updateData={updateFormData}
                            />
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={variantsStep2}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 1 }}
                        >
                            <Step2
                                onLoadingChange={setStepLoading}
                                data={formData}
                                updateData={updateFormData}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>

                {stepLoading && (
                    <div
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            zIndex: 10000,
                            // Bạn có thể điều chỉnh backgroundColor, ví dụ nền mờ nhẹ:
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        }}
                    />
                )}
            </EventFormProvider>
        </div>
    );
};

export default EventForm;
