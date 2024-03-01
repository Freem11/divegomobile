import { createContext, useState } from 'react';

export const TutorialLaunchPadContext = createContext('');

const TutorialLaunchPadContextProvider = ({children}) => {
    const [tutorialLaunchpadModal, setTutorialLaunchpadModal] = useState(false);

    return (
        <TutorialLaunchPadContext.Provider value={{ tutorialLaunchpadModal, setTutorialLaunchpadModal }}>
            {children}
        </TutorialLaunchPadContext.Provider>
    )
}

export default TutorialLaunchPadContextProvider;