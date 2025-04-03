import * as React from 'react';
import Svg, { Path } from 'react-native-svg';

interface SvgProps {
    height?: number | string;
    width?: number | string;
    color?: string;
  }

function DivingScubaFlag(props:SvgProps) {
    const { height, width, color = "black" } = props;
    return (
      <Svg viewBox="0 0 512 512.0131" 
      height={height}
      width={width}
      {...props}>
        <Path d="M43 128.01l362 299H43v-299zm64-43l362 299v-299H107z"  fill={color}/>
      </Svg>
    );
  };

export default DivingScubaFlag;
