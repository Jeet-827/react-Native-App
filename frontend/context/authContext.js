import { createContext, useState, useEffect } from "react";
import * as SecureStorage from 'expo-secure-store';

export const usercontext = createContext();

export const UserProvider = ({ children }) => {
    const [accessToken, setaccessToken] = useState(null);
    const [user, setUser] = useState(null);
    const [product, setProduct] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadToken = async () => {
            try {
                let token = null;
                if (Platform.OS === 'web') {
                    token = localStorage.getItem('accesstoken');
                } else {
                    token = await SecureStorage.getItemAsync('accesstoken');
                }
                
                if (token) {
                    setaccessToken(token);
                }
            } catch (e) {
                console.log(e);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const login = async (token, userData) => {
        setaccessToken(token);
        setUser(userData);
        try {
            if (Platform.OS === 'web') {
                localStorage.setItem('accesstoken', token);
            } else {
                await SecureStorage.setItemAsync('accesstoken', token);
            }
        } catch (e) {
            console.log("Error saving token:", e);
        }
    };

    // Call this to log out
    const logout = async () => {
        setaccessToken(null);
        setUser(null);
        setProduct([]);
        try {
            if (Platform.OS === 'web') {
                localStorage.removeItem('accesstoken');
            } else {
                await SecureStorage.deleteItemAsync('accesstoken');
            }
        } catch (e) {
            console.log("Error removing token:", e);
        }
    };

    return (
        <usercontext.Provider value={{
            accessToken,
            setaccessToken,
            user,
            setUser,
            product,
            setProduct,
            login,
            logout,
            isLoading
        }}>
            {children}
        </usercontext.Provider>
    );
};