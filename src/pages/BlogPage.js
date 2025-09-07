import PropTypes from 'prop-types';
import BlogShell from '../components/BlogShell';

function BlogPage({ slug }) {
  return <BlogShell slug={slug} />;
}

BlogPage.propTypes = {
  slug: PropTypes.string.isRequired,
};

export default BlogPage;
