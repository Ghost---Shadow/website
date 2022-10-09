import React from 'react';

import Illustration from './illustration';

export default {
  title: 'Components/Landing/Illustration',
  component: Illustration,
};

function Template() {
  return <div style={{ height: '600px', width: '600px' }}><Illustration /></div>;
}

export const Default = Template.bind({});
Default.args = {};
