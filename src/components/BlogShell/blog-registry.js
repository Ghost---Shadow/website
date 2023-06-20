import React from 'react';

export const blogRegistry = [
//   {
//   slug: 'immigrating-to-germany',
//   title: 'The Journey from India to Germany: A Guide for IT Professionals',
//   component: React.lazy(() => import('../../blog/immigrating-to-germany/index.mdx')),
//   date: '20 Jun 2023',
// },
  {
    slug: 'how-autogpt-works-under-the-hood',
    title: 'How does AutoGPT work under the hood?',
    component: React.lazy(() => import('../../blog/how-autogpt-works-under-the-hood/index.mdx')),
    date: '03 May 2023',
  },
  {
    slug: 'unit-test-recorder',
    title: 'Unit Test Recorder - Automatically generate unit tests as you use your application',
    component: React.lazy(() => import('../../blog/unit-test-recorder/index.mdx')),
    date: '25 Jun 2020',
  },
  {
    slug: 'migrate-to-istio',
    title: 'How to migrate from vanilla Kubernetes to Istio service mesh?',
    component: React.lazy(() => import('../../blog/migrate-to-istio/index.mdx')),
    date: '14 Oct 2019',
  }];

export const slugToId = blogRegistry.reduce((acc, next, idx) => ({
  ...acc,
  [next.slug]: idx,
}), {});
