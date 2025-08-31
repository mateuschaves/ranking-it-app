import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { GetUserProfileResponse } from '~/api/resources/core/get-user-profile';
import { asyncStorage, StorageKeys } from '~/shared/storage_service';
import * as SplashScreen from 'expo-splash-screen';

interface UserContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    user: GetUserProfileResponse | null;
    setUser: React.Dispatch<React.SetStateAction<GetUserProfileResponse | null>>;
    isLoading: boolean;
    checkAuthStatus: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<GetUserProfileResponse | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const checkAuthStatus = async () => {
        try {
            console.log('🔍 Checking auth status...');
            const accessToken = await asyncStorage.getItem(StorageKeys.ACCESS_TOKEN);
            console.log('📱 Token found:', !!accessToken);

            if (accessToken) {
                try {
                    const decodedToken = JSON.parse(atob(accessToken.split('.')[1]));
                    const isTokenValid = decodedToken.exp * 1000 > Date.now();
                    console.log('🔑 Token valid:', isTokenValid);

                    if (isTokenValid) {
                        setIsAuthenticated(true);
                        console.log('✅ User authenticated');
                    } else {
                        console.log('❌ Token expired, removing...');
                        setIsAuthenticated(false);
                        await asyncStorage.removeItem(StorageKeys.ACCESS_TOKEN);
                    }
                } catch (error) {
                    console.error("❌ Invalid token format", error);
                    setIsAuthenticated(false);
                    await asyncStorage.removeItem(StorageKeys.ACCESS_TOKEN);
                }
            } else {
                console.log('❌ No token found');
                setIsAuthenticated(false);
            }
        } catch (error) {
            console.error("❌ Error checking auth status", error);
            setIsAuthenticated(false);
        } finally {
            console.log('🏁 Auth check complete, hiding splash...');
            setIsLoading(false);
            // Add a small delay to ensure smooth transition
            setTimeout(async () => {
                await SplashScreen.hideAsync();
                console.log('👋 Splash screen hidden');
            }, 100);
        }
    };

    useEffect(() => {
        checkAuthStatus();
    }, []);

    return (
        <UserContext.Provider value={{
            isAuthenticated,
            setIsAuthenticated,
            user,
            setUser,
            isLoading,
            checkAuthStatus
        }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUserContext = (): UserContextType => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUserContext must be used within a UserProvider');
    }
    return context;
};