import React from 'react';
import {
    createBrowserRouter,
    useLocation,
    Routes,
    Route,
} from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

import ClientLayout from '../client/layout/ClientLayout.jsx';
import HomePage from '../client/pages/home/HomePage.jsx';
import EventManagementLayout from '../client/layout/EventManagementLayout.jsx';
import ProtectedRoute from '../client/components/ProtectedRoute';
import EventCreateWizard from '../client/pages/event/EventCreateWizard.jsx';
import EventDetail from '../client/pages/event/EventDetail.jsx';
import PaymentSuccess from '../client/pages/payment/PaymentSuccess.jsx';
import OrderPage from '../client/pages/payment/OrderPage.jsx';
import PurchasedTickets from '../client/pages/PurchasedTickets.jsx';
import EventManagement from '../client/pages/event/EventManagement.jsx';
import OrderList from '../client/pages/event/OrderList.jsx';

const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
};

const AnimatedRoutes = () => {
    const location = useLocation();

    return (
        <AnimatePresence mode="wait">
            <Routes location={location} key={location.pathname}>
                <Route path="/" element={<ClientLayout />}>
                    <Route
                        index
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5 }}
                            >
                                <HomePage />
                            </motion.div>
                        }
                    />
                    <Route
                        path="my-tickets"
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5 }}
                            >
                                <PurchasedTickets />
                            </motion.div>
                        }
                    />
                </Route>
                <Route path="event" element={<ProtectedRoute />}>
                    <Route element={<EventManagementLayout />}>
                        <Route
                            index
                            element={
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5 }}
                                >
                                    <EventManagement />
                                </motion.div>
                            }
                        />
                        <Route
                            path="create"
                            element={
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5 }}
                                >
                                    <EventCreateWizard />
                                </motion.div>
                            }
                        />
                        <Route
                            path=":eventId/edit"
                            element={
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5 }}
                                >
                                    <EventCreateWizard />
                                </motion.div>
                            }
                        />
                        <Route
                            path=":eventId/orders"
                            element={
                                <motion.div
                                    variants={pageVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                    transition={{ duration: 0.5 }}
                                >
                                    <OrderList />
                                </motion.div>
                            }
                        />
                    </Route>
                </Route>
                <Route path="/event/:eventId" element={<ClientLayout />}>
                    <Route
                        index
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5 }}
                            >
                                <EventDetail />
                            </motion.div>
                        }
                    />
                </Route>
                <Route path="/order">
                    <Route
                        path="payment-success"
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5 }}
                            >
                                <PaymentSuccess />
                            </motion.div>
                        }
                    />
                    <Route
                        path=":orderId"
                        element={
                            <motion.div
                                variants={pageVariants}
                                initial="initial"
                                animate="animate"
                                exit="exit"
                                transition={{ duration: 0.5 }}
                            >
                                <OrderPage />
                            </motion.div>
                        }
                    />
                </Route>
            </Routes>
        </AnimatePresence>
    );
};

export default AnimatedRoutes;
