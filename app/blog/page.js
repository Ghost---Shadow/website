import { redirect } from 'next/navigation';
import { blogRegistry } from '../../src/components/BlogShell/blog-registry';

export default function Blog() {
  // Redirect to the latest blog post (first in registry)
  redirect(`/blog/${blogRegistry[0].slug}`);
}
