import { createContext, useState } from 'react';

export const SliderContext = createContext('');

const SliderContextProvider = ({children}) => {
    let currentMonth = new Date().getMonth() + 1;
    const [sliderVal, setSliderVal] = useState(currentMonth);

    return (
        <SliderContext.Provider value={{ sliderVal, setSliderVal }}>
            {children}
        </SliderContext.Provider>
    )
}

export default SliderContextProvider;