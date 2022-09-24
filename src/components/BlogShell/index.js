import {
  Container,
  Drawer,
  Group,
  ActionIcon,
  Anchor,
  Text,
  Stack,
  Center,
  Loader,
} from '@mantine/core';
import { Suspense, useState, useEffect } from 'react';
import { IconMenu2, IconHome } from '@tabler/icons';
import PropTypes from 'prop-types';
import { useParams, Link } from 'react-router-dom';
import { createWorkerFactory, useWorker } from '@shopify/react-web-worker';
import SocialMediaLinks from '../common/SocialMediaLinks';
import { blogRegistry, slugToId } from './blog-registry';
import './prism-vsc-dark-plus.css';
import DisqusComments from '../Disqus';

const highlightWorker = createWorkerFactory(() => import('../../highlight-worker'));

function BlogListItem({ slug, title, date }) {
  return (
    <Stack sx={{ gap: 0, margin: '1rem 0' }}>
      <Anchor component={Link} sx={{ margin: 0 }} to={`/blog/${slug}`}>{title}</Anchor>
      <Text color="subtle">{date}</Text>
    </Stack>
  );
}

BlogListItem.propTypes = {
  slug: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  date: PropTypes.string.isRequired,
};

function Footer() {
  return (
    <Center>
      <Text sx={{ fontFamily: 'arial' }} color="white">You are a curious guy. I like you. ( ͡° ͜ʖ ͡°)</Text>
    </Center>
  );
}

function WrappedBlog({ children, slug }) {
  const worker = useWorker(highlightWorker);
  useEffect(() => {
    worker.highlight();
    window.scrollTo(0, 0);
  }, [worker, slug]);

  return children;
}

WrappedBlog.propTypes = {
  children: PropTypes.node.isRequired,
  slug: PropTypes.string.isRequired,
};

function BlogShell() {
  const { slug } = useParams();

  const [drawerOpen, setDrawerOpen] = useState(false);

  const toggleDrawer = () => {
    setDrawerOpen((lastDrawerState) => !lastDrawerState);
  };

  const id = slugToId[slug];
  const activePage = blogRegistry[id || 0];

  const blogDoms = blogRegistry.map((blogItem) => (
    <BlogListItem
      key={blogItem.slug}
      slug={blogItem.slug}
      title={blogItem.title}
      date={blogItem.date}
    />
  ));

  return (
    <>
      <Container sx={{ marginTop: '2rem' }}>
        <Group position="right">
          <ActionIcon
            variant="subtle"
            color="dark"
            radius="xs"
            component={Link}
            to="/"
          >
            <IconHome />
          </ActionIcon>
          <SocialMediaLinks />
          <ActionIcon
            variant="subtle"
            color="dark"
            radius="xs"
            onClick={toggleDrawer}
          >
            <IconMenu2 />
          </ActionIcon>
        </Group>
        <Suspense fallback={<Center sx={{ margin: '30vh 0' }}><Loader /></Center>}>
          <WrappedBlog slug={slug}>
            <activePage.component />
          </WrappedBlog>
        </Suspense>
        <hr />
        <DisqusComments slug={slug} />
        <hr />
        <Center sx={{ flexDirection: 'column' }}>
          <Text component="h3">
            All articles
          </Text>
          {blogDoms}
        </Center>
        <Footer />
      </Container>
      <Drawer
        opened={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        position="right"
      >
        <Container>
          {blogDoms}
        </Container>
      </Drawer>
    </>
  );
}

export default BlogShell;
