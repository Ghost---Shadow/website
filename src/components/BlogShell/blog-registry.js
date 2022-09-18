import React from 'react';

export const blogRegistry = [{
  slug: 'page2',
  title: 'Lorem Ipsum 2',
  component: React.lazy(() => import('../../blog/page2.mdx')),
  date: '20 Feb 2022',
},
{
  slug: 'unit-test-recorder',
  title: 'Unit Test Recorder - Automatically generate unit tests as you use your application',
  component: React.lazy(() => import('../../blog/unit-test-recorder.mdx')),
  date: '25 Jun 2020',
}];

export const slugToId = blogRegistry.reduce((acc, next, idx) => ({
  ...acc,
  [next.slug]: idx,
}), {});
