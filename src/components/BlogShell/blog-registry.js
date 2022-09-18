import React from 'react';

const blogRegistry = [
  {
    id: 0,
    title: 'Page 1',
    component: React.lazy(() => import('../../blog/page1.mdx')),
    date: '19-Feb-2022',
  },
  {
    id: 1,
    title: 'Page 2',
    component: React.lazy(() => import('../../blog/page2.mdx')),
    date: '20-Feb-2022',
  },
];

const sortedBlogRegistry = blogRegistry.sort((obj1, obj2) => obj1.date < obj2.date);

export default sortedBlogRegistry;
