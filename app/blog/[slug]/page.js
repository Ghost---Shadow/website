import BlogPage from '../../../src/pages/BlogPage';

export async function generateStaticParams() {
  const { blogRegistry } = await import('../../../src/components/BlogShell/blog-registry');

  return blogRegistry.map((blog) => ({
    slug: blog.slug,
  }));
}

export default function BlogPost({ params }) {
  return <BlogPage slug={params.slug} />;
}
