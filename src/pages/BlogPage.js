import { Center, Loader } from '@mantine/core';
import React, { Suspense } from 'react';

const BlogShell = React.lazy(() => import('../components/BlogShell'));

function BlogPage() {
  return (
    <Suspense fallback={<Center sx={{ margin: '30vh 0' }}><Loader /></Center>}>
      <BlogShell />
    </Suspense>
  );
}

export default BlogPage;
