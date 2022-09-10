import React from 'react';

import Biography from '.';

export default {
  title: 'Components/Biography',
  component: Biography,
};

function Template() {
  return <Biography />;
}

export const Default = Template.bind({});
Default.args = {};
