import React from 'react';
import type { Meta, StoryObj } from '@storybook/react';

import IconCounterButton from './index';
import Icon from '../../../icons/Icon';


const meta: Meta<typeof IconCounterButton> = {
  title:      'Components/Reusables/IconCounterButton',
  component:  IconCounterButton,
  tags:       ['autodocs'],
  args:       { },
  decorators: [
    Story => (
      <div>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof IconCounterButton>;

export const CameraButton: Story = {
  args: {
    icon:    <Icon name="camera-plus" />,
    onClick: () => console.log('clicked'),
  },
};
