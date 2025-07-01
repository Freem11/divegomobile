import { createContext, useState } from 'react';

export const UserProfileContext = createContext('');

const UserProfileContextProvider = ({ children }) => {
    const [profile, setProfile] = useState([]); // TODO Matt add typing, its now an object and not an array

    return (
        <UserProfileContext.Provider value={{ profile, setProfile }}>
            {children}
        </UserProfileContext.Provider>
    )
}

export default UserProfileContextProvider;