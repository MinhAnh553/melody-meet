import React, { createContext, useState, useEffect, useContext } from 'react';

import swalCustomize from '../../util/swalCustomize';
import api from '../../util/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await api.getAccount();
                if (res.success) {
                    setAuth({
                        isAuthenticated: true,
                        user: {
                            id: res.user._id,
                            name: res.user.name,
                            phone: res.user.phone,
                            email: res.user.email,
                            role: res.user.role,
                            address: res.user.address,
                        },
                    });
                } else {
                    setAuth({
                        isAuthenticated: false,
                        user: null,
                    });
                }
            } catch (error) {
                console.error(error);
                setAuth({
                    isAuthenticated: false,
                    user: null,
                });
            } finally {
                setTimeout(() => {
                    setLoading(false);
                }, 300);
            }
        };

        fetchUser();
    }, []);

    const login = async (email, password) => {
        try {
            setLoading(true);
            const res = await api.login(email, password);
            if (res.success) {
                localStorage.setItem('access_token', res.access_token);

                setAuth({
                    isAuthenticated: true,
                    user: {
                        id: res.user.id,
                        name: res.user.name,
                        phone: res.user.phone,
                        email: res.user.email,
                        address: res.user.address,
                        role: res.user.role,
                    },
                });

                const closeBtn = document.querySelector(
                    '.btn-close.form-login[data-bs-dismiss="modal"]',
                );
                if (closeBtn) {
                    closeBtn.click();
                }
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
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
                backdrop.parentNode.removeChild(backdrop);
            }
            document.body.classList.remove('modal-open');
            document.body.style = '';

            setLoading(false);
        }
    };

    const logout = () => {
        setLoading(true);
        localStorage.removeItem('access_token');
        setAuth({
            isAuthenticated: false,
            user: null,
        });

        setTimeout(() => {
            setLoading(false);
        }, 500);
    };

    return (
        <AuthContext.Provider
            value={{ auth, setAuth, loading, setLoading, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
export default AuthContext;
