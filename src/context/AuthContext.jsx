import React, { createContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('tl_token') || null);
    const [isLoading, setIsLoading] = useState(true);

    const isAuthenticated = !!token;

    useEffect(() => {
        const initAuth = async () => {
            if (token) {
                try {
                    const payload = JSON.parse(atob(token.split('.')[1]));
                    if (payload.exp * 1000 < Date.now()) {
                        logout();
                    } else {
                        const userData = await authAPI.me();
                        setUser(userData);
                    }
                } catch (e) {
                    logout();
                }
            }
            setIsLoading(false);
        };
        initAuth();
    }, [token]);

    const login = async (email, password) => {
        const res = await authAPI.login(email, password);
        setToken(res.token);
        localStorage.setItem('tl_token', res.token);
        setUser(res.user);
        return res;
    };

    const register = async (name, email, password) => {
        const res = await authAPI.register(name, email, password);
        setToken(res.token);
        localStorage.setItem('tl_token', res.token);
        setUser(res.user);
        return res;
    };

    const logout = () => {
        setToken(null);
        setUser(null);
        localStorage.removeItem('tl_token');
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout, register, isAuthenticated, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
