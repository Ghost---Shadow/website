import React, { Suspense } from 'react';

import Landing from '../components/Landing';

const Biography = React.lazy(() => import('../components/Biography'));

function LandingPage() {
  return (
    <>
      <Landing />
      <Suspense>
        <Biography />
      </Suspense>
    </>
  );
}

export default LandingPage;
