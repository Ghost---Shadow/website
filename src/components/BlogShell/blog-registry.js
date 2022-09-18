import React from 'react';

export const blogRegistry = [{
  slug: 'page2',
  title: 'Lorem Ipsum 2',
  component: React.lazy(() => import('../../blog/page2.mdx')),
  date: '20 Feb 2022',
},
{
  slug: 'page1',
  title: 'Lorem Ipsum 1',
  component: React.lazy(() => import('../../blog/page1.mdx')),
  date: '19 Feb 2022',
}];

export const slugToId = blogRegistry.reduce((acc, next, idx) => ({
  ...acc,
  [next.slug]: idx,
}), {});
