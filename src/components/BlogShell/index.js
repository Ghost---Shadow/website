import PropTypes from 'prop-types';
import Link from 'next/link';
import SocialMediaLinks from '../common/SocialMediaLinks';
import { blogRegistry, slugToId } from './blog-registry';
import './prism-vsc-dark-plus.css';

function BlogListItem({ slug, title, date }) {
  return (
    <div style={{ margin: '1rem 0' }}>
      <Link href={`/blog/${slug}`} style={{ textDecoration: 'none' }}>
        <a style={{ color: '#0066cc', textDecoration: 'underline' }}>{title}</a>
      </Link>
      <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.25rem' }}>{date}</div>
    </div>
  );
}

BlogListItem.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

function Footer() {
  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <p style={{ fontFamily: 'arial', color: 'white' }}>You are a curious guy. I like you. ( ͡° ͜ʖ ͡°)</p>
    </div>
  );
}

function BlogShell({ slug }) {
  const id = slugToId[slug];

  if (!slug || id === undefined) {
    return null;
  }

  const activePage = blogRegistry[id];

  const blogDoms = blogRegistry.map((blogItem) => (
    <BlogListItem
      key={blogItem.slug}
      slug={blogItem.slug}
      title={blogItem.title}
      date={blogItem.date}
    />
  ));

  return (
    <div style={{ 
      maxWidth: '800px', 
      margin: '2rem auto', 
      padding: '0 1rem' 
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'flex-end',
        marginBottom: '2rem',
        gap: '1rem'
      }}>
        <Link href="/">
          <a style={{
            display: 'inline-block',
            padding: '0.5rem',
            color: '#333',
            textDecoration: 'none',
            border: '1px solid #ddd',
            borderRadius: '4px'
          }}>
            Home
          </a>
        </Link>
        <SocialMediaLinks />
      </div>
      <activePage.component />
      <hr style={{ margin: '2rem 0' }} />
      <div>
        <h3 style={{ textAlign: 'center' }}>
          All articles
        </h3>
        {blogDoms}
      </div>
      <Footer />
    </div>
  );
}

BlogShell.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default BlogShell;
