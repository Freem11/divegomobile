import { createContext, useState } from 'react';

export const ReplyLevelContext = createContext('');

const ReplyLevelContextProvider = ({children}) => {
    const [replyLevel, setReplyLevel] = useState(0);

    return (
        <ReplyLevelContext.Provider value={{ replyLevel, setReplyLevel }}>
            {children}
        </ReplyLevelContext.Provider>
    )
}

export default ReplyLevelContextProvider;