import React from 'react';

export const blogRegistry = [
  {
    slug: 'sort-of-perpetual-motion-machine',
    title: 'The Scalable Quasi-Perpetual Photonic Machine',
    component: React.lazy(() => import('../../blog/sort-of-perpetual-motion-machine/index.mdx')),
    date: '17 Nov 2025',
  },
  {
    slug: 'how-to-make-a-ball-orbit-itself',
    title: 'How to Make a Ball Orbit Itself',
    component: React.lazy(() => import('../../blog/how-to-make-a-ball-orbit-itself/index.mdx')),
    date: '08 Nov 2025',
  },
  {
    slug: 'boron-nitrogen-catastrophe',
    title: 'The Boron-Nitrogen Catastrophe: A Critical Gap in Beta Decay Verification',
    component: React.lazy(() => import('../../blog/boron-nitrogen-catastrophe/index.mdx')),
    date: '28 Oct 2025',
  },
  {
    slug: 'x-ray-data-pipelines',
    title: 'X-Ray Data Pipeline: Ultra-High-Speed Communication Through Limestone Tubes',
    component: React.lazy(() => import('../../blog/x-ray-data-pipelines/x-ray-data-pipelines.mdx')),
    date: '26 Oct 2025',
  },
  {
    slug: 'universal-approximation-theorem-is-right',
    title: 'The Universal Approximation Theorem Is Right. You\'re Using It Wrong.',
    component: React.lazy(() => import('../../blog/universal-approximation-theorem-is-right/index.mdx')),
    date: '19 Oct 2025',
  },
  {
    slug: 'the-power-law-illusion',
    title: 'The Power Law Illusion: A Measurement Artifact Hypothesis',
    component: React.lazy(() => import('../../blog/the-power-law-illusion/index.mdx')),
    date: '11 Oct 2025',
  },
  {
    slug: 'fractional-gamma-function',
    title: 'Fractional Gamma Function via Fractional Derivatives',
    component: React.lazy(() => import('../../blog/fractional-gamma-function/index.mdx')),
    date: '18 Sep 2025',
  },
  {
    slug: 'cruel-irony-of-p-np-problem',
    title: 'On the cruel irony of the P-NP problem',
    component: React.lazy(() => import('../../blog/cruel-irony-of-p-np-problem/index.mdx')),
    date: '18 Dec 2023',
  },
  {
    slug: 'immigrating-to-germany',
    title: 'The Journey from India to Germany: A Guide for IT Professionals',
    component: React.lazy(() => import('../../blog/immigrating-to-germany/index.mdx')),
    date: '20 Jun 2023',
  },
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
  },
];

export const slugToId = blogRegistry.reduce((acc, next, idx) => ({
  ...acc,
  [next.slug]: idx,
}), {});
