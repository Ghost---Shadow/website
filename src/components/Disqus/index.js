import { useEffect } from 'react';
import PropTypes from 'prop-types';

const disqusScript = (slug) => {
  // eslint-disable-next-line
  function disqus_config() {
    this.page.url = window.location;
    this.page.identifier = slug;
  }

  const d = document; const
    s = d.createElement('script');
  s.src = 'https://ad-absurdum.disqus.com/embed.js';
  s.setAttribute('data-timestamp', +new Date());
  (d.head || d.body).appendChild(s);
};

function DisqusComments({ slug, colorScheme }) {
  useEffect(() => {
    disqusScript(slug);
  }, [slug, colorScheme]);

  return (
    <div className="disqus_container" id="disqus_thread" />
  );
}

DisqusComments.propTypes = {
  slug: PropTypes.string.isRequired,
  colorScheme: PropTypes.string.isRequired,
};

export default DisqusComments;
