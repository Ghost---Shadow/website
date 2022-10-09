import React from 'react';

export const blogRegistry = [{
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
