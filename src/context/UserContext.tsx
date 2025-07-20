import React, { createContext, useContext, useState, ReactNode } from 'react';
import { GetUserProfileResponse } from '~/api/resources/core/get-user-profile';

interface UserContextType {
    isAuthenticated: boolean;
    setIsAuthenticated: React.Dispatch<React.SetStateAction<boolean>>;
    user: GetUserProfileResponse | null;
    setUser: React.Dispatch<React.SetStateAction<GetUserProfileResponse | null>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

interface UserProviderProps {
    children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
    const [user, setUser] = useState<GetUserProfileResponse | null>(null);

    return (
        <UserContext.Provider value={{ isAuthenticated, setIsAuthenticated, user, setUser }}>
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