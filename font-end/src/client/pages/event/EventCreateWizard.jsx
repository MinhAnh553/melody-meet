import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { EventFormProvider } from '../../context/EventFormContext';
import Step1 from './Step1';
import Step2 from './Step2';
import { AnimatePresence, motion } from 'framer-motion';
import HeaderEvent from '../../components/HeaderEvent';
import api from '../../../util/api';
import swalCustomize from '../../../util/swalCustomize';

const EventForm = () => {
    const { eventId } = useParams(); // Lấy eventId từ URL
    const isEditMode = Boolean(eventId); // Kiểm tra xem có đang chỉnh sửa không

    const [step, setStep] = useState(1);
    const [stepLoading, setStepLoading] = useState(false);
    const [formData, setFormData] = useState({
        eventName: '',
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

    useEffect(() => {
        window.scrollTo(0, 0);

        // Nếu là chỉnh sửa, fetch dữ liệu sự kiện
        if (isEditMode) {
            fetchEventData();
        }
    }, []);

    const fetchEventData = async () => {
        try {
            setStepLoading(true);
            const response = await api.getEventById(eventId); // API lấy dữ liệu sự kiện
            if (response.success) {
                const eventData = response.event;

                // Cập nhật dữ liệu vào form
                setFormData({
                    eventName: eventData.name || '',
                    eventBackground: null,
                    eventBackgroundPreview: eventData.background || null,
                    addressData: eventData.location || '',
                    description: eventData.description || '',
                    organizerLogo: null,
                    organizerLogoPreview: eventData.organizer.logo || '',
                    organizerName: eventData.organizer.name || '',
                    organizerInfo: eventData.organizer.info || '',
                    startTime: eventData.startTime || '',
                    endTime: eventData.endTime || '',
                    ticketTypes: eventData.ticketTypes || [],
                });

                setStepLoading(false);
            } else {
                return swalCustomize.Toast('error', 'Lỗi', response.message);
            }
        } catch (error) {
            console.error('Lỗi khi tải dữ liệu sự kiện:', error);
            setStepLoading(false);
        }
    };

    const handleStep1Success = () => {
        setStep(2);
    };

    const updateFormData = (newData) => {
        setFormData((prev) => ({ ...prev, ...newData }));
    };

    // Animation cho các bước
    const variants = {
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
                            variants={variants}
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
                                isEditMode={isEditMode}
                            />
                        </motion.div>
                    )}
                    {step === 2 && (
                        <motion.div
                            key="step2"
                            variants={variants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            transition={{ duration: 1 }}
                        >
                            <Step2
                                onLoadingChange={setStepLoading}
                                data={formData}
                                updateData={updateFormData}
                                isEditMode={isEditMode}
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
                            backgroundColor: 'rgba(255, 255, 255, 0.3)',
                        }}
                    />
                )}
            </EventFormProvider>
        </div>
    );
};

export default EventForm;
