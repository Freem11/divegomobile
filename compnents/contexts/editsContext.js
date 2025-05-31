import { createContext, useState } from 'react';

export const EditsContext = createContext('');

const EditsContextProvider = ({children}) => {
    const [editInfo, setEditInfo] = useState(null);

    return (
        <EditsContext.Provider value={{ editInfo, setEditInfo }}>
            {children}
        </EditsContext.Provider>
    )
}

export default EditsContextProvider;