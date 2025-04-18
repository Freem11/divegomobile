import React, { ReactElement } from 'react';
import Svg, { Path, SvgProps } from 'react-native-svg';
import config from './_config.json';

type IconName = keyof typeof config;

type Props = {
  name:       IconName
};
type viewBoxEncoded = string | number | null | Array<number>;

const getFigure = (content: string): ReactElement | null => {
  if (!content) {
    return null;
  }

  if (content.startsWith('<')) {
    return <g dangerouslySetInnerHTML={{ __html: content }}></g>;
  } else {
    return <Path d={content}></Path>;
  }
};

const getViewBox = (data: viewBoxEncoded): string => {
  let result = '';
  if (!data) {
    return result;
  }

  if (Array.isArray(data)) {
    if (data.length === 1) {
      result = `0 0 ${data[0]} ${data[0]}`;
    }
    if (data.length === 2) {
      result = `0 0 ${data[0]} ${data[1]}`;
    }
    if (data.length === 4) {
      result = data.join(' ');
    }
  }

  if (typeof data === 'string') {
    result = data;
  }

  if (typeof data === 'number') {
    result = `0 0 ${data} ${data}`;
  }

  return result;
};


const Icon = (props: Props & SvgProps) => {
  if (!config) {
    console.error(`_config.json not found. Run "_build-svg.js" generate config.`);
    return <></>;
  }

  const { ...restProps } = props;
  const iconName = props.name;
  if (!iconName) {
    console.error(`icon name is required.`);
    return <></>;
  }

  if (!(iconName in config)) {
    console.error(`icon "${iconName}" not found in _config.json. Run "_build-svg.js" to add new icons to the config.`);
    return <></>;
  }

  const viewBox = getViewBox(config[iconName][0]);
  const figure = getFigure(String(config[iconName][1]));
  if (!figure) {
    console.error(`icon "${iconName}" is empty in _config.json. Config might be corrupted or svg file is invalid.`);
    return <></>;
  }

  return (
    <Svg
      {...(viewBox ? { viewBox } : {})}
      fill="currentColor"
      {...restProps}
    >
      {figure}
    </Svg>
  );
};

export default Icon;
export type { IconName, Props };
